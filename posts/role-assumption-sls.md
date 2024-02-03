---
title: 'Cross-Account Actions on AWS with the Serverless Framework'
image: '/images/role-assumption.jpg'
excerpt: 'Performing IAM role assumption with SLS.'
date: '2023-11-30'
tags: 
    - 'cloud'
    - 'tutorial'
---

## Serverless Framework
Before we proceed with AWS, let's talk about the [Serverless Framework](https://www.serverless.com/framework/docs). Commonly abbreviated as SLS, it is an Infrastructure-as-Code (IaC) tool that helps us build and deploy our systems on the [cloud providers](https://www.serverless.com/framework/docs/providers) of our choice in an abstracted and declarative manner. We define our services in a `serverless.yml` file, and SLS transforms that into actual resources on the cloud. For AWS, SLS creates CloudFormation stacks on our behalf, which in turn provisions and performs configurations on the resources we requested.

## Role Assumption
Before we proceed, let's have a little refresher on the concept of role assumption. Role assumption is a mechanism that allows an entity to temporarily assume a different set of permissions defined by an IAM role. This effectively elevates the privileges of that entity and allows it to execute actions on AWS resources that it otherwise has no access to.

A conventional use-case for this mechanism is when an "Admin" account with wide-access role needs to assume into a "Target" account to perform a specific operation on the resources in the Target account.

A more specific example is a Lambda function deployed in an Admin account that requires access to read the list of S3 buckets in a Target account. Since the Admin account doesn't inherently have direct access to resources in the Target account, the Lambda function needs to assume a specific IAM role within the Target account. This role is configured with the necessary permissions to perform the read operation on the list of S3 buckets.

## Cross-Account Lambda Deployment and Reading S3 List with Role Assumption
Now, let's demonstrate this with an example. Let's say we need to list all S3 buckets in a Target account, and we need to use a Lambda function to do this. The Lambda function needs to be deployed from an Admin account. There are two things we have to consider:
1. The Lambda function needs to be created by an account with a role that allows the `AWSLambda_FullAccess` policy. We'll call this `MyLambdaExecutionRole`
2. The Lambda function needs to perform role assumption into the Target account with a role that allows `AmazonS3ReadOnlyAccess` policy to read the list of S3 buckets. We'll call this `MyS3ReadRole`.

Here's a simplified diagram depicting what we're trying to achieve here:
![Role assumption.](/images/role-assumption.jpg)
*"MyLambdaExecutionRole" is defined when provisioning the Lambda function, while "MyS3ReadRole" is defined from within the Lambda code.*

So we have to prepare three files, namely `serverless.yml`, `list_s3.py`, and optionally `variables.dev.yml`.
1. `serverless.yml`
   - SLS will refer to this file when executing the provisioning via AWS CloudFormation.
   - This is where we declare the Lambda service and specify the role that we need to assume to create this Lambda service.
   - Providing a specific role like `MyLambdaExecutionRole` scopes down our privileges from the Full Admin account we might have configured from our development machine.
   ```serverless.yml
   frameworkVersion: '3'
   service: List-S3-Buckets
   custom:
     # Store variables in a separate file to allow dynamic referencing
     myVariables: ${file(variables.dev.yaml)}

   provider:
     name: aws
     runtime: python3.11

   functions:
     list_s3:
       handler: list_s3.lambda_handler
       # Assume role to execute Lambda actions and scope down privileges
       role: arn:aws:iam::${self:custom.myVariables.admin-account-id}:role/${self:custom.myVariables.lambda-execution-role}
       # Variables to be passed through to the Lambda code
       environment: 
         TARGET_ACCOUNT_ID: ${self:custom.myVariables.target-account-id}
         S3_READ_ROLE: ${self:custom.myVariables.s3-read-role}
   ```
2. `list_s3.py` 
   - This file contains the Lambda code that will perform role assumption into Target account and read the list of S3 buckets using AWS SDK (boto3). Here's what the handler function might look like:
   ```list_s3.py
   import boto3
   import os
   import json
   
   def lambda_handler(event, context):
     account_id = os.environ["TARGET_ACCOUNT_ID"]
     role = os.environ["S3_READ_ROLE"]
     buckets = get_buckets(account_id, role)

     return {
        "statusCode": 200,
        "body": json.dumps(buckets)
     }
   ```
   - Next, we prepare a function that assumes the role of the Target account. We use AWS Security Token Service (STS) to obtain the credentials of the Target account when we pass the role and account ID.
   ```list_s3.py
   def get_assumed_role_credentials(account_id, role):
     sts_client = boto3.client("sts")

     assumed_role = sts_client.assume_role(
        RoleArn=f'arn:aws:iam::{account_id}:role/{role}',
        RoleSessionName="list-s3-buckets"
     )

     credentials = assumed_role["Credentials"]

     return credentials
   ```
   - Now, we can write a function that performs the S3 list read in the Target using the credentials obtained from the `get_assumed_role_credentials` function.
   ```
   def get_buckets(account_id, role):
     credentials = get_assumed_role_credentials(account_id, role)
     
     client = boto3.client(
        "s3",
        aws_access_key_id=credentials["AccessKeyId"],
        aws_secret_access_key=credentials["SecretAccessKey"],
        aws_session_token=credentials["SessionToken"]
     )

     response = client.list_buckets()

     buckets = [bucket["Name"] for bucket in response["Buckets"]]

     return buckets
   ```
3. `variables.dev.yml`
   - This is where we can store the role names and account IDs. Defining these values as variables in `serverless.yml` allows us to perform these operations dynamically without any hard-coded values.
   ```
   admin-account-id: "111111111111"
   lambda-execution-role: MyLambdaExecutionRole

   target-account-id: "222222222222"
   s3-read-role: MyS3ReadRole
   ```

Once we have all three files prepared, we can now deploy to AWS using the `sls deploy` command. SLS will start the process by verifying the files and then creating a stack accordingly on AWS CloudFormation. We can verify that the stack has been created by visiting the CloudFormation console and viewing the "Stacks" tab.

Once the update is complete, we can trigger the Lambda function from within our Admin account by visiting the Lambda console and manually running the function from the "Test" tab. If it is successful, we'll be able to see the response object returned from the Lambda function, and the `"body"` key of the object will contain a list of all our S3 resources in the Target account.
