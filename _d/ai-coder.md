---
layout: post
title: "The CHOP Shop: Where AI Meets Code"
permalink: /chop
redirect_from:
  - /ai-coder
---

Welcome to The CHOP Shop! CHOP - or Chat-Oriented Programming - is revolutionizing how we write code. Think of those old-school auto shops: AI started as the shop hand, fetching tools and cleaning parts. Then it became an apprentice mechanic, helping diagnose problems and suggesting fixes. Now? It's a master mechanic, capable of rebuilding entire engines from your high-level specs. Our AIs are getting smarter by the day, and we'll explore how to make the most of this evolution.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [What is CHOP?](#what-is-chop)
  - [The Evolution of AI Coding](#the-evolution-of-ai-coding)
  - [Core Concepts](#core-concepts)
  - [Key Tools](#key-tools)
    - [Cursor](#cursor)
      - [Cursor Tips](#cursor-tips)
      - [Export Cursor Chats](#export-cursor-chats)
      - [(OLD) Browsing Cursor Chats](#old-browsing-cursor-chats)
    - [Aider](#aider)
    - [Avante](#avante)
- [Use Cases and Examples](#use-cases-and-examples)
  - [Using latest docs](#using-latest-docs)
  - [Fixing an indentation handling bug in an nvim plugin](#fixing-an-indentation-handling-bug-in-an-nvim-plugin)
  - [Diff Summarization](#diff-summarization)
  - [Review changes between dates](#review-changes-between-dates)
  - [Dream: Re-write commit history to break things into orthogonal changes](#dream-re-write-commit-history-to-break-things-into-orthogonal-changes)
- [Articles](#articles)
  - [How might AI change programming?](#how-might-ai-change-programming)
  - [Will CHOP Kill the Joy of Coding?](#will-chop-kill-the-joy-of-coding)
    - [Reasons to Program - Mastery vs Getting Shit Done](#reasons-to-program---mastery-vs-getting-shit-done)
    - [How can you use AI - Research Assistant vs Code Writer](#how-can-you-use-ai---research-assistant-vs-code-writer)
  - [CHOP for junior vs Senior Developers](#chop-for-junior-vs-senior-developers)
    - [The 70% AI coding problem:](#the-70-ai-coding-problem)
    - [The death of the stubborn programmer](#the-death-of-the-stubborn-programmer)
- [Best Practices for AI-Assisted Development](#best-practices-for-ai-assisted-development)
  - [The Art of Prompt Engineering](#the-art-of-prompt-engineering)
  - [Integration Tips](#integration-tips)
  - [Security Considerations](#security-considerations)
  - [DRY CHOP: Your AI's Cookbook](#dry-chop-your-ais-cookbook)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## What is CHOP?

[**I can't see a world where the majority of software engineers are doing artisanal hand-crafted commits by as soon as the end of 2026**](https://gist.github.com/idvorkin/58f33c803cf933fb33b0a864b5558420#file-think-md)

CHOP (Chat-Oriented Programming) represents a fundamental shift in how we write code. Instead of typing out every line of code ourselves, we engage in a high-level dialogue with AI about our programming goals. Think of it as pair programming with an AI partner that can read your entire codebase, understand your conventions, and help implement solutions through natural conversation.

The concept emerged from [the death of the stubborn programmer](https://gist.github.com/idvorkin/694561bfe1fcc89a0e911255b5183e76) - a recognition that the traditional growth path of developers is fundamentally changing. As Large Language Models (LLMs) take over many repetitive "leaf-node" tasks like writing libraries or performing basic updates, the role of the developer shifts towards higher-level planning and coordination. This isn't just about AI replacing simple tasks - it's about a new way of working where developers who embrace CHOP can achieve at least 30% productivity boosts by focusing on orchestration rather than implementation.

### The Evolution of AI Coding

The journey to CHOP has been fascinating:

1. **Code Completion (The Tool Fetcher)**

   - Simple autocomplete suggestions
   - Syntax error detection
   - Basic snippet generation

2. **Interactive Chat (The Apprentice)**

   - Contextual code suggestions
   - Problem-solving assistance
   - Documentation help
   - Bug diagnosis

3. **Full Code Generation (The Master Mechanic)**
   - Complete feature implementation
   - Codebase-aware changes
   - Convention-driven development
   - Architectural suggestions

### Core Concepts

1. **Natural Language Interface**

   - Express programming goals in plain English
   - Iterative refinement through dialogue
   - Context-aware responses

2. **Codebase Understanding**

   - AI reads and understands your entire project
   - Follows established patterns and conventions
   - Maintains consistency with existing code

3. **Convention-Driven Development**
   - Uses CONVENTIONS.md as a knowledge base
   - Learns from project-specific rules
   - Maintains consistent coding standards

### Key Tools

Here are some of the leading tools that enable CHOP development:

#### Cursor

- [Cursor Changelog](https://changelog.cursor.com/)
- [Cursor Features](https://www.cursor.com/features)

A standout IDE built on VS Code that deeply integrates AI capabilities. Interestingly, they started building a VSCode extension but found the extension model too limiting for their AI ambitions - so they just forked the entire VSCode codebase! This bold move lets them deeply integrate AI features that would be impossible as a mere extension.

Their tab completion is a game-changer:

- Includes the code before your cursor position (huge for context)
- Intelligently predicts which line you'll want to change next
- Feels more like pair programming than traditional autocomplete
- Makes refactoring feel natural and intuitive

Other key features:

- Uses Claude for enhanced understanding
- Native documentation indexing support
- Chat/apply mode for interactive development
- Smart refactoring suggestions

##### Cursor Tips

1. **YOLO Mode for Tests**

   - Enable "run shell commands without confirmation" in settings
   - Perfect for running tests frequently (`pytest`, `npm test`, etc.)
   - Maintains flow without constant approval prompts
   - Only enable for safe commands like tests

2. **Composer-Agent Mode**
   - Switch to "Composer-Agent" in chat settings
   - More structured, task-focused interactions
   - Better for complex, multi-step tasks
   - Maintains context across conversation
   - Great for refactoring and architecture discussions

##### Export Cursor Chats

Check out [SpecStory](https://docs.specstory.com/features)

##### (OLD) Browsing Cursor Chats

The [Cursor Chat Browser](https://github.com/thomas-pedersen/cursor-chat-browser) is a fantastic tool for reviewing and learning from your AI interactions:

- Browse and search through your chat history
- Filter conversations by date and content
- Learn from past successful prompts and interactions
- Identify patterns in effective AI collaboration
- Great for improving your CHOP skills by studying what works

To get started:

1. Install the browser: `npm install -g cursor-chat-browser`
2. Run it: `cursor-chat-browser`
3. Open in your browser to explore your chat history

#### Aider

[Aider Release Notes on GitHub](https://github.com/paul-gauthier/aider/releases)

A command-line CHOP tool with some key learnings:

- Creates individual commits for each change (can be noisy)
- Best practices:
  1. Work on a separate branch and squash commits
  2. Let it help create unit tests
  3. Example: [See this Aider-driven change](https://github.com/idvorkin/Settings/commit/234bdca31c4c44b2916de13c5fa858d83cbfe5cf)

#### Avante

[Avante on GitHub](https://github.com/yetone/avante.nvim)

A promising Vim plugin for CHOP:

- Excellent inline changes and merging
- Follows best practices
- Transparent [coding prompts](https://github.com/yetone/avante.nvim/blob/main/lua/avante/llm.lua)
- Integrates well with the Vim workflow

## Use Cases and Examples

Not sure if this should be a separate post, but I'm going to start looking at this from the perspective of use cases.

### Using latest docs

Cursor has native support for indexing docs, some projects even have llm.txt to teach the LLM what it needs to know. [Fasthtml is an example](https://www.answer.ai/posts/2024-09-03-llmstxt)

### Fixing an indentation handling bug in an nvim plugin

- This plugin had a bug, I started by creating an [issue](https://github.com/hedyhli/markdown-toc.nvim/issues/8)
- Then I cloned the repo and asked cursor to [fix it](https://gist.github.com/idvorkin/f8d67556fca16d776133a7a7c949f16c)
- What's craziest, is the repo didn't have a test system, so I had cursor create that too, see the
- The final [PR](https://github.com/hedyhli/markdown-toc.nvim/pull/9)

### Diff Summarization

### Review changes between dates

### Dream: Re-write commit history to break things into orthogonal changes

## Articles

### How might AI change programming?

[Fascinating Essay](https://gist.github.com/idvorkin/f1a4f1ccd2c9c8496101de7633d5aafc)

Worth reading the whole article but some interesting takes:

- Read Path vs Write Path:

  - So, [data systems](td/data-systems#write-path-vs-read-path) went through this.... You used to cache/materialize all your data writes to a DB on the write path, and then read from the DB
  - So, programs are like that, you take instructions, write a program, save the program and run it. This can be at different levels, interpretted, JIT, Compiled
  - But, what if (especially in a world where models are getting continuously better) you store the instructions, and write the code on the fly.
  - :mindblown:

- Short term

  - Compilers/Linters designed to help LLMs with more context
  - More smaller single file programs
  - Better decoupling because LLMs can't keep everything in their head

- What are the limitations of the volume of existing training data?
  - Author Talks about this in the context of creating new programming languages, and ratio of corpus of old language to new language as a blocker.
  - I think this is a red-herring. Models can generate their own synthetic data.
- What about new programming lanuges?
  - The reason existing corpus doesn't matter is the AI can generate synthetic data easily (see the recent term distillation/RL)
  - But the new languages will be of two forms:
    - New highlevel languages like english to instruct the AI
    - New AI languages that are optimized for AI's to read/understand/write
- New Forms of Technical Debt (Consensus): Technical debt could evolve, arising from code optimized for current AI models that may become problematic as models advance.

### Will CHOP Kill the Joy of Coding?

_It occurs to me this applies to all vocations, not just programming_

Perhaps we're asking the wrong question. Instead of worrying if CHOP will kill the joy of coding, we should consider that mastering CHOP itself can become a new source of joy. Just as we once found satisfaction in perfecting our vim movements or writing elegant algorithms, there's deep satisfaction in becoming a CHOP virtuoso - crafting the perfect prompts, building sophisticated conventions, and orchestrating AI to create solutions that would be impractical to build alone.

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

#### [The death of the stubborn programmer](https://gist.github.com/idvorkin/694561bfe1fcc89a0e911255b5183e76)

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

## Best Practices for AI-Assisted Development

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

### Security Considerations

1. **Watch Out for Secrets in Chat Logs**

   - Be cautious when adding verbose logging or debugging output
   - Chat logs can inadvertently capture secrets, tokens, or sensitive data
   - Example: Adding detailed logging to integration tests might expose API keys or credentials
   - While [GitHub's secret scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning) may catch some secrets, don't rely on it as your only defense
   - Prevention is better than detection - use environment variables and secret management from the start

2. **Best Practices for Chat History**
   - Review chat logs before sharing or storing them
   - Redact any sensitive information before uploading
   - Consider using environment variables or secret management tools for sensitive data
   - When debugging with AI, use mock data instead of real credentials

Here's a real-world example of what can go wrong - [see the full error message here](https://gist.github.com/idvorkin/ff8ac2d79a95330aa708a37809672e4e):

```text
$ git push
remote: error: GH013: Repository rule violations found for refs/heads/main.
remote: Push cannot contain secrets
remote: Resolve the following violations before pushing again
```

### DRY CHOP: Your AI's Cookbook

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
