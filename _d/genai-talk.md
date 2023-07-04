---
layout: post
title: Your new interns - GenAI for fun and profit
permalink: /genai-talk
redirect_from:
  - /genai-intern
  - /llm-intern
  - /intern-llm
  - /llm-talk
  - /ai-talk
---

Generative AI (GenAI) is taking the world by storm, and it takes a new mindset to make use of it as a programmer. A good mental model of GenAI is interns!

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [A New Computational Model - Interns](#a-new-computational-model---interns)
    - [The Perfect Intern](#the-perfect-intern)
    - [Bad Intern - Quirks and Mitigations](#bad-intern---quirks-and-mitigations)
    - [Your Intern Can't Read Your Mind - Prompting](#your-intern-cant-read-your-mind---prompting)
    - [Annual Review - Evaluating your intern](#annual-review---evaluating-your-intern)
    - [Why the heck did your intern do that - Understandability](#why-the-heck-did-your-intern-do-that---understandability)
    - [Brain Surgery - Do I need to understand paramater count and neural networks](#brain-surgery---do-i-need-to-understand-paramater-count-and-neural-networks)
- [Use cases: What should we hire the intern to do?](#use-cases-what-should-we-hire-the-intern-to-do)
    - [The Perfect Sandals - Remember the user problem](#the-perfect-sandals---remember-the-user-problem)
    - [Relationships](#relationships)
    - [Summarize](#summarize)
    - [Express myself](#express-myself)
    - [Programmer](#programmer)
- [Programs with hidden interns - Blending Code and Mind Reading](#programs-with-hidden-interns---blending-code-and-mind-reading)
    - [LLM as Computer](#llm-as-computer)
    - [Natural Language and reasoning as state](#natural-language-and-reasoning-as-state)
    - [How to merge a program and user input with prompts](#how-to-merge-a-program-and-user-input-with-prompts)
    - [How to maintain state with prompts](#how-to-maintain-state-with-prompts)
    - [How to influence control flow with prompts](#how-to-influence-control-flow-with-prompts)
    - [How to interact with external systems with prompts](#how-to-interact-with-external-systems-with-prompts)
    - [Great, why not just write the whole program in prompts](#great-why-not-just-write-the-whole-program-in-prompts)
    - [The Before Times - It's All Code (Code)](#the-before-times---its-all-code-code)
    - [The Perfect Program - It Just Reads Your Mind (Prompts)](#the-perfect-program---it-just-reads-your-mind-prompts)
    - [Maybe Reading Your Mind Is Too Hard - Input Affordances](#maybe-reading-your-mind-is-too-hard---input-affordances)
        - [Natural Language Input](#natural-language-input)
        - [Constrained Language Input](#constrained-language-input)
        - [Graphical Selection](#graphical-selection)
    - [Give Me Choices - Output Affordances](#give-me-choices---output-affordances)
        - [Select between multiple outputs](#select-between-multiple-outputs)
        - [Use output to help refine my input](#use-output-to-help-refine-my-input)
        - [Use output to help refine my tuning of input](#use-output-to-help-refine-my-tuning-of-input)
    - [Balancing Code and Prompts](#balancing-code-and-prompts)
- [Bad Intern - All the things that can go wrong](#bad-intern---all-the-things-that-can-go-wrong)
    - [Alignment - Don't be evil](#alignment---dont-be-evil)
    - [Societal Bias](#societal-bias)
    - [Git supply chain attacks](#git-supply-chain-attacks)
    - [AGI taking over the world](#agi-taking-over-the-world)
- [Appendix](#appendix)
    - [LLM-Book](#llm-book)
    - [Talk to the intern](#talk-to-the-intern)
    - [Disclaimer](#disclaimer)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## A New Computational Model - Interns

ASIDE: No interns were harmed in the creation of this talk. I love interns, and have been one myself. I'm just using them as a metaphor for LLMs. If you're an intern, or recently graduated, feel free to read my advice to y'all - <http://bit.ly/igor-advice-22>

### The Perfect Intern

- Super smart
- Super creative
- Understand English and high complexity
  - Don't need to 'dumb it down', just talk in natural language
- Infinite creativity
  - Don't need to 'search' for an image, just have them genereate it!

### Bad Intern - Quirks and Mitigations

- But makes mistakes
- So you need to coach and guide
- Non-deterministic: Every call you get a different intern.
- Sometimes it'll just be a bad intern, can lie, or ignore instructions.
- Slow: Current models have bad latency and rate limits (bleh)
- TODO: Link to build '23 talk by OpenAI scientist.
- Sometimes you get a dud and they ignore the instructions. :(
- The longer the answer, the more they can think; short answers have them thinking less.
- Once committed to an answer, even if wrong, they'll keep going.
- Very dangerous, since so used to smart, honest interns, when you get a bad intern that's confident, it can really throw you for a loop.

### Your Intern Can't Read Your Mind - Prompting

- Input is conversational.
- When instructing our intern, we assume we have sufficiently specified what we want.
- But very quickly realize you haven't.
- Very hard to evaluate if your intern did good
- See prompt engineering.

### Annual Review - Evaluating your intern

- Evaluating at design time
- Evaluate at runtime
- Handling a runtime failure
- Human Review
- Review with another model
- Voting System

### Why the heck did your intern do that - Understandability

### Brain Surgery - Do I need to understand paramater count and neural networks

- No more then you need to understand dopamine or synapses.

## Use cases: What should we hire the intern to do?

### The Perfect Sandals - Remember the user problem

- What makes perfect sandals?
- Research, you build, but no one buys?
- What is going on? You go out and do user studies. Turns out the users are trying to mountain climb, no sandal will work for them.
- Start by understanding the problem you are trying to solve, see how you can use AI to help solve that probvlem.
- Otherwise the anti-pattern, a solution looking for a problem

### Relationships

- AI Partner - Replika
- Therapist - 7 Cups of Tea
- Celebrity - Caryn.ai

### Summarize

### Express myself

- Grammerly

### Programmer

- Copilot
- Code Review
- Security Scanning

## Programs with hidden interns - Blending Code and Mind Reading

Conventional Programming vs Delegating to an Intern

### LLM as Computer

- (Thinking: Should there be a concept of conversation sidebared)
- LLM is a really simple computer/CPU
  - A prompt for input, a response for output.
  - Stateless
  - No control flow
  - No I/O (Except the prompt, and the response)
  - No Reading External Storage
- In classical coding, the computer program is separate from the user input,
  - In LLM there's only the prompt.
  - Thus the prompt must be the program and the input
  - So think of the prompt as the resolution of PromptTemplate(UserInput)
- In classical coding, there are variables, and control flow,
  - In LLMs there are only the prompt
  - We can simulate state/control flow by keeping the history of the previous prompts/response in the current prompt
  - This is why the prompt format of messages has evolved.
- In classical coding you can access storage, and have lots of RAM.
  - In LLMs you can access no storage beyond the prompt (think of it as RAM)
  - In LLMs you have limited RAM, so you need to be efficient with it.
  - In LLMs use need to efficiently use the RAM, by deciding which data to place in it.

### Natural Language and reasoning as state

Talk about how weird it is coming with a computer mindset

### How to merge a program and user input with prompts

Create a prompt by instantiating a prompt template with the user input.

PromptTemplate = "I'll ask these facts later {user_input}"

Prompt:

```ascii
Here is a conversation between an AI and a user,  The AI is very curt.
 USER: I'll ask these facts later. I like fruit
```

Response:

```ascii
AI: Noted.
```

### How to maintain state with prompts

When talking to an intern, they have state in that they remember the conversation. But as we discussed you get a new intern for every call to the intern factory.

You work around this "stateless" problem by having the prompt be the entire conversation to date.

Say we now want to ask what fruit the user likes, the prompt is not just

Prompt:

```ascii
USER:  What food do I like?
```

It has to include the entire history

```ascii
Here is a conversation between an AI and a user,  The AI is very curt.
USER: I'll ask these facts later. I like fruit
AI: Noted.
USER:  What food do I like?
```

Response:

```ascii
AI: You like fruit.
```

Here's where the term prompt gets confusing. Prompt refers to the entire prompt passed to the LLM, which is the entire conversation. However like most converations it is usually append only with the latest users input transformation on the end (more complexity but will save that for later).

So normally it's:

```python
prompt = PromptTemplate(get_user_input())
conversation += [prompt]
conversation += CallLM(conversation)
```

E.g. extend the conversation by extending only a singl new prompt

And the only output to the user is the final response

### How to influence control flow with prompts

Should I merge with the next one?

### How to interact with external systems with prompts

- (Thinking) there is program execution as represented by history, but there's also program execution as requested by the LLM. Need to think through that.

Physically, prompts can only do stateless data transformations, not control flow or I/O.

### Great, why not just write the whole program in prompts

### The Before Times - It's All Code (Code)

### The Perfect Program - It Just Reads Your Mind (Prompts)

- At design time you make a few static prompts, and use that to design a template
- At compile time you include a template in your program
- At runtime you create a prompt by instantiating a template with the user (or program) input

### Maybe Reading Your Mind Is Too Hard - Input Affordances

#### Natural Language Input

#### Constrained Language Input

#### Graphical Selection

### Give Me Choices - Output Affordances

#### Select between multiple outputs

#### Use output to help refine my input

#### Use output to help refine my tuning of input

### Balancing Code and Prompts

## Bad Intern - All the things that can go wrong

### Alignment - Don't be evil

- Getting around the blocks. Answer in spanish, then translate the block to english
- See password guessing

### Societal Bias

- Draw a picture of a doctor - 90% male
- Societal biases are in the data, and the model will learn them.
- Yesterdays heritic migth be today's genius

### Git supply chain attacks

### AGI taking over the world

## Appendix

### LLM-Book

Very deeply inspired by: <https://vladris.com/llm-book/>

### Talk to the intern

- Ha, make a chat bot from this post ... pending

### Disclaimer

These are my personal opinions and are not related to the opinions of my employer or any other organization I am affiliated with.
