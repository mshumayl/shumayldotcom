---
title: 'Simple and Cost-Effective Data Lake Setup for Multi-Account S3 Encryption Analytics'
image: '/images/pexels-zachary-baltimore-2152307015-32160240.jpg'
excerpt: 'A scalable data lake design to monitor S3 object encryption across hundreds of AWS accounts.'
date: '2025-05-21'
tags: 
    - 'cybersecurity'
    - 'cloud'
---

Working in highly regulated industries has taught me one thing: cloud governance at scale is hard. Really hard. Especially when it comes to data security fundamentals like encryption.

When you're managing data security and compliance across hundreds or thousands of AWS accounts, tracking the encryption status of every S3 object becomes a massive challenge. You need complete visibility without compromising data privacy, and you need it without spending a fortune or drowning your team in operational overhead.

This post walks through a practical pattern for solving this problem: building a lightweight data lake that centralizes S3 Inventory reports from all your AWS accounts. By combining structured Parquet storage with Lake Formation's governance and Athena's SQL capabilities, you get efficient, secure, and cost-effective insights into your S3 encryption landscape - all without touching the actual bucket contents ("look Auditor, no hands!").

## Architecture Summary 

![Data lake architecture](/images/s3-datalake.png)
*Our cheap and efficient data lake design.*

### Components and costs
The solution relies on 5 key components.
1. Ingestion: S3 Inventory reports from each child account, exported in Parquet format with Hive-style partitioning. Costs ~$0.0025 per million objects listed.
2. Storage: Central S3 bucket used as the data lake. Costs ~$0.023 per GB-month for the first 50TB and goes down the more you store.
3. Catalog: AWS Glue catalogs the Parquet data with Hive-compatible partitioning (by account and date). First million objects free, then $1 per 100k objects stored above 1 million per month.
4. Access Control: Lake Formation manages fine-grained permissions per account/team. No costs.
5. Query Layer: Athena queries the lake via SQL, with partition pruning for performance. Pay per query, with ~$5 per TB scanned.

### Query flow
As to what happens when a user sends in a SQL query to Athena:
1. Athena parses the query and plans query.
2. Athena gets the schema and partition info from Glue Data Catalog.
3. Athena checks permissions and RBAC from Lake Formation.
4. Athena reads Parquet files from S3.
5. Athena executes query and writes result to a separate S3.
6. Athena returns query result to user.

As you can see, most parts are either free or you pay as you go. You'll know exactly what it costs.

## Step 1: Enable S3 Inventory in Child Accounts
In each child account, enable S3 Inventory on all relevant buckets. This provides a daily object-level listing that includes metadata like size, encryption status, and last modified date—without needing to scan the bucket contents manually and breach the confidentiality of your child accounts.

![Creating inventory config via console.](/images/create-inv-console.png)
*Configuring S3 Inventory via console.*

To programmatically do this across multiple accounts, you can use the `boto3` SDK together with cross-account role assumption. The main method is:
```python
s3_client.put_bucket_inventory_configuration()
```

This method allows you to configure S3 Inventory per bucket. You'll first need to assume into each child account using `boto3.client('sts').assume_role()` with a trusted IAM role and use the returned credentials to create a session scoped to that account. To learn more about cross-account actions, check out my earlier post on setting up [cross-account role assumption](https://shumayl.site/post/role-assumption-sls). 

Example flow:
1. From the delegated admin account, call `assume_role()` into each child account.
2. Use the temporary credentials from STS to create an S3 client.
3. Call `put_bucket_inventory_configuration()` to set up the inventory report on each bucket.

Of course, if you're handling this configuration for a huge number of buckets across a large number of AWS accounts, consider orchestrating this with Lambdas behind an SQS queue for scalabilitry and fault tolerance. 

