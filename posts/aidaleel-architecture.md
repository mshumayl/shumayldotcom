---
title: 'Behind the Scenes of an AI App'
image: '/images/markus-winkler-yYpmCA32U_M-unsplash.jpg'
excerpt: 'A deep dive into the AI-Daleel system architecture.'
date: '2023-04-30'
tags: 
    - 'machine-learning'
    - 'web-dev'
---


![AI-Daleel system architecture.](/images/system_architecture.png)
*AI-Daleel system architecture.*

## AI-Daleel
Recently, I published [AI-Daleel](https://www.ai-daleel.com/), a personal side project I have been working on in my free time in Ramadan. Tersely, it's a tool that let's you search for Quranic verses with natural language search terms and rough transliterations. 

It addresses a personal pain point of mine when it comes to Googling for Quranic verses. It's unreliable, messy, and slow. AI-Daleel aims to solve this.

On top of the search feature, AI-Daleel also lets you:
- Bookmark verses
- Add notes to your verses
- Generate notes based on verse translations

In this post, we will explore the system architecture of AI-Daleel, with a deep dive on the tech stack and cloud technologies used.

## Core components
There are 3 core components that make up AI-Daleel:
1. Web application — This is where the users interact with the system.
2. Database — This is where the data is stored.
3. Serverless function — This is how the quota refresh is implemented.

### 1. Web application
The web application is a TypeScript app built on the [T3 stack](https://create.t3.gg/). It consists of five elements:
#### Next.js
Next.js is an open-source full-stack React framework that allows us to run both front-end and back-end code in a single repository. It comes with all the usual React goodness, such as client states handling, re-rendering, and componentization. Additionally, Next.js offers support for pre-rendering HTML documents on the server via Static Site Generation (SSG) and Server-Side Rendering, which can be configured independently for each page in the `/pages` directory. Next.js automatically defines a route for every file in this directory, as it uses folder-based routing instead of controller-attached route definitions found in MVC-based frameworks.

SSG generates pages on the server at build time (during deployment) and serves them as static HTML documents. This means that when a user visits a page, they receive a pre-rendered HTML document (although data fetching and reactive client re-renders can still be done thereafter). For static pages, this approach can significantly improve the time-to-first-byte (TTFB) and enhance SEO by providing fully-rendered HTML documents that search engine crawlers love. Next.js defaults to SSG for all pages, but you can implement SSG explicitly by defining rendering procedures, server-side fetches, and props in the `getStaticProps` function at the top of each page file. For dynamic routes, `getStaticPaths` is also required to let Next.js know what data to fetch based on all the possible routes.

SSR, on the other hand, renders pages on the server at runtime. This means that upon landing on a page, the client will send a request to the server for the HTML document. Logically, this approach has a slower TTFB as compared to SSG for static pages, and there is more server compute needed as each request gets a unique pre-render. However, for pages with a lot of data fetching and complex server-side logic, the TTFB can be faster than SSG. SSR is also best for instances where you need user-specific data to be rendered on the get-go, like authentication and authorization. To implement SSR in Next.js, you need to define the data fetching procedure in the `getServerSideProps` function at the top of your page file.

For AI-Daleel, only the landing page is rendered with SSG. This page does not require any complex server-side logic and data fetching at initial page load, and mainly contains static information. The client can then fetch the user session from the server after initial page load. For other pages, we opted for SSR as we want to protect the routes via authentication, mainly to prevent DDoS on the OpenAI API calls and implement user-level rate limiting. The `/verse/[surah_verse]` route also can't be rendered with SSG as there are too many verses to fetch from the database (6,236 rows to be exact), which could result in a terribly long build time, and more $$$ to Amazon.

```
export async function getServerSideProps(context: GetSessionParams | undefined) {
  const session = await getSession(context)

  //If no valid session, redirect to sign-in page.
  if (!session) {
    return {
      redirect: {
        destination: 'auth/signin',
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}
```
*Auth session check using getServerSideProps for protected routes.*

The rendering approach you choose with Next.js will depend on your application's specific requirements. A good mental model is to think about when do you need the data to be made available on the client-side. Then, you should also think about if the data is unique for each session or whether it is a static data that can be fetched once during build time. Ultimately, you should think about the trade-offs you are willing to make between performance, availability, and complexity.

#### tRPC
tRPC is an open-source remote procedure call (RPC) framework designed for TypeScript. It allows for type-safe communication between front-end and back-end code using GraphQL-esque APIs without any code generation.

One of the key benefits of tRPC is that it ensures that the shape and types of the objects returned by the back-end is consistent with what is accepted by the client-side code, and vice versa. This eliminates the need to constantly switch between back-end and front-end files to ensure that the request and response shapes and types are aligned, thus greatly boosting development speed.

It is built around react-query, preserving core functionalities such as `useQuery` and `useMutation`. In its simplest sense, the former is used to make an API call to `read` data, and the latter is reserved for `create`, `update`, or `delete` operations.

`create-t3-app` scaffolds a tRPC implementation that includes a middleware-level auth check via the `protectedProcedure` modifier alias, which checks if the session provided in the tRPC context is valid. This auth check will prevent the tRPC procedure from running if the session is invalid. Therefore, any client requests will only return a response if a valid session is appended along with the tRPC request.

In AI-Daleel, all database CRUD operations and OpenAI inference calls are implemented as tRPC procedures that are protected by middleware session authentication via `protectedProcedure`. This means that only requests from authenticated users with valid sessions are allowed, minimizing the risk of potential DDOS attacks. This security measure is crucial for preventing malicious attacks that could potentially bring down the site and result in significant financial losses.
#### Prisma
Prisma is an open-source type-safe object-relational mapping (ORM) framework that is used to communicate with the database. Prisma Client performs database operations with TypeScript methods in place of native SQL queries. This comes with the benefit of type-safety, ensuring that the server-side query matches the data models and types in `schema.prisma`. For example, this is how the schema for two of the tables in AI-Daleel is defined:

```
model Verses {
    id                  String  @id @unique
    verseText           String
    verseTranslation    String?
    verseNumber         String
    surahNumber         String
}

model UserNotes {
    id                  String @id @default(cuid())
    snippetId           String
    savedSnippets       SavedSnippets @relation(fields: [snippetId], references: [id], onDelete: Cascade)
    content             String
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}
```
*Table definitions in schema.prisma.*

With these, CRUD operations can be done simply by calling methods on the Prisma Client object. In AI-Daleel, this is done on the server-side within a tRPC procedure. Here's an example of how you would use Prisma Client to fetch data from the UserNotes table in the database:

```
//Prisma Client query
const dbRes = await prisma.userNotes.findMany({
    where: {
        snippetId: input.snippetId
    }, 
    select: {
        id: true,
        content: true,
        createdAt: true
    }
})
```

For additional type-safety, you can also implement an interface to ensure that the database response conforms to the return type you require:

```
//In reality, this is defined in the global scope.
type RespT = {
    result: string;
    message?: string;
}

//In reality, this is defined in the scope of the tRPC procedure.
interface getNoteRespT extends RespT {
    data?: {
        content: string,
        id: string,
        createdAt: Date
    }[]
}

//Initialize response object
let response: getNoteRespT;

//Query database using Prisma Client method
const dbRes = await prisma.userNotes.findMany({
    where: {
        snippetId: input.snippetId
    }, 
    select: {
        id: true,
        content: true,
        createdAt: true
    }
})

if (dbRes.length === 0) {
    response = { result: "NO_SAVED_NOTES" }
} else {
    response = { result: "NOTES_RETRIEVED", data: dbRes }
}

return response
```
As you can see, Prisma makes it convenient to query the database, as the ORM returns responses in the form of TypeScript objects which can be guarded by type definitions. This minimizes bugs that may arise from type mismatches and undefined responses.

On top of Prisma Client, Prisma comes with a powerful migration toolkit in the form of the Prisma Migrate. It is a CLI tool which performs database schema migrations and implements safeguards against schema drift.

Essentially, when you run `npx prisma migrate dev` Prisma Migrate generates native SQL procedures and stores migration history in `.sql` files within the `prisma\migrations` directory. It acts as a "source of truth for the history of your data model". The `npx prisma migrate diff` command lets you compare the migration history and make necessary reverts to the schema definition, which is crucial in resolving schema drifts and migration history conflicts.

![Prisma migration history.](/images/prisma-migrations.png)
*Prisma migration history.*

In order to switch between development and production databases in AI-Daleel, we assign the relevant environment variables (in this case, the URLs and the API keys) in the `.env` file to select the desired database to use for migration commands or runtime queries. This can be simplified further with a boolean config variable like `PROD_ENV` that can be used to programmatically assign the right environment variables during runtime.

On top of being a type-safe ORM, Prisma is an indisposable database management toolkit, as it simplifies processes by providing a set of DevEx-friendly CLI tools and configuration files-based workflows in place of conventional GUI-based database management.
#### Tailwind CSS
Tailwind CSS is an open-source "utility-first" CSS framework that provides developers with 
#### NextAuth.js
Authentication implementation for Next.js applications.