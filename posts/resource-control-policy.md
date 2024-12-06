---
title: 'AWS Organization Resource Control Policy'
image: '/images/rcp_deny_1.png'
excerpt: 'A new Organizations policy to limit external access to your resources.'
date: '2024-12-06'
tags: 
    - 'cybersecurity'
    - 'cloud'
---

![RCP AWS Organization console.](/images/rcp_console.png)
*RCP AWS Organization console.*

This flew under my radar during pre:Invent, but AWS recently released resource control policies - a new policy type on AWS Organizations.

## What does it do?
The idea is RCPs allow you to centrally enforce resource access restrictions from your management account, and they can be applied at multiple levels: organization root, OUs, or individual accounts.

It sets the maximum limits on the actions that identity-based and resource-based policies can grant to resources within the organization. As such, it does not directly grant permissions to resources, but enforces "Deny" statements. This is what an RCP document looks like:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Deny",
            "Principal": "*",
            "Action": "s3:*",
            "Resource": "*",
            "Condition:": {
                "BoolIfExists": {
                    "aws:SecureTransport": "false"
                }
            }
        }
    ]
}
```
It looks similar to other policy documents. For RCP, the `Effect` element will always be "Deny" - you're restricting stuff. The `Principal` element for RCPs must always be "*", and you can granularize to specific principals by using the `Conditions` element, which accepts the [standard IAM condition statements](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html). Lastly, the `Action` element is where you specify the specific service/action that you want to restrict. 

Do note that there are only a subset of AWS services that support RCPs, and you can refer to the [list here](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps.html#rcp-supported-services).

Also note that as with other forms of policy documents on AWS, there are maximum character limits. For the RCP document, this limit is 5120 characters.

## How is it different from service control policy?
SCPs are principal-centric controls that limit what actions can be performed (i.e. the "what") by specific principals. They set the maximum permissions that principals (users/roles) in member accounts can have. They prevent your users from doing too much.

On the other hand, RCPs are resource-centric controls that limit which identities can access resources (i.e. the "who"). They control access to resources by specifying which identities (particularly thsoe external to your organization) can access them. They prevent your resources from being accessed by the wrong people.

SCP limits what your IAM principals can do. RCP limits who can access your resources. They work together.

One simple example here is with SCPs alone, you couldn't prevent external access to S3 buckets because SCPs only control permissions for principals within your organization. This meant that if someone accidentally created an overly permissive bucket policy allowing external access, the SCP couldn't prevent it.

RCPs address this security concern by allowing you to enforce organization-wide controls that prevent external access to your resources, regardless of what the individual bucket policies might allow.

## How does the policy get evaluated?
RCPs and SCPs complement each other - the logical intersection between RCPs and SCPs form the effective maximum permissions allowed on a specific resource, by a specific identity.

For a specific action on a specific resource in a specific account to be denied, any RCP applied from the organization root through to the leaf (specific AWS account) needs to have an RCP document that prevents said action on said resource.

The resource control policy, being an Organizations policy, gets evaluated near the top of the evaluation logic. It checks if the resource is owned by an organization (root, OU, individual account) with an applicable RCP. If there is an "Allow" statement at every level of the organization from root to the resources account, it will continue with the evaluation of SCP. Otherwise, if there is any "Deny" statement from root to the resources account, it will evaluate the action as denied.

![Policy evaluation flowchart.](/images/PolicyEvaluationVerticalRCP.png)
*AWS policy evaluation flowchart.*

Read more: 
- [User Guide: Resource control policies (RCPs)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps.html)
- [User Guide: Access policies data perimeters](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_data-perimeters.html)