---
layout: post
title: AI code writer
permalink: /chop
redirect_from:
  - /ai-coder
---

Buckle up, code warriors! AI's grand adventure in the coding realm has been nothing short of a rollercoaster ride. Picture this: we started with humble code completion, like an eager puppy fetching snippets. Then, boom! We leveled up to out-of-band chat, where AI became our coding buddy, always ready for a brainstorming session. And now? Hold onto your keyboards, because we've hit the jackpot with full-blown code writing! Welcome to the era of CHOP - Chat-Oriented Programming - where coding has transformed from a solo trek into a wild party where everyone's invited - from newbie coders to seasoned tech wizards. So, grab your favorite caffeinated beverage and join the fun - the future of coding is here, and it's got AI written all over it!

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Completion](#completion)
  - [Co-pilot](#co-pilot)
- [Coder](#coder)
  - [Cursor](#cursor)
  - [Aider](#aider)
  - [Avante](#avante)
- [Use Cases](#use-cases)
  - [Using latest docs](#using-latest-docs)
  - [Diff Summarization](#diff-summarization)
  - [Review changes between dates](#review-changes-between-dates)
  - [Dream: Re-write commit history to break things into orthogonal changes](#dream-re-write-commit-history-to-break-things-into-orthogonal-changes)
  - [Should I code once we have AI?](#should-i-code-once-we-have-ai)
    - [Reasons to Program - Mastery vs Getting Shit Done](#reasons-to-program---mastery-vs-getting-shit-done)
    - [How can you use AI - Research Assistant vs Code Writer](#how-can-you-use-ai---research-assistant-vs-code-writer)
  - [AI for junior vs Senior Developers](#ai-for-junior-vs-senior-developers)
    - [The 70% AI coding problem:](#the-70-ai-coding-problem)
    - [The death of the stubborn programmer](#the-death-of-the-stubborn-programmer)
- [Future of AI Coding: Beyond the Basics](#future-of-ai-coding-beyond-the-basics)
  - [Emerging Trends](#emerging-trends)
- [Best Practices for AI-Assisted Development](#best-practices-for-ai-assisted-development)
  - [The Art of Prompt Engineering](#the-art-of-prompt-engineering)
  - [Integration Tips](#integration-tips)
  - [DRY CHOP: Your AI's Cookbook 🧑‍🍳](#dry-chop-your-ai-s-cookbook)
- [Real-World Success Stories](#real-world-success-stories)
  - [Case Study: The 24-Hour MVP](#case-study-the-24-hour-mvp)
  - [The Legacy Code Whisperer](#the-legacy-code-whisperer)
- [The Human Element](#the-human-element)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Completion

### Co-pilot

The original

## Coder

### Cursor

- [Cursor Changelog](https://changelog.cursor.com/)
- [Cursor Features](https://www.cursor.com/features)

WOW - Just started playing with that, it was fantastic, super smooth, looking forward to seeing if Avante can catch up.

It basically made this whole change via [chat/apply](https://github.com/idvorkin/idvorkin.github.io/commit/3fa1726f179c7270c5add3264b7087613039ad9e), with me making minimal suggestions

- Tab completion

  - includes the code before what you typed (huge improvement)
  - Finds the next line you likely want to change (great for sensing refactor)

- They forked VS.Code so could keep most of what it has.
- They use Claude, which seems to be better than co-pilot
- I used it mostly in chat/apply mode, looking forward to using it on a project where I'm writing more of the code (probably will try when I look at the transformer code in Jupyter again)
- You put in documentation tags to bring it, and it also does embeddings for it.

### Aider

[Aider Release Notes on GitHub](https://github.com/paul-gauthier/aider/releases)

OK, so Aider tries to make every change its own commit, which is super noisy and error-prone, a few learnings:

1. Do the changes on a branch then squash up the final branch
2. You need to have unit tests, let Aider create them (I've got to figure out how to let it name them)

Here's [a change almost totally done with Aider](https://github.com/idvorkin/Settings/commit/234bdca31c4c44b2916de13c5fa858d83cbfe5cf)

### Avante

[Avante on GitHub](https://github.com/yetone/avante.nvim?tab=readme-ov-file)

Just starting to play with [this](https://github.com/yetone/avante.nvim). It's a VIM plugin, looks solid.

What's nice:

- It does a good job of inline changes/merging (like co-pilot propose diffs)
- It uses many best practices so I discovered render and other nice libraries
- Fun to see what the [coding prompts are](https://github.com/yetone/avante.nvim/blob/main/lua/avante/llm.lua)

## Use Cases

Not sure if this should be a separate post, but I'm going to start looking at this from the perspective of use cases.

### Using latest docs

Cursor has native support for indexing docs, some projects even have llm.txt to teach the LLM what it needs to know. [Fasthtml is an example](https://www.answer.ai/posts/2024-09-03-llmstxt)

### Diff Summarization

### Review changes between dates

### Dream: Re-write commit history to break things into orthogonal changes

### Should I code once we have CHOP?

_It occurs to me this applies to all vocations, not just programming_

#### Reasons to Program - Mastery vs Getting Shit Done

1. **For the Love of Coding: Mastery and Joy**

   - Programming can be intrinsically rewarding. The process of solving problems, creating something from nothing, and continuously improving one's skills offers satisfaction and joy. Mastery of coding, like any craft, provides a sense of accomplishment.
   - Using VIM key combos is especially fun, like doing joystick combos in Street Fighter II - it's a fun challenge that keeps you engaged and sharpens your skills.
   - My pleasure is coding, but I'm guessing this applies simarly to cooking, woodworking, and stampcollecting

2. **To Achieve Practical Goals: Shipping Products**
   - On the other hand, programming is a means to an end. It's a tool for building and shipping products, for solving real-world problems, and for getting tangible results. Efficiency and productivity are key, and AI can help streamline these processes.

#### How can you use AI - Research Assistant vs Code Writer

1. **Getting Help: Replacing Traditional Resources**

   - AI as a resource for programming assistance is becoming increasingly popular. It provides a more interactive and immediate alternative to traditional platforms like Stack Overflow, documentation, or Reddit.
   - In the past, before the internet, finding solutions to programming problems was a cumbersome process. AI represents an evolution of these resources, offering instant, personalized help that can significantly speed up the problem-solving process.

2. **AI Writing Code: The Fun vs. Automation Dilemma**
   - While AI can write code efficiently, this raises the question: should we let it take over tasks we enjoy? For many, coding is a hobby, a passion akin to the thrill of executing perfect joystick combos in Street Fighter II using specific nvim key combinations. The challenge and mastery involved are part of the joy; should we willingly give that up?

Mostly lifted from this guy:

{%include youtube.html src="mTa2d3OLXhg?start=5160" %}

### CHOP for junior vs Senior Developers

#### [The 70% AI coding problem](https://gist.github.com/idvorkin/bf72b861c826e67ad460f06f1ccb9afc):

Core Observations:

- AI tools dramatically increase coding speed but don't necessarily improve software quality
- There's a "70% problem" where getting the last 30% of functionality is disproportionately difficult
- Experienced developers benefit more from AI tools than beginners
- The tools are better at accelerating known patterns than teaching new concepts

Key Usage Patterns:

- "Bootstrappers" use AI to quickly generate MVPs and prototypes
- "Iterators" use AI for daily development tasks like code completion
- Senior developers constantly refactor and improve AI-generated code
- Junior developers tend to accept AI output with less critical review

#### [The death of the stubborn programmer](https://gist.github.com/idvorkin/42f7441a2e9aa1171faa9c0579a7aa2d)

The Evolution of Programming and Automation

- The article discusses the changing landscape of software development due to the rise of AI tools, particularly Large Language Models (LLMs)
- LLMs can now handle many repetitive "leaf-node" tasks like writing libraries or performing basic updates
- Higher-level tasks, involving planning and coordination, remain for humans, but these are typically more complex and harder to learn
- This shift threatens the traditional growth path of junior developers, who used to gain experience through simpler tasks

Chat-Oriented Programming (CHOP)

- Chat-Oriented Programming (CHOP) refers to using LLMs through chat interfaces to handle programming tasks
- CHOP allows developers to "print" leaf tasks quickly by interacting with LLMs, thus boosting productivity by at least 30% in many cases
- Despite its benefits, CHOP has challenges, including a steep learning curve, lack of established teaching methods, and reliance on human context integration

The Debate Around CHOP and Autonomous Agents

- Some believe CHOP is a transitional phase, arguing that fully autonomous agents will soon take over more of the task graph
- Others, including the author, are skeptical, highlighting the slow and incremental nature of technological advancements
- The author emphasizes the incremental growth of CHOP and its potential to remain relevant for years

Impact on Junior Developers and Career Growth

- Junior developers face difficulties as LLMs take over the simpler tasks they traditionally used to build their skills
- The career pipeline from junior to senior developer roles is disrupted, raising questions about how new developers will acquire the necessary experience

Industry Transformation and Productivity

- CHOP is changing how programming is conducted, with significant productivity boosts for companies and individuals
- Enterprises must adapt to these tools to remain competitive, but the transition requires investment in learning and tool integration

Challenges in Measurement and Adoption

- Measuring the effectiveness of CHOP and other AI coding tools remains a challenge for enterprises
- The lack of standardized metrics or established best practices for CHOP adoption complicates its integration in professional environments

## Future of AI Coding: Beyond the Basics

Hold onto your mechanical keyboards, folks! The future of AI coding is looking wilder than a Python script at a JavaScript convention. Let's dive into what's cooking in the AI kitchen:

### Emerging Trends

1. **Multi-Modal AI Development**

   - Picture this: describing your UI in plain English while waving your hands around like a coding conductor, and BAM! Your AI assistant whips up a pixel-perfect interface. We're talking voice, gestures, and maybe even interpretive dance (okay, maybe not that last one... yet).
   - Visual programming is getting a serious upgrade - soon you'll be sketching wireframes on napkins and having AI turn them into production-ready code faster than you can say "responsive design."

2. **AI-Powered Code Evolution**
   - Your code will literally evolve like a digital Darwin experiment. AI will suggest optimizations in real-time, learning from your project's entire git history and your team's coding patterns.
   - Bug prediction? That's so 2023. We're moving towards "code healing" - AI that spots potential issues before they even become bugs. It's like having a time-traveling debugger!

## Be the Best CHOPer: Best Practices

### The Art of Prompt Engineering

1. **Be Specific, But Not Too Specific**

   - Good: "Create a React component for a responsive navigation bar with dark/light theme support"
   - Better: Include your project's conventions and specific requirements
   - Best: Reference existing components and patterns in your codebase

2. **Iterative Refinement**
   - Start broad, then narrow down
   - Use AI-generated code as a foundation, not a final product
   - Always review and refactor - AI is your co-pilot, not your autopilot

### Integration Tips

1. **Version Control Strategy**

   - Create separate branches for CHOP-generated code
   - Use meaningful commit messages that indicate CHOP assistance
   - Review CHOP-generated changes with extra scrutiny

2. **Documentation is Your Friend**
   - Document AI-assisted changes
   - Keep track of prompt patterns that work well
   - Share successful AI interactions with your team

### DRY CHOP: Your AI's Cookbook 🧑‍🍳

Think of your AI assistant as an eager junior developer who can learn and retain knowledge - but only if you teach them properly. Instead of repeating the same instructions in every prompt, establish a single source of truth through your CONVENTIONS.md file. This approach not only saves time but ensures consistency across all AI-generated code. The key is treating conventions as a living document that both teaches the AI and evolves with your project. You can see [an example of this evolution here](https://gist.github.com/idvorkin/6f506f47bf6c4c57a1ff5a2d24e345dd#conventionsmd).

> **Note**: Cursor IDE implements this concept using a `.cursorrules` file that points to your CONVENTIONS.md. Simply create a `.cursorrules` file in your project root with the content `CONVENTIONS.md` to enable this feature ([see example](https://github.com/idvorkin/idvorkin.github.io/commit/332e43c7e211640f55da9be858164e6aa003ab9e)).

1. **Let AI Own the Conventions**

   - Have AI update CONVENTIONS.md after each significant interaction
   - Ask AI to document patterns they notice in your feedback
   - Let AI propose new conventions based on repeated guidance
   - Use the conventions file as a learning record for the AI

2. **Review Conventions More Carefully Than Code**

   - Convention changes impact all future code generation
   - One wrong convention can multiply mistakes across the project
   - Treat CONVENTIONS.md updates as critical infrastructure changes
   - Remember: Bad code affects one feature, bad conventions affect everything

3. **Structure Conventions for AI Understanding**

   - Break conventions into clear, focused sections (e.g., "Image Handling", "Blog Post Structure")
   - Include concrete examples for each convention
   - Use numbered steps for processes that must happen in order
   - Add context about why each convention exists

4. **Evolve Conventions Iteratively**
   - Start simple with core conventions
   - Let real usage guide what needs documentation
   - Update conventions when you find yourself repeating instructions
   - Remove or refine conventions that cause confusion

Here's a recent example of this approach in action:

1. [Permalink Management](https://github.com/idvorkin/idvorkin.github.io/commit/4c36f25adf3a0e99024aa7c925383e3321a66976)
   - AI helped establish clear permalink change process
   - Added guidance on maintaining compatibility
   - Standardized use of redirect_from in front matter

## Real-World Success Stories

### Case Study: The 24-Hour MVP

A solo developer built a fully functional e-commerce platform in 24 hours using AI assistance. The secret sauce? Breaking down the project into small, well-defined tasks and letting AI handle the boilerplate while focusing on business logic and user experience.

### The Legacy Code Whisperer

A team modernized a 15-year-old codebase using AI to help understand, document, and gradually refactor the legacy code. What would have taken months of archeological code diving was completed in weeks.

## The Human Element

Remember, fellow code warriors, AI is like having a super-powered intern - incredibly fast and knowledgeable, but still needs your wisdom and experience to create truly outstanding software. The future isn't about AI replacing developers; it's about developers who use AI outperforming those who don't.

Keep coding, keep learning, and most importantly, keep having fun with these amazing new tools. The future of coding is not just bright - it's absolutely dazzling! 🚀✨
