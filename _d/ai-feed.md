---
layout: post
title: "AI Feed — Curated Reading Through Claude"
permalink: /ai-feed
redirect_from:
  - /ai-reading
  - /curated-feed
tags:
  - ai
  - productivity
---

Pretty common: I get a bag of links — a newsletter, a Twitter thread, a friend's Slack message. I open them all in tabs, skim, close most, and forget. Maybe one in ten sticks. The rest vanish into the consumption void.

{% include ai-slop.html percent="50" %}

This is my attempt to fix that using Randy the Raccoon — my AI reading partner. [Why give AI a name?](/larry#why-larry-has-a-name) Same reason Larry the Life Coach has one: humans talk to people, not systems. Instead of the tab-explosion-and-forget cycle, I paste links into Randy, who fetches, summarizes, predicts what I'll like, and captures everything here. Later, when I actually read the good ones, I come back and debrief — recording what resonated and what didn't.

It's [GTD](/gtd) capture meets AI triage. And unlike passive consumption, this process produces something: a public record of what I read, what I think about it, and how my taste evolves. That makes it [production, not consumption](/produce-consume).

## Feed

### 2026-03-23

- **[Adapting to AI: Reflections on Productivity](https://blog.colinbreck.com/adapting-to-ai-reflections-on-productivity/)** — Colin Breck on the hidden costs of AI-amplified output
  - _Summary_: While AI dramatically amplified his engineering output in 2025, the real challenge is psychological — loss of flow states, identity crisis among experienced engineers, and an unsustainable pace where linear human adaptation can't match exponential AI capability growth. The shift from immersive problem-solving to supervising stochastic agents fundamentally diminishes the craft satisfaction that drew people to the field.
  - _Why Randy thinks I'd like it_: Practitioner reflection from someone doing the work, not theorizing. The flow/craft loss angle connects to your cognitive debt writing but from a more personal, emotional direction. He's processing real discomfort, not performing an opinion.
  - _Cross-links_: [How Igor CHOPs](/how-igor-chops), [CHOP](/chop), [Productive](/productive)
  - _Tags_: #ai-practice #craft #practitioner #flow
  - _Reaction_: Read — liked it.

- **[Agent-Native Engineering](https://www.generalintelligencecompany.com/writing/agent-native-engineering)** — Andrew Pignanelli on restructuring orgs around AI agents as primary ICs
  - _Summary_: Engineers must shift from writing code to managing AI agents that write code — humans as tech leads directing parallel agent work streams. Competitive advantage comes from maximizing agent throughput, investing in automated quality controls (tests, linters, claude.md files), and reorienting engineers toward product thinking. Organizations that don't adopt this model "will cease to exist."
  - _Why Randy thinks I'd like it_: Core thesis maps to your /ai-native-manager post — agents as ICs, humans as managers. But the tone is prescriptive and hyperbolic, more CEO manifesto than practitioner reflection. Practical bits (task tiers, sync/async workflows) are useful but not novel if you've been living this through CHOP. Risk: familiar territory dressed up as urgency.
  - _Cross-links_: [AI Native Manager](/ai-native-manager), [CHOP](/chop), [How Igor CHOPs](/how-igor-chops), [AI Developer](/ai-developer)
  - _Tags_: #ai-practice #management #org-design
  - _Reaction_:

- **[CEOs Don't Steer](https://www.ribbonfarm.com/2017/11/09/ceos-dont-steer/)** — Venkatesh Rao on why executives are orientation locks, not navigators
  - _Summary_: Effective CEOs don't steer — they serve as "orientation locks," maintaining unwavering momentum in a chosen direction while delegating tactical navigation downward. When genuine reorientation is needed, organizations replace the CEO rather than having them turn the ship, because steering at the top hemorrhages compounding momentum.
  - _Why Randy thinks I'd like it_: Classic Rao systems thinking — contrarian with substance. The "who steers vs. who locks orientation" model is directly relevant to AI-native management and org restructuring. Binary thinking as a feature, not a bug, is genuinely novel framing.
  - _Cross-links_: [Manager Book](/manager-book), [AI Native Manager](/ai-native-manager), [Strategy](/strategy)
  - _Tags_: #systems-thinking #management #contrarian #leadership
  - _Reaction_:

### 2026-03-16

- **Tips for getting coding agents to write good Python tests** — (link TBD, from OmniFocus inbox Jan 29)
  - _Tags_: #ai-practice #testing #craft
  - _Reaction_: TBD — queued for reading

- **[Dario Amodei — The Adolescence of Technology](https://darioamodei.com/the-adolescence-of-technology)** — Dario on AI's current awkward growth phase
  - _Tags_: #ai-philosophy #anthropic #longread
  - _Reaction_: TBD — queued for reading

### 2026-03-04

- **[Don't Become an Engineering Manager](https://newsletter.manager.dev/p/dont-become-an-engineering-manager)** — Anton Zaides on why the EM career path no longer makes sense
  - _Summary_: Zaides argues that senior engineers should no longer pursue management roles — rapid tech change makes it hard for managers to stay current, flattened orgs mean fewer senior management positions, and Staff engineers now earn 20-30% more than EMs. He reverses his previous advice, positioning the IC track as more rational, though acknowledges genuine interest in management work should still outweigh financial optimization.
  - _Why Randy thinks I'd like it_: Management/leadership in AI era — directly relevant to your ai-native-manager post. Contrarian reversal from someone who previously advocated for the EM path.
  - _Cross-links_: [AI Native Manager](/ai-native-manager), [Manager Book](/manager-book), [Software Leadership Roles](/software-leadership-roles)
  - _Tags_: #management #contrarian #career
  - _Reaction_: This is good. These are the reasons — the only reason to be an EM is because you want to. Adding to "Should I become an EM?" on the AI native EM post.

### 2026-03-01

_Source: [Joy & Curiosity #76](https://registerspill.thorstenball.com/p/joy-and-curiosity-76) by Thorsten Ball_

- **[Cognitive Debt](https://margaretstorey.com/blog/2026/02/09/cognitive-debt/)** — Margaret-Anne Storey on losing understanding when AI generates code
  - _Summary_: Velocity without understanding is not sustainable. As AI accelerates development, the real risk isn't technical debt but cognitive debt — teams losing shared understanding of what software does and why. Advocates pair programming, refactoring, and TDD to maintain collective "theory" of a system.
  - _Why Randy thinks I'd like it_: You coined "The Willison Pattern" and built /explainers around this exact concept. This is your home turf.
  - _Cross-links_: [Explainers](/explainers), [AI Native Manager](/ai-native-manager), [CHOW](/chow), [Pet Projects](/pet-projects)
  - _Tags_: #cognitive-debt #ai-practice #craft
  - _Reaction_: Cognitive debt doesn't just apply to produced code — it applies to everything happening in an organization. When we say "everyone should just do demos," that's cognitive debt too. Everyone can't keep up with the firehose, and the same mitigations apply. We should be able to use AI to comprehend all of it and keep it coherent. Related: Meta is circulating "second brain" (based on Tango's thing) — same problem space.
- **[How We Hire Engineers When AI Writes Our Code](https://www.tolans.com/relay/how-we-hire-engineers-when-ai-writes-our-code)** — Dan Federman on rethinking technical interviews
  - _Summary_: Traditional technical interviews are obsolete. Tolan redesigned hiring to test judgment, reasoning, and architecture by having candidates build real features with AI tools — testing what actually matters now, not algorithm memorization.
  - _Why Randy thinks I'd like it_: Direct extension of your /ai-hiring post. Real company doing it, not just theorizing.
  - _Cross-links_: [AI Hiring](/ai-hiring), [Agency](/agency), [AI Native Manager](/ai-native-manager)
  - _Tags_: #ai-hiring #management #craft
  - _Reaction_: Shallow. Basically "give candidate AI tools and watch them build something for 4 hours" — which is the classic take-home-but-onsite format. I like the idea in principle but it has the same cost problem I flag in my ai-hiring post: it's expensive for both sides. If that's the entire interview day, maybe it works. Was hoping for deeper insight into what signals they actually extract and how they evaluate judgment vs. just watching someone vibe-code.
- **[747s and Coding Agents](https://carlkolon.com/2026/02/27/engineering-747-coding-agents/)** — Carl Kolon on AI eroding deep understanding
  - _Summary_: AI agents boost output but erode deep understanding — like a 747 pilot who stops learning because the plane flies itself. Programmers risk becoming operators, not engineers, if they don't deliberately maintain domain knowledge through hands-on problem-solving.
  - _Why Randy thinks I'd like it_: Maps directly to your "Don't stop thinking" and "Deep Blue" sections in /ai-native-manager.
  - _Cross-links_: [AI Native Manager](/ai-native-manager), [CHOP](/chop)
  - _Tags_: #skill-atrophy #ai-practice #contrarian
  - _Reaction_: Already-seen insight dressed up with a metaphor. "AI makes you lazy if you let it" — I've already written this. Nothing novel in the execution or the framing. Need either a genuinely new angle or exceptional writing to justify retreading familiar ground.
- **[Nobody Knows How the Whole System Works](https://surfingcomplexity.blog/2026/02/08/nobody-knows-how-the-whole-system-works/)** — Lorin Hochstein on irreducible complexity
  - _Summary_: Complete comprehension across all layers of modern systems is impossible — a reality AI is making more acute, not fundamentally changing. Synthesizes perspectives from Simon Wardley, Adam Jacob, and others to argue it's dangerous to build without understanding, but full understanding is a myth.
  - _Why Randy thinks I'd like it_: Systems thinking is your jam. Connects to your complexity-per-person concerns in /ai-native-manager.
  - _Cross-links_: [AI Native Manager](/ai-native-manager), [Explainers](/explainers)
  - _Tags_: #complexity #systems-thinking #cognitive-debt
  - _Reaction_: Nothing new or novel. "You can't understand the whole system" is well-trodden ground.
- **[Building An Elite AI Engineering Culture](https://www.cjroth.com/blog/2026-02-18-building-an-elite-engineering-culture)** — Chris Roth on AI amplifying organizational strengths
  - _Summary_: AI amplifies existing organizational strengths and weaknesses — creating a 5.7x efficiency gap between disciplined teams and the rest. Without engineering rigor (specs, testing, reviews), AI tools just make your problems louder.
  - _Why Randy thinks I'd like it_: Relevant to your management writing, concrete data on the amplification effect.
  - _Cross-links_: [AI Native Manager](/ai-native-manager), [CHOP](/chop), [AI Hiring](/ai-hiring)
  - _Tags_: #management #ai-practice #engineering-culture
  - _Reaction_: Long, not powerful. Meh writing. Some interesting points buried in there but doesn't earn the length.
- **[Scattered Thoughts on LLM Tools](https://www.jmduke.com/posts/five-observations-ai-tools.html)** — Justin Duke on practical AI tool challenges
  - _Summary_: LLM tools are improving incrementally but remain fundamentally flawed as software products. The real bottleneck isn't AI capability but infrastructure — sandboxed environments, data integration, feedback loops, and systemic process gaps.
  - _Why Randy thinks I'd like it_: Practitioner perspective on the gap between AI hype and actual tool experience. Grounded.
  - _Cross-links_: [CHOP](/chop), [AI Cockpit](/ai-cockpit), [How Igor CHOPs](/how-igor-chops)
  - _Tags_: #ai-tools #practitioner #infrastructure
  - _Reaction_: Weird grab bag. Liked it but not insightful — scattered observations without a unifying thread.
- **[Cloudflare vinext](https://blog.cloudflare.com/vinext/)** — Steve Faulkner on one engineer rebuilding Next.js with AI
  - _Summary_: One engineer rebuilt Next.js as "vinext" in a week for $1,100 in AI tokens. AI doesn't need the intermediate abstractions humans created to manage complexity — many existing software layers will become obsolete.
  - _Why Randy thinks I'd like it_: Great case study of AI productivity, but more "look what AI can do" than practitioner reflection.
  - _Cross-links_: [CHOP](/chop), [AI Developer](/ai-developer), [Produce vs Consume](/produce-consume)
  - _Tags_: #ai-productivity #vibe-coding #case-study
  - _Reaction_: Didn't land because I don't know Next.js well enough to appreciate the technical achievement. But the underlying pattern — AI reimplements a well-documented API surface from scratch, skipping all the human-cognitive-load abstractions — is interesting. Would love to see this pattern applied to a domain I know better.
- **[The Happiest I've Ever Been](https://ben-mini.com/2026/the-happiest-ive-ever-been)** — Ben Wallace on finding joy outside career
  - _Summary_: True happiness comes from activities aligned with intrinsic values, not career prestige. Coaching youth basketball fulfilled him more than his corporate job. Tech workers should question Silicon Valley's propaganda about professional value equaling personal worth.
  - _Why Randy thinks I'd like it_: Connects to your joy/meaning writing but not AI-specific.
  - _Cross-links_: [Joy](/joy), [Produce vs Consume](/produce-consume)
  - _Tags_: #happiness #meaning #anti-hustle
  - _Reaction_: Interesting post on purpose. Worth linking from spiritual health content somewhere.
- **[The Very Hungry Caterpillar Design Analysis](https://lookingatpicturebooks.com/p/the-very-hungry-caterpillar)** — Mac Barnett & Jon Klassen on Eric Carle's craft
  - _Summary_: Carle's book succeeds through masterful control of color, shape, and die-cut innovation — not expressive character design. Deliberately stripped away emotional facial features to create warmth, bridging toys and books while carrying bittersweet melancholy about transformation.
  - _Why Randy thinks I'd like it_: Beautiful craft analysis but tangential to your usual themes.
  - _Cross-links_: [AI Journal](/ai-journal)
  - _Tags_: #design #craft #children
  - _Reaction_: Skimmed, didn't hook me.
- **[What Claude Code Actually Chooses](https://amplifying.ai/research/claude-code-picks)** — Research on AI code assistant tool selection
  - _Summary_: (Already read — Igor noted it was excellent)
  - _Why Randy thinks I'd like it_: Directly relevant to your daily CHOP workflow.
  - _Cross-links_: [CHOP](/chop), [How Igor CHOPs](/how-igor-chops), [AI Cockpit](/ai-cockpit)
  - _Tags_: #ai-tools #claude #research
  - _Reaction_: Already read — excellent.

## What I Gravitate Toward

_This section is Randy's recommender training data. It evolves as patterns emerge from what I read, skip, and love — building toward a personalized content ranker. The more detailed this gets, the better Randy's predictions become._

### Content Attributes I Love (stack-ranked)

1. **Practitioner reflection on craft** — Someone who actually does the work reflecting on what they learned, not theorizing from the sidelines. Bonus if they challenge their own assumptions.
2. **Connects to my existing writing** — If it extends, challenges, or provides evidence for something I've already written about (cognitive debt, agency, AI-native management), I'm almost always in.
3. **Contrarian takes with substance** — Not contrarian for shock value, but genuinely questioning mainstream consensus with real reasoning. "AI will replace X" hot takes = skip. "Here's why AI actually makes X harder" = love.
4. **Systems thinking** — How parts interact, emergent complexity, unintended consequences. Especially when applied to AI's second-order effects on teams and organizations.
5. **Real case studies over theory** — One company's actual experience beats ten thought pieces. Show me the receipts.
6. **Management/leadership in AI era** — How should orgs adapt? What's breaking? What's working?

### Creators I Follow

Podcasts and long-form content from these people get auto-promoted — I almost always want to process their stuff:

- **Andrej Karpathy** — [YouTube](https://www.youtube.com/@AndrejKarpathy), [No Priors appearances](https://podscripts.co). Brilliant practitioner who thinks out loud about where AI is going. His "claw psychosis" framing and agent taxonomy are exactly how I think about this space.
- **Lex Fridman** — [Podcast](https://lexfridman.com/podcast/). Deep long-form interviews. His site has human-edited transcripts with speaker labels at `lexfridman.com/{guest}-transcript/` which are much higher quality than auto-generated.
- **Peter Steinberger** — Creator of OpenClaw. Builder who thinks about agent architecture from first principles. His Lex interview is a masterclass in agentic engineering philosophy.

### Content Attributes I Skip

- **Hype pieces** — "AI will revolutionize X" without specifics
- **Benchmark comparisons** — Model A vs Model B on task C
- **Already-seen insights** — If I've internalized the core idea (e.g., PG startup lessons, "AI erodes deep skills"), I skip even good writing about it. Topic match alone doesn't save a shallow article. The bar for familiar territory: either a genuinely novel angle or exceptional writing. Hard to know depth before reading though — flag the risk, don't predict love or skip.
- **Mediocre writing** — Good ideas in long, underpowered prose get downgraded. Length must be earned.
- **Pure tutorials** — Step-by-step how-tos without opinions or reflection
- **Political framing of AI** — Left/right lens on technology

### Mood Modifiers

- **Deep focus mood**: Long-form practitioner essays, systems thinking, anything requiring concentration
- **Quick scan mood**: Case studies, data points, contrarian one-pagers
- **Creative/playful mood**: Design analysis, craft deep-dives, unexpected connections between fields
- **Management mood**: Hiring, culture, team dynamics, organizational design

### Calibration Notes

- _2026-03-01_: First session. From Joy & Curiosity #76, picked 10 of 19 links. Strong bias toward cognitive debt / AI practice / management cluster. Skipped PG startup essay (already internalized), political AI framing, and pure X/Twitter commentary. Already had read Claude Code research — actively follows AI tooling research independently.
- _2026-03-03_: Debrief on 8 articles. Most landed as "familiar territory, nothing new." Key lessons: (1) Topic relevance alone doesn't save shallow execution — 4 of 8 were right topic but underwhelming depth. (2) Writing quality is a real filter — good ideas in mediocre prose get downgraded. (3) Domain knowledge matters — vinext pattern was interesting but didn't land because Igor doesn't know Next.js. (4) Non-AI content (happiness/purpose) can land when it connects to personal writing themes. (5) For familiar territory, flag "you've written about this — worth a skim for new angles" rather than predicting love.
