---
layout: post
title: Testing AI
permalink: /ai-testing
ai_default_image: true
---

Testing math is easy, it's right or wrong. Testing spelling is easy too, but testing if a joke is funny - now that's tough. Let's talk about how to test AI.

> Unlike unit tests, evals are an emerging art/science. Anyone who claims to know exactly how your evals should be defined can safely be ignored. We've designed Pydantic Evals to be flexible and useful without being too opinionated.
>
> — [Pydantic Evals docs](https://ai.pydantic.dev/evals/)

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Concepts](#concepts)
  - [Tracing](#tracing)
  - [LLM as Judge](#llm-as-judge)
  - [Testing across prompts](#testing-across-prompts)
  - [Testing across models](#testing-across-models)
  - [Testing the model bound to its harness](#testing-the-model-bound-to-its-harness)
- [Examples](#examples)
  - [Who is the funnier LLM](#who-is-the-funnier-llm)
  - [Who is the better git summarizer](#who-is-the-better-git-summarizer)
  - [Git commit message for blog content avoid ToC updates](#git-commit-message-for-blog-content-avoid-toc-updates)
  - [Drawing the Mona Lisa, then ruining it](#drawing-the-mona-lisa-then-ruining-it)
- [Eval Systems](#eval-systems)
- [Testing Theory](#testing-theory)
  - [Good books](#good-books)
  - [Simplest form of testing](#simplest-form-of-testing)
  - [Wrinkle - A/B Testing](#wrinkle---ab-testing)
  - [Wrinkle - No Known Answer](#wrinkle---no-known-answer)
  - [Wrinkle - No clear questions](#wrinkle---no-clear-questions)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Concepts

### Tracing

I started by using LangSmith, but now I use ell, which has it built in.

### LLM as Judge

Using a model to grade a model now lives in [AI Evals](/ai-evals#llm-as-judge).

### Testing across prompts

I use PromptFoo, but haven't really done this.

### Testing across models

1. PromptFoo - For heavy lifts
2. [https://nat.dev](https://nat.dev) - For ad-hoc experimentation
3. Just keep the output of both - The cheater's way

Here's an example, where I use multiple LLMs to generate output and just keep both.

For example, here's the explanation of [My commit that does this](https://github.com/idvorkin/nlp/commit/674e73c6729cedc9a07cdad326c67ef8976601db).

Notice that Claude does a better job getting the gist of it.

_-- claude-3-opus-20240229 --_
Add support for generating commit messages from multiple LLMs concurrently

- Allows generating commit messages from multiple LLMs (OpenAI and Anthropic
  Claude) in parallel to compare and choose the best one

_-- gpt-4-turbo-2024-04-09 --_
Refactor build_commit function for asynchronous operation and enhance
instruction formatting

- Shift towards asynchronous programming for handling multiple language models
  concurrently, improving scalability and performance.
- Update the instruction documentation to make it more structured and clear,
  following a markdown format for better readability.

### Testing the model bound to its harness

Evals used to be prompt in, completion out. In the agentic era that's the wrong unit — the thing doing the work is the model plus its tools, its environment, and its permission envelope, and the model and the harness get cross-trained together. Swap the harness and the same weights score differently, so harness-bound performance is the thing that actually matters. [AI Eval Tools](/ai-eval-tools) calls this agent-in-a-workdir.

Same way you judge a person: in an environment, not in the abstract.

## Examples

### Who is the funnier LLM

One of my AI creations is an improv coach. A key requirement of said coach is that it is funny. How the heck can I tell if GPT-3.5, GPT-4, or Claude is funnier?

I found a package called PromptFoo, which is most of what I want.

See the [code here](https://github.com/idvorkin/nlp/commit/9b5af637477099c6562c80f46ad2a3cec65d6c27), and you can interact with a [live file here](https://app.promptfoo.dev/eval/f:e66b7a20-67b1-4e78-a0bd-63a3f7f30f96/).

{% include blob_image.html src="/blog/promptfoo-3-things.webp" %}

### Who is the better git summarizer

You can see my PromptFoo test cases [here](https://github.com/idvorkin/nlp/blob/1ca6b3f85895b2684596c8957f0a0bd5a7a5d4f1/eval/commit/diff_commit.json?plain=1#L2f).

How to get the test case? I'd recommend recording a trace with LangSmith, then copy/export them from a LangChain trace and write to JSON (todo add a script for this).

And the output of the run [in PromptFoo](https://app.promptfoo.dev/eval/f:442e0857-efc0-408b-9a6d-c064ee7ae306).

Note, you can both assess these as a human, also have the LLM look at criteria

```yaml
tests:
  assert:
    - type: llm-rubric
      value: ensure the diff is described well
```

### Git commit message for blog content avoid ToC updates

I use a tool to write my git commit messages. It can get slow, so I like to run it with maverik when it's not that important. However, when summarizing changes to my blog there are always changes to the auto generated ToC, which I don't want to be included, I have trouble getting Maverik to honor [this](https://github.com/idvorkin/nlp/blob/03fe037a2323f21dd1728862dbf598d8af541fec/commit.py?plain=1#L146).

```
- **Do not** mention discuss changes to the table of content.
```

Testing this is normally a PITA with me doing manual testing, let's see if I can make some evals to fix this. I think I have a few choices

1. Prompt Foo
2. DeepEval
3. Giskard

Let's start with promptfoo

Update 2026-08: this itch finally became a real eval — see [Grading the agent with smevals](/ai-evals#grading-the-agent-with-smevals).

### Drawing the Mona Lisa, then ruining it

TryAI built a [drawing arena](https://www.tryai.dev/blog/ai-drawing-arena-colored-pencils-claude-gpt-grok): four frontier models, a blank canvas, and simulated colored pencils. The model picks a color and a pressure, lays down strokes, smudges, erases, and calls `view_canvas` to look at its own work and decide what to fix next. Two of the seven tasks are reproductions — the Mona Lisa and Starry Night — scored against the target with SSIM, so there's a real number under the pictures. The [harness is open source](https://github.com/hershalb/canvas-arena).

The cost spread is the fun part — GPT-5.6 Sol drew all seven for $7.74, Claude Fable 5 spent $160.58 to land second on quality — but the number that stuck with me is this: every one of the eight scored runs finished below the model's own mid-run peak. Gemini 3.6 Flash hit 0.449 SSIM on the Mona Lisa, the best score anyone reached, then reviewed its way back down to 0.337. Claude looked at its Mona Lisa 27 times and was flat after about the fifth.

That's [hill climbing](/hill-climbing) with the keep/reject step missing. The models could draw, erase, and look, but they had no way to snapshot a canvas they liked and roll back to it, and nothing in the loop compared the current canvas against their best so far. Every review was a chance to walk downhill with nothing to catch it. If my eval only reads the final artifact, I score the 0.337 and never learn the 0.449 happened. Score the trajectory, not just the finish, and ship the best checkpoint rather than the last one.

## Eval Systems

The scoring side moved to [AI Evals](/ai-evals#eval-systems): [Chatbot Arena](/ai-evals#human-based-blind-taste-tests-chatbot-arena), [eval data sets](/ai-evals#eval-data-sets), [grading the agent with smevals](/ai-evals#grading-the-agent-with-smevals), and [confusion matrix, precision, and recall](/ai-evals#confusion-matrix-precision-and-recall).

## Testing Theory

### Good books

- [Taming LLMs on Evals](https://www.souzatharsis.com/tamingLLMs/notebooks/evals.html)

### Simplest form of testing

Before testing:

- Come up with a list of tasks (questions) and answers

Test Time:

- Have the system perform those tasks and write down the answer

Eval Time:

- Check tasks against answers
- Print score

### Wrinkle - A/B Testing

Sometimes we want to see what

At test time:

- Have both A and B attempt the task

Eval Time:

- See who did better, A or B

### Wrinkle - No Known Answer

Sometimes there isn't a known answer - in that case, we can have a judge do the answers.

Eval Time:

Have a judge grade it.

Judges are subjective, so we can have multiple judges and average their answers - like we do in boxing matches or work performance reviews. The catch: averaging only helps if the judges actually disagree. Ask five judges the same question five different ways and you've bought one opinion at five times the price, so check that their scores diverge before you trust the average.

And when every score comes back in the same narrow band, the fix is usually the question, not the judge. A judge answers _which of these two is better_ far more reliably than an abstract zero-to-ten scale - the same reason [Chatbot Arena](/ai-evals#human-based-blind-taste-tests-chatbot-arena) is pairwise. Trading absolute scores for a head-to-head against known-good references is what [unstuck an RL run on watercolor paintings](https://surya.website/rling-qwen-to-paint-with-code) that had flatlined.

### Wrinkle - No clear questions

Before testing:

- Have an expert create a list of tasks
