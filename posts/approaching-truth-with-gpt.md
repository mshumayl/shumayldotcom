---
title: 'Approaching Truth with GPT'
image: '/images/my-life-through-a-lens-bq31L0jQAjU-unsplash.jpg'
excerpt: '.'
date: '2023-04-23'
tags: 
    - 'gpt'
    - 'ai'
---
Recently, I released AI-Daleel, a GPT-powered al-Quran research tool. It is of utmost importance that any tool which aims to aid Islamic study adhere to the strict quality standards as shown to us by the tradition of Islamic scholarship and academia.

Let me preface this by saying that at its core, the GPT architecture is not designed to provide sources. Within the weights of the model, there is no information regarding the source document from which it obtains a specific set of words. In fact, its job is to synthesize a sequence of text based on the "closeness" between words in its latent space. This latent space here refers to a knowledge graph (represented by the model weights) which represents the semantic relationship between words, formed during the initial training process. For GPT-3, its training corpus is 570 GB of data of published texts on the internet, amounting to a word count of approximately 300 billion words across all available domains.

Effectively, this means that during inference time of a zero-shot task (with no additional context provided in the prompt), it relies on the entirety of the corpus to generate the sequence of texts. With no additional context, the output would be heavily prone to [hallucinations](https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)), as it is not bound with anything other than the word relationships it learnt during its initial training phase.

For example, if we instruct the model to generate a commentary on "Topic A", it will generate words that are semantically probable to come along with "Topic A" in its initial training corpus. Hallucinations will occur here as there are no specified boundaries between domains -- it is given free reign to choose from any domain in its training corpus.

The good news is that hallucinations can be greatly reduced by providing more context to the model in the instructing phase. This comes in the form of prompts that can be provided to the model.

## The Bing approach
You might have used Bing's latest AI-infused search feature. You see it neatly provides references. If GPT is not designed for referencing source documents, how does Bing achieve this feature?

![Bing's AI search.](/images/bing-ai.jpg)
*Bing's AI search.*

Bing relies on a method they coin as ["grounding"](https://www.searchenginejournal.com/how-bing-ai-search-uses-web-content/480643/). Without oversimplifying things too much, what happens is that they provide more context within their prompting by injecting texts from relevant search results (web pages). This relevancy is determined by Edge's conventional search engine. This way, it is able to keep track of the source document of the injected texts. 

This means that the references provided by Bing are references from the additional context texts provided in the prompts, not the actual source of words in the initial training corpus.

## How does AI-Daleel approach text synthesis?
Currently, there are two tasks that rely on GPT text synthesis in AI-Daleel. Namely, this is the AI Search feature and the AI Generate Notes feature.

With the AI Search feature, the model is instructed to only return the surah numbers and verse numbers that are semantically related to the users input. The return object is a synthesized string that looks something like below:

```
'[
    {
        "surah": 2,
        "verse": 56
    },
    {
        "surah": 12,
        "verse": 23
    },
    {
        "surah": 15,
        "verse": 77
    }
]'
```

We bring the model closer to Truth by avoiding text synthesis for Quran verse and translations. With the surah and verse numbers provided above, we can use them to index a carefully sourced dataset of Quran verse and translations stored in our database. AI-Daleels verse texts and translations are soured from the [Tanzil project](https://tanzil.net/docs/). This way, the worst that can happen is we are given an index to a different verse than intended, rather than synthesizing a hallucination of a Quran verse that does not even exist.

The second task is the AI Generate Note feature. This feature generates notes for the user based on the translation of the current verse. The translation text is provided as the additional context in the prompt. This way, the text synthesis task is bound by a specific domain/document, i.e. this translation text. In other words, the majority of the text generated will rely on the translation text.

To reiterate, the source document used here is only the verse translation. Contrasting this to Bing's implementation, a reference for context documents are not required as there is only one context document that is provided in the prompt, i.e. this verse translation.

Of course, more context document can be provided such as web pages, but this comes at a risk of poisoning the well with unreliable sources of commentary. Search engine ranking is not a reliable metric for commentary reliability.

Without further context documents, the drawback is that the summaries will be rudimentary paraphrasings of the verse translation. On the other hand, we avoid "poisoning the well" by not including any further context other than a reputable translation of the verse.

## UI/UX considerations
It is important to let the users realize that any AI-generated text summary cannot be trusted as authoritative in any way. The AI Generate Note is a feature that generates notes _on behalf_ of the user. To get this idea across, after the generation, the user can add and edit the generated text as they see fit before confirming the addition of the note.

## Future improvements
We are aware of the dangers and issues that come with unreliable summarization of Quranic text, and it is a matter we consider seriously throughout the development of this product. As of now, we are able to do so by limiting the context to the verse translation, at a cost of a lower level of insights generated.

One possible pathway to improve insight generation and summary quality without jeopardizing the reliability of context sources is to improve the al-Quran dataset we use by adding structured tafseers data like Tafsir Jalalayn and Tafsir al-Muyassar, both available from the Tanzil project. This way, we are able to prevent unreliable, non-structured documents like the documents that would return from a search engine.
