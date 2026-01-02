---
layout: post
title: "Training LLMs"
permalink: /ai-training
redirect_from:
  - /training
  - /llm-training
---

Generally, I don't deal with training or deeper tech, but might as well keep some notes on it.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Training](#training)
    - [RAG Grounding](#rag-grounding)
    - [Fine Tuning](#fine-tuning)
    - [Style transfer](#style-transfer)
    - [Model Merging](#model-merging)
    - [Awesome blog](#awesome-blog)
- [Quantization](#quantization)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Training

### RAG Grounding

### Fine Tuning

- Example using [Lllama 3](https://colab.research.google.com/drive/1efOx_rwZeF3i0YsirhM1xhYLtGNX6Fv3?usp=sharing#scrollTo=bDp0zNpwe6U_)
- LORA - (Locally Optimized Rewiring Adjustment) is an algorithm used in the fine-tuning of neural network models, especially transformers. It introduces a low-rank decomposition of the weight matrices in transformers. By modifying only a small part of the model parameters during fine-tuning, LoRA allows for retaining most of the pre-trained model's knowledge while adapting to new tasks more efficiently. This approach can significantly reduce the number of parameters that need to be updated, leading to faster and more resource-efficient fine-tuning.
  - Basically - stick a narrow matrix in front of the model, and only fine tune that.
- What is GGUF? (GPT-Generated Unified Format)?
  - file formats used for storing models. GGUF is GGML.vNext.
- What is Quantization (Q4_0, IQ2_XXS)
  - A [method to compress](https://www.reddit.com/r/LocalLLaMA/comments/1ba55rj/overview_of_gguf_quantization_methods/) the LLM from each node being 16 bits to maybe 4 bits, or less.
  - A [scorecard of quantization compression methods](https://huggingface.co/datasets/christopherthompson81/quant_exploration)
  - This is lossy compression, and you need to eval how well it works? A common approach is to compare the difference of the answers via embeddings.
- RLHF - Reinforcement learning human feedback
- RLAIF - Reinforcement learning AI feedback (aka LLM as judge)
- DPO - [Direct Preference Optimization](https://arxiv.org/pdf/2305.18290.pdf?ref=hackernoon.com) - I don't quite understand but it seems like the RLHF v.Next with more simplicity. Phase still involves putting a human on the end who is given a choice of A/B and decides which they like better.
- Alpaca - [A dataset](https://huggingface.co/datasets/yahma/alpaca-cleaned) for human preferences used in the early fine tuning efforts. What's clever is they used GPT-4 to generate the dataset to make it much cheaper. I'm assuming soon there will be even better sets.

### Style transfer

### Model Merging

### Awesome blog

[Fine-Tune Your Own Llama 2 Model in a Colab Notebook
](https://mlabonne.github.io/blog/posts/Fine_Tune_Your_Own_Llama_2_Model_in_a_Colab_Notebook.html)

## Quantization

Not quite training but need to stuff this somewhere...

<https://mlabonne.github.io/blog/posts/Introduction_to_Weight_Quantization.html>