If you have an increasing number of buckets throughout your ecosystem, you could also design an event-driven Lambda that is triggered by an EventBridge Rule listening on `CreateBucket` events from your child accounts. Previously, this relies on your child accounts being set up to send events (via EventBridge Rules) to the central default event bus in your delegated admin account, but recently AWS is now allowing [direct delivery to cross-account targets](https://aws.amazon.com/blogs/compute/introducing-cross-account-targets-for-amazon-eventbridge-event-buses/).

With `put_bucket_inventory_configuration()` on each bucket, you need to configure it to:
- Output Parquet files
- Use daily frequency (max granularity)
- Include metadata like:
    - Bucket
    - Key
    - Size
    - LastModifiedDate
    - EncryptionStatus

In the inventory configuration, set the destination as a central S3 bucket in your delegated admin account under a path that follows Hive-style partitioning, e.g.:
```zsh
s3://central-inventory-bucket/account_id=123456789012/date=2025-05-19/
```
You'll need to ensure that the destination bucket in the delegated admin account has the necessary cross-account permissions.

The destination bucket policy must include:
```json
{
    "Effect": "Allow",
    "Principal": {"AWS": "arn:aws:iam::source-account:root"},
    "Action": ["s3:PutObject"],
    "Resource": "arn:aws:s3:::destination-bucket/*"
}
```

Also keep in mind that S3 Inventory does not support cross-region exporting. So you need destination buckets in each region that your source buckets reside.

Hive-style partitioning encodes partition keys like `account_id` and `date` directly in the object path (e.g. `account_id=.../date=.../file.parquet`). This structure enables partition pruning in Athena and is compatible with AWS Glue crawlers. Since Athena engine version 2, partition pruning is enabled by default.

In addition to the data files, S3 Inventory will generate a special `_symlink.txt` file in each partition folder. This file lists the full paths to the actual Parquet objects in that partition and is required for Athena to correctly resolve partitioned queries. 

## Step 2: Set Up Hive-Compatible Athena Schema
Create a Glue table that matches the schema of the S3 Inventory Parquet output and is partitioned by `account_id` and `date`. This allows Athena to query the exported S3 encryption data across all accounts efficiently using partition pruning.

```ddl
CREATE EXTERNAL TABLE s3_inventory (
  bucket VARCHAR,
  key VARCHAR,
  version_id VARCHAR,
  is_latest BOOLEAN,
  size BIGINT,
  last_modified_date TIMESTAMP,
  encryption_status VARCHAR,
  e_tag VARCHAR,
  storage_class VARCHAR
)
PARTITIONED BY (
  account_id VARCHAR,
  date VARCHAR
)
STORED AS PARQUET
LOCATION 's3://central-inventory-bucket/'
```

Again, the partition columns (`account_id`, `date`) must match the Hive-style folder layout in the S3 path:
```zsh
s3://central-inventory-bucket/account_id=123456789012/date=2025-05-19/...
```

Athena uses this structure to eliminate irrelevant partitions during query execution, which reduces scanned data and improves performance.

Once created, load the partitions. You can do this either 
- by running `MSCK REPAIR TABLE s3_inventory;`, which auto-discovers partitions from Hive-compatible paths, or
- with a Lambda that runs `ALTER TABLE s3_inventory ADD IF NOT EXISTS PARTITION (...)`

One important caveat here is that partition registration must be repeated whenever a new bucket is configured with S3 Inventory, since that introduces a new `account_id` and potentially new partition paths that Athena doesn't yet know about. Without this, queries will miss newly ingested data. Automating this is highly advisable.

## Step 3: Apply Access Controls via Lake Formation 
Now, we don't want everyone to be able to see potentially sensitive S3 metadata, so we need to configure role-based access control (RBAC). The easiest native approach to this is to use Lake Formation.

First, we need to register location of the data lake path in the delegated admin account:
```zsh
s3://central-inventory-bucket/
```
This allows Lake Formation to manage permissions for all tables and partitions stored under that prefix.

Next, we need to configure table-level and partition-level access. With the `s3_inventory` table registered in the Glue Data Catalog and backed by the S3 location above, you can define fine-grained access using either:

- Named partition values
    - Example: Grant access to `account_id='123456789012'`
    - Useful for explicit per-account controls
- LF-tags (Lake Formation tags)
    - Tag datasets by `account_id`, `environment`, or other logical groupings
    - Grant access to tags rather than hard-cdoed values
    - Better scalability when managing hundreds of AWS accounts

For an example, for a Security Operations Team, we'd want to grant read access to to all accounts partition for operational purposes, while we'd only want to allow individual account owners read access only to their corresponding `account_id` partition.

## Step 4: Query via Athena
With the data lake and RBAC in place, Athena becomes the unified query layer for inspecting object-level metadata across all of your child accounts, without having to check the actual buckets and potentially causing confidentiality issues.

Athena queries are read-only and serverless, making them ideal for security, governance, and analytics use cases at scale.

Before running queries, you need to ensure that
- your IAM principal has the required Lake Formation permissions, and
- a workgroup is configured with result location (query results bucket) and query limits (this can be done via the Athena console)

One example query is if we want to find unencrypted objects across all accounts over the last day, we could run the following query:
```ddl
SELECT account_id, bucket, key, encryption_status
FROM s3_inventory
WHERE date = '2025-05-19' AND encryption_status = 'NONE';
```

Conversely, we could also see a list of our inventory that's prone to the [recent SSE-C vulnerability earlier this year](https://arcticwolf.com/resources/blog/ransomware-campaign-encrypting-amazon-s3-buckets-using-sse-c/) by running the following query:
```ddl
SELECT account_id, bucket, key, encryption_status
FROM s3_inventory
WHERE date = '2025-05-19' AND encryption_status = 'SSE-C';
```

We could also count the total encrypted vs unencrypted objects per account:
```ddl
SELECT account_id, encryption_status, COUNT(*) AS object_count
FROM s3_inventory
WHERE date = '2025-05-19'
GROUP BY account_id, encryption_status;
```

These queries are fast and cost-effective for two key reasons:
1. Partition pruning: Athena only scans the partitions that match your `WHERE` clause conditions (`date` and `account_id`).
2. Parquet columnar format: Athena only reads the columns specified in your `SELECT` statement, not the entire row.

For example, in our encryption status query, Athena will:
- Skip all partitions except the specified date.
- Only read the `account_id`, `bucket`, `key`, and `encryption_status` columns.
- Take advantage of Parquet's built-in compression and encoding.

## Takeaway
With that said, I have to end this article by addressing two key points: cost and compliance.

From a cost perspective, this solution is remarkably efficient:
- S3 Inventory reports are really cheap at about $0.0025 per million objects listed. This means that with a budget of $10 for this, you could list about 4 billion objects throughout your ecosystem.
- Storage costs are minimal since Parquet is highly compressed (~$0.023/GB-month). This means that with a budget of another $80, you could store over 3 TB of Parquet in your data lake.
- Lake Formation adds no extra charges.
- Athena queries are optimized through partitioning, typically scanning less than a few GB per query (~$5/TB). A budget of $10 could afford you about 2000 queries.

For a typical enterprise with thousands of S3 buckets, the monthly cost usually stays under $100. That's pennies compared to the potential cost of a compliance violation or data breach.

From a compliance angle, this setup delivers:
- Daily visibility into encryption status across your entire S3 estate.
- Fine-grained access controls through Lake Formation.
- Audit-friendly SQL queries for compliance reporting. You could even plug this into a visualization tool/layer.
- Zero access to actual bucket contents, maintaining data confidentiality.
- Clear separation of duties between security teams and data owners.

All of which will make your auditors happy.

Building a data lake might seem like overkill just to track encryption. But think about it: you now have a scalable foundation that gives you X-ray vision into your S3 landscape without compromising security or breaking the bank.
