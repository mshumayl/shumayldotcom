---
title: 'Fine-tuning Large Language Models'
image: '/images/full-arch.jpg'
excerpt: 'How to get the most out of Large Language Models.'
date: '2023-04-30'
tags: 
    - 'machine-learning'
---


![AI-Daleel system architecture.](/images/full-arch.jpg)
*AI-Daleel system architecture.*

## How is fine-tuning done with LLMs?
https://twitter.com/karpathy/status/1656002284860612608
https://twitter.com/karpathy/status/1655994367033884672


It seems that fine-tuning LLMs unlock the least amount of improvement while also being the most resource-intensive task. 

In the context of GPT, you might have to feed tens of thousands of prompt vs ideal output pairs in order to make an incremental difference to the weights.

Retrieval-augmented few-shot prompting is what Bing does. You can see it's able to generate highly accurate output just by 'grounding' the prompt with context documents.

GPT-4 will bring a great improvement to this strategy, as it will allow a much higher number of tokens.

If your knowledge base is not highly special, finetuning brings minimal value
- Even if it's special, better to have a retrieval step, then augment the prompt
- What's the best model for retrieval?

```
Do some experiments with finetuning
```