---
title: 'Building a Data Lake for Multi-Account S3 Security Analytics'
image: '/images/pexels-zachary-baltimore-2152307015-32160240.jpg'
excerpt: 'A scalable data lake design to monitor S3 object encryption across thousands of AWS accounts.'
date: '2025-05-21'
tags: 
    - 'cybersecurity'
    - 'cloud'
---

When you're managing data security and compliance at the scale of thousands of AWS accounts, understanding the encryption status of every S3 object becomes a non-trivial problem. You want visibility, but you also want governance without overstepping lines of confidentiality. 

This post outlines a scalable pattern for building a data lake that ingests S3 Inventory reports across all child accounts, stores them in a structured Parquet format, governs access with Lake Formation, and exposes them through Athena for ad hoc SQL analysis. This approach eliminates the need for active S3 object scans and enables you to query object-level metadata like encryption status efficiently and securely.

## Architecture Summary
The solution relies on 5 key components.
1. Ingestion: S3 Inventory reports from each child account, exported in Parquet format with Hive-style partitioning.
2. Storage: Central S3 bucket used as the data lake.
3. Catalog: AWS Glue catalogs the Parquet data with Hive-compatible partitioning (by account and date).
4. Access Control: Lake Formation manages fine-grained permissions per account/team.
5. Query Layer: Athena queries the lake via SQL, with partition pruning for performance.

## Step 1: Enable S3 Inventory in Child Accounts
In each child account, enable S3 Inventory on all relevant buckets. This provides a daily object-level listing that includes metadata like size, encryption status, and last modified date—without needing to scan the bucket contents manually and breach the confidentiality of your child accounts.

To automate this across multiple accounts, you can use the boto3 SDK together with cross-account role assumption. The key method is:
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

Also keep in mind that S3 Inventory does not support cross-region exporting. So you need destination buckets in each region that your source buckets reside.

Hive-style partitioning encodes partition keys like `account_id` and `date` directly in the object path (e.g. `account_id=.../date=.../file.parquet`). This structure enables partition pruning in Athena and is compatible with AWS Glue crawlers. Since Athena engine version 2, partition pruning is enabled by default.

In addition to the data files, S3 Inventory will generate a special `_symlink.txt` file in each partition folder. This file lists the full paths to the actual Parquet objects in that partition and is required for Athena to correctly resolve partitioned queries. Do not delete or move these symlinks as they are critical for querying the data lake efficiently.

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

One important caveat here is that partition registration must be repeated whenever a new bucket is configured with S3 Inventory, since that introduces a new `account_id` and potentially new partition paths that Athena doesn't yet know about. Without this, queries will miss newly ingested data.

Using Parquet with Hive-style partitioning significantly improves query performance by reducing scanned data (partition pruning) and avoiding CSV deserialization overhead.

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
    - Better scalability when managing hundreds or thousands of AWS accounts

For an example, for a Security Operations Team, we'd want to grant read access to to all accounts partition for operational purposes, while we'd only want to allow individual account owners read access only to their corresponding `account_id` partition.

Lastly, to make the above policies effective, we need to revoke direct S3 access to the underlying destination bucket (except for the required write roles). We also need to enable Lake Formation permission mode on the Glue Data Catalog and the registered S3 location and ensure that consumers (Athena, Glue, etc.) are querying the table using Lake Formation permissions. Do note that Lake Formation permissions supersede IAM policies when enabled.

## Step 4: Query via Athena
With the data lake and RBAC in place, Athena becomes the unified query layer for inspecting object-level metadata across all of your child accounts, without having to check the actual buckets and potentially causing confidentiality issues.

Athena queries are read-only and serverless, making them ideal for security, governance, and analytics use cases at scale.

Before running queries, you need to ensure that
- your IAM principal has the required Lake Formation permissions, and
- a workgroup is configured with result location and query limits, and

For an example, if we want to find unencrypted objects across all accounts over the last day, we could run the following query:
```ddl
SELECT account_id, bucket, key, encryption_status
FROM s3_inventory
WHERE date = '2025-05-19' AND encryption_status = 'NONE';
```

Conversely, we could also see a list of our inventory that's prone to the [recent SSE-C vulnerability](https://arcticwolf.com/resources/blog/ransomware-campaign-encrypting-amazon-s3-buckets-using-sse-c/) by running the following query:
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

These queries are fast and uncostly, since Athena can skip partitions and read Parquet efficiently.

## Takeaway
This architecture supports centralized visibility into encryption status, object growth, and policy compliance, making it ideal for security teams tasked with maintaining cloud hygiene and meeting regulatory requirements.

While it's batch-oriented and not real-time, it provides a strong foundation for S3 compliance reporting, audit readiness, and continuous monitoring, which are all critical components of most organization's cloud security posture.
