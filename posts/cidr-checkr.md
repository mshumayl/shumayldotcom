---
title: "Couldn't Find The Tool I Needed - So I Built It"
image: '/images/gavin-allanwood--xITpL_gncA-unsplash.jpg'
excerpt: 'cidr-checkr: A tool to quickly analyze CIDR ranges and highlight overlaps - without full-blown IPAM solutions or the mess of spreadsheets and IP calculators.'
date: '2025-04-20'
tags: 
    - 'systems'
    - 'cloud'
---

When working on a cloud networking feature set for an internal developer platform (IDP) recently, I ran into a surprisingly annoying bottleneck — checking if an _N_-number CIDR ranges would collide.

I was doing it the manual way: punching one CIDR into an online calculator, copying the start and end IPs, then opening a second tab to do the same for another CIDR - and manually eyeballing the ranges to see if they overlapped. It was slow, clunky, and error-prone. I had spreadsheets open, tabs everywhere, and way too much context-switching for something that felt like it should be trivial. This just didn't scale.

Or maybe I'm just IP-dyslexic - my monke brain couldn't grok that many numbers and dots and slashes quickly. Who knows.

But I do know that this sits squarely in the gap between full-blown IPAM solutions and tedious one-off checks. You don't want to use your production IP address management system just to sanity-check a few CIDRs - but spreadsheets and calculator tabs aren't cutting it either.

So, instead of slogging through another round of IP arithmetics, I decided to do what builders do - I made the tool I wish I had.

Enter cidr-checkr.

# What is cidr-checkr?
cidr-checkr is a lightweight HTTP API for analyzing CIDR ranges, detecting overlaps, and giving you instant clarity into your IP address space. It's built for network engineers, security teams, and anyone working with infrastructure/platforms who want to improve efficiency over manual CIDR calculations and IP lookups.

By automating IP math and conflict detection, it helps validate subnets, prevent misconfigurations, and manage complex network topologies with confidence.

It's a headless API server by design, so it integrates cleanly into your CI/CD pipelines, infra-as-code setups, or whatever homegrown automations you've got running.

If you've ever had to double-check VPC ranges before provisioning - or retroactively fix a silent collision - cidr-checkr might save you some pain.

# Installation
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

Once it's up, you're ready to start sending requests to the API.

# Using the API
As of writing this, the solution only has a single endpoint, i.e. the `/api/analyze-cidrs` endpoint. You can pass a list of _N_ CIDRs in the body of this `POST` request, and it will return details about each CIDR along with any overlaps between the CIDRs provided.

## Sample request body
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

## Sample response
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
Currently, I kept it as a headless API so it can be dropped into CI/CD checks or IaC tooling. A UI might come later, but the priority was making the logic composable and automation-friendly.

A logical next step for improving the user experience would be to develop a simple front-end for this solution, allowing users to interact with the service in a more intuitive manner. Hosting it online could also make it easier for others to use and share.

If you're interested in contributing or following along with the development of this project, feel free to check the [GitHub repository](https://github.com/mshumayl/cidr-checkr) or get in touch!
