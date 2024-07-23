---
title: 'Just a Config File'
image: '/images/adi-goldstein-HLS7GQ0BCOQ-unsplash.jpg'
excerpt: 'CrowdStrike outage, and our complacency with config changes.'
date: '2024-07-23'
tags: 
    - 'thoughts'
---
## How it happened
Last Friday, on 19th June 2024, the world experienced an unprecedented IT outage that temporarily crippled critical systems across the globe. The scale of this disruption was unparalleled in modern history, leaving many to question how such a catastrophic event could occur.

A curious aspect of this incident was how an update to a kernel-level process seemingly bypassed all industry-standard deployment and rollout practices. The answer lies in the nature of the update itself — it wasn't a code change, but rather "just" a config change (the config file is referred to as a ["Channel File"](https://www.crowdstrike.com/blog/falcon-update-for-windows-hosts-technical-details/) by CrowdStrike). This distinction may have led to the update receiving less scrutiny than it warranted.

"Just" a config change that triggered an outage has been estimated to cause [billions in losses worldwide](https://www.scmp.com/news/world/article/3271419/crowdstrike-outage-cost-economy-tens-billions-dollars-and-firms-want-recoup-losses).

The magnitude of this failure also exposes the hyperfragility of our global IT infrastructure, stemming from over-reliance on a handfull of cybersecurity vendors. This consolidation has created a precarious situation where a single point of failure can cause widespread disruption — but I digress and leave this discussion for another post.

## Moving forward
As someone who works in the software development space, I admit to having been guilty of treating production config changes with less gravity than they deserve. This incident serves as a stark wake up call for me. 

In an ideally antifragile system, any update capable of altering runtime logic merits the same level of care and scrutiny as code change. We should not manually chuck a new `config_prod.json` into a config bucket on S3 without taking the time to go through the necessary CRs and PRs. 

As software builders, we need to invest time in building robust pipelines that perform thorough sanity checks — even for "just" a config update.

Lest any one of us might be the next source of a global outage. 

Read CrowdStrike's latest technical update here: [https://www.crowdstrike.com/blog/falcon-update-for-windows-hosts-technical-details/](https://www.crowdstrike.com/blog/falcon-update-for-windows-hosts-technical-details/)