---
title: 'Contributing Code to Open Source'
image: '/images/my-life-through-a-lens-bq31L0jQAjU-unsplash.jpg'
excerpt: 'Crafting the perfect PR.'
date: '2022-01-17'
tags: 
    - 'open-source'
    - 'tutorial'
---
Contributing to open-source software projects can be intimidating, with all the different standards and requirements between different codebases. Some projects have their own [contribution guidelines](https://github.com/einsteinpy/einsteinpy/blob/main/CONTRIBUTING.rst) you can refer to.  

If the project you are working on do not have their own guidelines, fret not! This blog post will bring you through some basic elements for a great pull request. These general guidelines will help you craft a PR that's clear, well-written, and well-organized, all of which will increase the chance that your code will be approved for implementation.

## Communicating your intention
Open-source software development is a collaborative process. As such, good communication is imperative to a good contribution. 

It would be a huge waste of time if you coded up a solution that ends up being rejected by the core maintainers of the project. To avoid this, you should communicate your intention by either providing a thorough description of your solution at any open Issues, or creating an Issue that concisely describes the problem and your solution. Some projects even have [Issue templates](https://github.com/stevemao/github-issue-templates) you can refer to.

## Implementing clean and maintainable code
Once you have communicated the changes that you intend to make, now is the time to write your code. It is crucial to keep your code as contained as possible, without messing with parts of the codebase that do not pertain your implementation.

Some codebases use a specific set of linters and code formatters, so be sure to check the project guidelines for any special tools they use to keep the code style consistent throughout the codebase. 

Also, when committing your changes, be sure to have a descriptive message for the changes you are committing. A good commit is concise, and generally you should not commit broken or half-complete code.

Some projects require you to [squash and rebase](https://adamj.eu/tech/2022/03/25/how-to-squash-and-rebase-a-git-branch/) your commits into a single commit to reduce clutter on the main branch, so be sure to check the project guidelines should they require it. 

## Writing tests
After implementing your solution, you should ensure that your solution works. Writing test cases ensures that you do not introduce any nasty bugs into the codebase, and that all other parts of the codebase do not break with the introduction of your code.

Optimally, you should also ensure that the test coverage for the project do not fall lower than they were before the implementation of your code. This means that you need to ensure 100% coverage for your newly-introduced code.

## Updating the documentation
Writing documentation for your new implementation is as important as writing the implementation itself. Without proper documentation, it would be hard for end-users to understand your contribution and the improvement you have made for them, the end-users. It also gives context on the changes you have made and the motivation behind the implementation. 

Without proper documentation, the software you just wrote will be inaccessible for the end-users.

## Submitting a pull request
When drafting a PR, you should ensure that you describe your changes in detail and link it to the related Issue(s). This allows maintainers to easily understand the context for the change.

You should also request for help from the maintainers to review your code and ensure that they satisfy the requirements for the project. They can also give insights on a better method to implement your solution, as they are most likely more familiar with codebase than you are.

## Finish by updating the changelog
After a successful review, you can enjoy the hit of dopamine as you get to finally update the projects `changelog.md` file and inscribe your name in the long list of contributors for the project!