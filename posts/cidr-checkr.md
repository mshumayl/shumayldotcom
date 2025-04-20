---
title: "Couldn't Find The Tool I Needed - So I Built It"
image: '/images/gavin-allanwood--xITpL_gncA-unsplash.jpg'
excerpt: 'cidr-checkr, a tool to analyze IPv4 CIDR ranges and detect overlaps.'
date: '2024-12-06'
tags: 
    - 'systems'
    - 'cloud'
---

When working on an internal VPC automation solution recently, one of the more tedious tasks was validating whether CIDR ranges would collide. I found myself manually calculating CIDR ranges, cross-checking subnets, and doing lookups across spreadsheets — a process that was time-consuming, error-prone, and frankly didn't scale.

So I built cidr-checkr.

## What is cidr-checkr?
cidr-checkr is a lightweight HTTP API for analyzing CIDR ranges, detecting overlaps, and gaining quick insights into IP address space. It's built for network engineers, security teams, and DevOps professionals who want to improve efficiency over manual CIDR calculations and IP lookups.

By automating IP math and conflict detection, it helps validate subnets, prevent misconfigurations, and manage complex network topologies with confidence.

Delivered as a headless API server, it integrates cleanly into CI/CD pipelines, infrastructure-as-code workflows, or any custom automation setup.

If you've ever had to double-check VPC ranges before provisioning — or retroactively fix a silent collision — cidr-checkr might save you some pain.

## Installation
1. Clone the repository
```
git clone https://github.com/mshumayl/cidr-checkr.git
cd cidr-checkr
```
2. Build the project
```
go build ./...
```
3. Run the server
```
go run cmd/api/main.go
```

Once the server is running, you can start sending requests to the endpoint.

## Using the API
As of writing this, the solution only has a single endpoint, i.e. the `/api/analyze-cidrs` endpoint. You can pass a list of _N_ CIDRs in the body of this `POST` request, and it will return details about each CIDR along with any overlaps between the CIDRs provided.

### Sample request body
```json
{
  "cidrs": ["192.168.1.0/24", "10.0.0.0/8", "192.168.1.0/25"]
}
```

You could use the following cURL command to send this payload to the endpoint:
```bash
curl -X POST http://localhost:8080/api/analyze-cidrs \
  -H "Content-Type: application/json" \
  -d '{
    "cidrs": ["192.168.1.0/24", "10.0.0.0/8", "192.168.1.0/25"]
  }'
```

# Sample response
```json
{
  "cidr_details": [
    {
      "cidr": "192.168.1.0/24",
      "first_ip": "192.168.1.0",
      "last_ip": "192.168.1.255",
      "total_hosts": 254
    },
    {
      "cidr": "10.0.0.0/8",
      "first_ip": "10.0.0.0",
      "last_ip": "10.255.255.255",
      "total_hosts": 16777214
    },
    {
      "cidr": "192.168.1.0/25",
      "first_ip": "192.168.1.0",
      "last_ip": "192.168.1.127",
      "total_hosts": 126
    }
  ],
  "overlaps": [
    {
      "cidr1": "192.168.1.0/24",
      "cidr2": "192.168.1.0/25",
      "overlap_range": "192.168.1.0 - 192.168.1.127",
      "overlap_hosts": 128
    }
  ],
  "has_collision": true
}
```

# Forward paths
As you can see, the current implementation is a headless API service, focusing purely on backend functionality. While it’s great for automation and integration, it currently lacks a user-friendly interface.

A logical next step for improving the user experience would be to develop a simple front-end for this solution, allowing users to interact with the service in a more intuitive manner. Hosting it online could also make it easier for others to use and share.

If you're interested in contributing or following along with the development of this project, feel free to check the [GitHub repository](https://github.com/mshumayl/cidr-checkr) or get in touch!
