---
title: 'Re-re-rebuilding My Blog Site'
image: '/images/benjamin-lehman-EJU7A__krX0-unsplash.jpg'
excerpt: 'DJ Khaled soundbite: Another one.'
date: '15-01-2022'
tags: 
    - 'web-dev'
---
Another year, [another one](https://www.youtube.com/watch?v=E71Dlf4ccXQ).

So this is my new blog. It was built with NextJS. From the get-go, my intention was to keep things to a bare minimum for maintainability, iteration speed, and performance. 

Also, this time I learnt my lesson to not introduce any third-party bloatware that add no value other than superficial gimmicks. Both of my previous websites had some form of fancy animation type-thing on the landing page of the website.

## So how did I build this site?
To keep things simple, I am now storing posts in the repository filesystem. They're processed with `gray-matter`, and they're pre-rendered at build time as defined in the `getStaticPaths` function in `post/[slug].tsx`, which handles the dynamic routing. This should make it Blazingly Fast™ to navigate between web pages, improving user experience.

Conversely, to improve dev experience, I am using Tailwind to handle all the CSS stylings done for this website. Every now and then, people will get into a huge debate on why they like/dislike Tailwind, but personally I lean on the pro-Tailwind camp. I believe that the abstractions introduced by Tailwind helps you adhere to a well-crafted design system.

Most importantly, on the topic of dev experience, I am weasing my way into the type safety cult. The whole project was built with TypeScript, which allows me to easily get the types needed for the states that I pass around from one logic block to another. Coming from a Python background, this is not a huge leap from Python's type hinting system — it is effectively the same in this regard. A key difference here is that unlike Python, type safety in TypeScript is enforced by the interpreter, which means that type errors will be thrown at runtime.

The code for this website is fully open-sourced on [my GitHub](https://github.com/mshumayl/shumayldotcom), so have at it, fellow nerds.

## So what next?
At the moment of writing this, I am only deploying the MVP for the blog, which includes a list of blog posts and the post pages, not much else. I will keep on building and improving this site, piecewise. Things that will be added in the future include social meta tags, querying for blog posts, listing posts by tags, and viewing posts by publication date.