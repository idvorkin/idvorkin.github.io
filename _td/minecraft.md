---
layout: post
no-render-title: true
title: Minecraft Notes
---

_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/minecraft.md)_

# Minecraft Notes

## Why?

Kids love Minecraft, dad loves tech. Here's my experiences in the world of Minecraft

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Bedrock not Java](#bedrock-not-java)
  - [Bedrock Server](#bedrock-server)
  - [The X-Box Proxy Hack](#the-x-box-proxy-hack)
  - [Run bedrock server on lightsail/AWS](#run-bedrock-server-on-lightsailaws)
- [Scripting](#scripting)
  - [Command Blocks](#command-blocks)
  - [Functions](#functions)
  - [Resource Packs](#resource-packs)
  - [Behavior Packs](#behavior-packs)
  - [Connecting to a JavaScript 'script'](#connecting-to-a-javascript-script)
- [Meta Stuff](#meta-stuff)
  - [Copying worlds between servers and stand alone](#copying-worlds-between-servers-and-stand-alone)
  - [World Editors](#world-editors)
- [Minecraft Education Edition](#minecraft-education-edition)
- [Making resource packs](#making-resource-packs)
- [Cool Stuff](#cool-stuff)
  - [Fancy worlds](#fancy-worlds)
- [Other Resources](#other-resources)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Bedrock not Java

There are two branches of Minecraft, Java, which is the old version, and bedrock which runs on all modern systems, e.g. iOS, Android, Windows 10, XBox. Because my goal is entertaining modern kids, I'm focused on Bedrock. There is no interoperability between Bedrock and Java, which is pretty frustrating.

As best I can tell, most of the mods and servers refer to the java version. I don't know why, but my hunch is that was back in Minecraft heyday, and they switched to Bedrock, and people have been less interested in hacking around on it.

Because most of what you find doesn't say if it's bedrock or java, start by checking for that, otherwise you'll waste a bunch of time realizing it's for the java version.

### Bedrock Server

From Minecraft itself:

https://www.minecraft.net/en-us/download/server/bedrock/
https://www.reddit.com/user/ProfessorValko/comments/9f438p/bedrock_dedicated_server_tutorial/

Here's a container recipe
https://hub.docker.com/r/itzg/minecraft-server/

Here's a server wrapper

https://github.com/perrochon/simple-bedrock-script

Weird thing you need to do if you're running on windows:

CheckNetIsolation.exe LoopbackExempt –a –p=S-1-15-2-1958404141-86561845-1752920682-3514627264-368642714-62675701-733520436

### The X-Box Proxy Hack

So, x-box doesn't' allow you to connect to 'remote servers', however you can connect to local ones on your LAN. So you need to setup a UDP proxy to make it work. I'm using the below with no issues.

https://github.com/jhead/phantom

### Run bedrock server on lightsail/AWS

- Use Ubuntu, way simpler then CentOS
- It's CPU heavy RAM light
- Don't forget to open the UDP port
- Multiple servers same box
- Backup worlds

## Scripting

### Command Blocks

### Functions

### Resource Packs

### Behavior Packs

### Connecting to a JavaScript 'script'

## Meta Stuff

### Copying worlds between servers and stand alone

https://www.reddit.com/r/MCPE/comments/aqlld1/using_a_saved_realm_world_on_a_bedrock_dedicated/

### World Editors

Minecraft tool chest (for Java - https://mcctoolchest.weebly.com/blockeditor.html)

Minecraft tool chest for PE:

http://www.mcctoolchest.com/Download

## Minecraft Education Edition

Not sure what this is as you need an education account. Looks like you have an 'agent' that you can program using blockly. That's pretty cool.

## Making resource packs

[Bridge](https://github.com/bridge-core/bridge)
[Resource Pack Tutorial](https://minecraft.gamepedia.com/Tutorials/Creating_resource_pack_add-ons)

## Cool Stuff

### Fancy worlds

## Other Resources
