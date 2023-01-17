---
title: 'Contributing Code to OSS'
image: '/images/my-life-through-a-lens-bq31L0jQAjU-unsplash.jpg'
excerpt: 'Crafting the perfect PR.'
date: '17-01-2022'
tags: 
    - 'oss'
---
Contributing to an open-source software may seem intimidating, with all the different standards and requirements between different codebases. However, there are a few core components to a great PR. Here are a few tips you should keep in mind when contributing to open-source software development. 

## Communicating your intention
Open-source software development is a collaborative process. As such, good communication is imperative to a good contribution. 

It'd be a huge waste of time if you coded up a solution that ends up being rejected by the core maintainers of the project. To avoid this, you should communicate your intention by either providing a thorough description of your solution at any open Issues, or opening up an Issue that describes the problem and solution in a concise manner. Some projects even have Issue templates you can refer to.

## Implementing clean and maintainable code
Once you have communicated the changes that you intend to make, now is the time to write up your code. It is crucial to keep your code as contained as possible, without messing with parts of the codebase that do not pertain your implementation.

Some codebases use a specific set of linters and code formatters, so be sure to check the project guidelines for any special tools they use to keep the code style consistent throughout the codebase. 

Also, when committing your changes, be sure to have a descriptive message for the changes you are committing. A good commit is concise and addresses a complete logic, and you should not commit broken or 'halfway' code.

Some projects require you to rebase and squash your commits into a single commit to reduce clutter on the main branch, so be sure to check the project guidelines should they require it. 

## Writing tests
After implementing your solution, you should ensure that your solution works. This is the point where you write up test cases for your implementation logic. It is also important to make sure that all other parts of the codebase do not break with the introduction of your code.

Optimally, you should also ensure that the test coverage for the project do not fall lower than they were before the implementation of your code. This means that you need to ensure 100% coverage for your newly-introduced code.

## Updating the documentation
Writing documentation for your new implementation is as important as writing the implementation itself. Without proper documentation, it would be hard for end-users to understand your contribution and the improvement you have made for them, the end-users. It also gives context on the changes you have made and the motivation behind the implementation. 

Without proper documentation, the software will be inaccessible for the end-users.

## Submitting a Pull Request
When drafting a PR, you should ensure that you describe your changes in detail and link it to the related Issue(s). This allows maintainers easily understand the context for the change.

You should also request for help from the maintainers to review your code and ensure that they satisfy the requirements for the project. They can also give insights on a better method to implement your solution, as they are most likely more familiar with codebase than you are.

## Updating the Changelog
After a successful review, you can enjoy the hit of dopamine as you get to finally update the changelog and inscribe your name in the long list of contributors for the project.

Congratulations! You have crafted a great contribution to open-source software.