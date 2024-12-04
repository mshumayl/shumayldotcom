---
title: 'Amazon Aurora DSQL: First Impressions'
image: '/images/aurora-dsql.png'
excerpt: 'A new serverless SQL DB offering from AWS.'
date: '2024-12-03'
tags: 
    - 'systems'
---

One of the most exciting announcements at #ReInvent2024 so far: Amazon Aurora DSQL – a new distributed SQL database service on AWS.

## Key features:
- Active-active multi-writer support across multiple AZs and regions.
- 4x faster reads and writes compared to GCP Spanner (though it's not an apple-to-apple comparison).
- PostgreSQL compatible (see caveats in Trade-offs section below) – seamlessly use your existing ORMs and frameworks.
- Optimized for transactions – uses Optimistic Concurrency Control instead of traditional locking, ensuring long transactions don't block others.
- No connection pooling required.
- Satellite time sync with microsecond latency.
- Zero infrastructure management – and no VPC required.

The biggest selling point here is the active-active multi-writer for multi-AZ and multi-region, which makes this offering is a truly distributed, serverless SQL DB. Unsurprisingly, there were some sacrifices made to enable this (trade-offs below).

## Getting started:
1. Create a new Aurora DSQL cluster.
2. Connect your client/app to the cluster endpoint.

Done – apparently it's that simple. With this level of simplicity, I can see this replacing a lot of PoCs and low-volume hobby projects using fully-managed DB alternatives like Supabase (see caveats below).

## But, what about Aurora Serverless v2? Isn't it the same?
1. ASv2 supports cross-region writes with active-passive failover (within ~1 minute). Aurora DSQL delivers true active-active capabilities.
2. ASv2 scales to zero, but resuming can take ~15 seconds. DSQL scales to zero and scales up again seamlessly - true serverless.

## Trade-offs:
It's not perfect though, here are some trade-offs I see so far:
- Maximum 100 GB storage limit per cluster (single database per cluster).
- Only one DDL statement per transaction.
- Maximum 10 MiB transaction write size, 5-minute transaction duration, and 1-hour connection duration.
- Transactions cannot modify more than 10k rows.
- Maximum of 128 MiB memory cap per query.
- Doesn't support views, temp tables, triggers, and foreign key constraints.
- Doesn't support PGVector, PostGIS, and some other extensions.
- IAM-only authentication.

Some are arguing that the lack of FK constraints is a deal-breaker. To me, not using FKs is consistent with the standard practice for distributed systems at scale, which relies on eventual consistency, and referential relationships are enforced at the application level.

There are no pricing information yet as of this post. Aurora is often regarded as being quite expensive for many use cases, so I'm looking forward for the GA to explore into how the pricing works for Aurora DSQL. As with most serverless services, it might be the most cost-effective with low-volume use-cases, e.g. hobby projects, startups, PoCs.

It's a shame that it doesn't support PGVector in this age of AI. Otherwise it'd be perfect for PoC LLM RAG projects like this Langchain-powered [knowledge base Q&A tool](https://github.com/mshumayl/langchain-pgvector) I built a while back with Supabase PGVector as the vectorized store.

Read more:
- [AWS Database Blog: Introducing Amazon Aurora DSQL](https://aws.amazon.com/blogs/database/introducing-amazon-aurora-dsql/)
- [User Guide: Cluster quotas and database limits in Amazon Aurora DSQL](https://docs.aws.amazon.com/aurora-dsql/latest/userguide/CHAP_quotas.html)