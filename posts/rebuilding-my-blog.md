---
title: 'Re-re-rebuilding My Blog Site'
image: '/images/benjamin-lehman-EJU7A__krX0-unsplash.jpg'
excerpt: 'DJ Khaled soundbite: Another one.'
date: '2022-01-15'
tags: 
    - 'web-dev'
---
Another year, [another one](https://www.youtube.com/watch?v=E71Dlf4ccXQ).

So this is my new blog. It is powered with Next.js. From the get-go, my intention was to keep things to a bare minimum for maintainability, iteration speed, and performance.

## So how did I build this site?
To keep things simple, I am now storing posts in the repository filesystem. They're processed with `gray-matter`, and they're pre-rendered at build time as defined in the `getStaticPaths` function in `post/[slug].tsx`. This should make it Blazingly Fast™ to navigate between web pages, improving user experience.

Conversely, to improve dev experience, I am using Tailwind to handle all the CSS stylings done for this website. Every now and then, people will get into a huge debate on why they like/dislike Tailwind, but personally I lean on the pro-Tailwind camp. I believe that the abstractions introduced by Tailwind help you adhere to a well-crafted design system.

Most importantly, on the topic of dev experience, I am weasing my way into the type safety cult. Working with TypeScript allows a "no compromise policy" when it comes to passing states from one logic block to another. This ensures that there are no runtime errors that come from unexpected data types, and having access to types at all times greatly improved my iteration speed. An apt analogy of working with TypeScript is like having an observant teacher watching over your shoulder 24/7, preventing you from making mistakes. Creepy? Maybe. Effective? Absolutely!

The code for this website is fully open-sourced on [my GitHub](https://github.com/mshumayl/shumayldotcom), so have at it, fellow nerds.

## So what next?
At the moment of writing this, I am only deploying the MVP for the blog, which includes a list of blog posts and the post pages, not much else. I will keep on building and improving this site, piecewise. Things that will be added in the future include social meta tags, querying for blog posts, listing posts by tags, and viewing posts by publication date.