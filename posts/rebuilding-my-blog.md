---
title: 'Re-re-rebuilding My Blog Site'
image: '/images/benjamin-lehman-EJU7A__krX0-unsplash.jpg'
excerpt: 'DJ Khaled soundbite: Another one.'
date: '2022-12-20'
tags: 
    - 'web-dev'
    - 'thoughts'
---
Another year, [another one](https://www.youtube.com/watch?v=E71Dlf4ccXQ).

So this is my new blog. It is powered with Next.js. From the get-go, my intention was to keep things to a bare minimum for maintainability, iteration speed, and performance.

## How did I build this site this time?
To keep things simple, I am now storing posts as files in the repository. They're processed with `gray-matter`, and they're pre-rendered at build time through Next.js's Static Site Generation (SSG) by defining the necessary fetching procedures in the `getStaticPaths` function in the `post/[slug].tsx` dynamic route. This should make it Blazingly Fast™ to navigate between web pages, improving user experience.

On the other hand, to improve development experience (DevEx), I am using Tailwind CSS to handle all the CSS stylings done for this website. Every now and then, people will get into a huge debate on why they like/dislike Tailwind, but personally I lean on the pro-Tailwind camp. I believe that the abstractions introduced by Tailwind help you adhere to a well-crafted design system. The functional approach to styling allows me to iterate faster, while still having the option to opt for class-based styling should the need arise.

Most importantly, on the topic of DevEx, I am weasing my way into the type safety cult. Working with TypeScript allows a "no compromise policy" when it comes to passing states from one logic block to another. This ensures that there are no runtime errors that come from unexpected data types, and having access to types at all times greatly improved my iteration speed. An apt analogy of working with TypeScript is like having an observant teacher watching over your shoulder 24/7, preventing you from making mistakes. Creepy? Maybe. Effective? Absolutely!

For my fellow nerds, the code for this website is fully open-sourced on [my GitHub](https://github.com/mshumayl/shumayldotcom). Feel free to use this as a starting point for your own blog site.