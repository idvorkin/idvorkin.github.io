---
layout: post
title: "Microsoft Azure - The Genesis Node"
author: "Igor Dvorkin"
comments: true
featured: false
date: "2018-12-09 07:25:17 Pacific Daylight Time"
tag: "software as a story"
---

Igor, you know the odds of shipping Azure on time are slim to none."

{% include this_is_part_of_saas.md %}

My boss and I nodded our agreement as the director of OS development for Azure continued.

"Every team is sending a volunteer to the newly formed DevOps team. With an expert from each team, DevOps will be an elite, rapid-response team, able to deal with every type of problem in short order. The budget will be wide open, and the DevOps team is authorized to take any action required - are you the man for this?"

I'm a sucker for hard problems - building all new software, powering-up a brand new datacenter, delivering a product critical to Microsoft's success, and shipping by a date that would require a minor miracle.

"I'm in," I said with pride.

The full impact of those two words sank in that evening as Jay, my OS team mentor, briefed me on my new role. "You'll need to respond rapidly and decisively. The more you know, the more successful you'll be - for example just today we finished our destructive testing, a node will fail after 10,000 formats." "Here ya go Hun" interrupted our waitress as she gave Jay his usual wink and IPAs. Jay and I finished up quickly so I could get a good night's rest before my life in DevOps began.

The air was charged and a half dozen voices were raised as I entered the DevOps command center the next morning.

"Holy shit, someone stole the genesis node!"

"Do you think it was Google, Amazon or a rogue group at Microsoft?"

"Don't know, it doesn't matter - this is crippling, we need to augment our physical security, we should split into shifts and monitor the situation 24/7 while we wait for our new retina scanners to arrive."

I might be new to DevOps, but I know Azure - it is built to handle disaster. At least two nodes must fail per component before Azure even hiccups. Young and cocky I jumped in:

"What's the genesis node? Who cares that we lost a node, we're built to handle disaster."

"Every node except the genesis node," smirked the expert from the fabric team, looking down on me as he continued.

"The genesis node is the node from which all fabrics are spawned. Without a genesis node, no fabrics can be deployed and no fabric can be healed. We can't do development without it and we'll never hit our ship date."

Annoyed, I cut him off "So, reinstall the genesis node."

He glared at me while throwing the final, deadly punch, "The person that stole this was brilliant. This is our weakest link, a single point of failure. The genesis node is hand-built; it will take us days to rebuild it, assuming we can. We might have to wipe out the datacenter and start again - this could cost us weeks."

Humbled, I gulped my assent, "How can I help?"

Two weeks later, I was on my third cup of coffee trying to keep my eyes open on the midnight shift.

"Igor, you're the OS guy - where did the OS team get a node for destructive testing?" Bellowed the director of DevOps.

"Uh, I don't know - let me find out."

It turns out two weeks ago, the OS team requested a node for destructive testing. An ops person told the OS team to take any node they wanted, and they took the genesis node.

With the security threat understood, we cancelled our order for the retina scanners and shut down the midnight shift.

Moral of the story 1: Never attribute to malice that which can be attributed to incompetence.
Moral of the story 2: If you have something as important as a genesis node, put a sticker on it that says "Really, really important, do not touch."
Moral of the story 3: When Jay gives you a seemingly random factoid, ask follow-up questions.
