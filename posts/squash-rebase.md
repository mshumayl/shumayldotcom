---
title: 'Intuitive Approach to Git Squash and Rebase'
image: '/images/my-life-through-a-lens-bq31L0jQAjU-unsplash.jpg'
excerpt: 'A mental model for squashing and rebasing your commits.'
date: '2022-01-23'
tags: 
    - 'oss'
---
`git squash` and `git rebase` are operations that can be used to clean up your commits history. As such, these operations are destructive to a repository's revision tree. They must be used with care, lest you will find yourself in a massive headache.

There's always an active discussion on whether doing [squash and rebase is a good idea](https://www.youtube.com/watch?v=7gEbHsHXdn0), but some OSS projects require you to do so nonetheless. This post will guide you through the intuitions behind the most basic usage of squash and rebase -- to clean up your commits before merging your branch with the main branch of the repository.

# What does squash do?
Think flattening multiple commits into one. `git squash` allows you to select 

# What does rebase do?
Think moving the base of your commits in a way that it matches the commits of the main branch.

# How are they both used?


# When not to do squash and rebase?
These operations both replace the hashes (think ID) of your commits with new hashes. 