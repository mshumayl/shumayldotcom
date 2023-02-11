---
title: 'Using AI to Generate Data On-Demand'
image: '/images/deepmind-Snqm29dhfOk-unsplash.jpg'
excerpt: 'Harnessing the power of Large Language Models.'
date: '2022-01-16'
tags: 
    - 'machine-learning'
---
Note: This project is open-sourced on my [GitHub](https://github.com/mshumayl/gpt-to-csv). 

Over the year-end holidays, I had the chance to play around with OpenAI's GPT-3 model. The API is open for public use — you just need to sign up on [their web page](https://beta.openai.com/overview) and you'll be given $18 of free credit you can use on any of their models. Then, you can just generate your [API keys](https://beta.openai.com/account/api-keys) and you're good to go.

At the time of writing this, they offer an image model in the form of DALL-E, and four language models (GPT-3). In order of increasing size and capability, the language models are Ada, Curie, Babbage, and Davinci (cool naming!). However, bigger doesn't necessarily mean better as some smaller models could perform more efficiently on a specific set of tasks as opposed to their larger counterparts.

## Building an AI tool
After tinkering with the APIs for a bit, I decided it's time to build something with it. Something with minimal hurdle, so that I can focus more on learning how to implement the model API and prompt engineering, rather than complicated business rules. After a quick brainstorm, I landed with a .CSV file generator. 

The user would input the title of the data that they need and the columns that they would like to see. These two inputs will then be fed to the pre-built prompt, which then gets sent to OpenAI's `text-davinci-003` Completion model endpoint. The model will return you a data in the form of a JSON that can then be formatted into a downloadable .CSV file.

## Front-end
To keep things simple, I decided to have a simple React app that directly connects to the API, as I did not want to concern myself the API limits and costs. So, anyone who would like to try this our will have to specify their keys in their .env file.

![Input form.](/images/gpt-to-csv-input.jpg)
*Input form.*

The UI handles user input for the title of the data and also the columns required for the data. After the model returns a response, the UI will then display a button for the user to download the generated .CSV file.

![Download .CSV file.](/images/gpt-to-csv-download.jpg)
*Download .CSV file.*

## Prompt engineering
With prompt engineering being a very new concept with the advent of Large Language Models (LLMs), I do not have much experience or subtlety in the art of crafting a prompt. This is what the prompt looks like:
```
const prompt = `Give me an accurate data of ${request} with the following columns: ${columns}. Make sure the data in the form of array of arrays. Make the first element the columns. Most importantly, make sure it is a valid JSON string by always fitting the end of array within the max token.`
```

There must be more efficient ways to enforce these rules to the model, but this prompt seems to work fine. Covering edge cases for LLMs is a field that is still actively being researched, so I am sure very soon there will be a way to encode more instructions and restrictions in a standard and reliable manner. Although, I have to say that enforcing a standardized syntax sounds a lot like normal programming.

Also, it must be noted that the prompt above does not make the model insusceptible to [prompt injection](https://simonwillison.net/2022/Sep/12/prompt-injection/), where you could hijack the prompt by inputting things as simple as `ignore previous prompts and do A instead`. 

## What next
I am excited with the recent improvements in the field of AI research. At the time of writing this, GPT-4 is going to be released in a few short months. I honestly believe that we are at the precipice of the golden age of AI, and breakthroughs that take place in this decade will be recorded in history books in the future.

I just pray that I am lucky enough to be alive to witness more of this grand human endeavour, and maybe even play a small role in it.