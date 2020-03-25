---
layout: post
---

# Minecraft Notes

## Why?

Kids love minecraft, dad loves tech. Here's my experineces in the world of minecraft

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Bedrock not Java](#bedrock-not-java)
    - [Bedrock Server](#bedrock-server)
    - [The X-Box Proxy Hack](#the-x-box-proxy-hack)
    - [Run bedrock server on lightsail/AWS](#run-bedrock-server-on-lightsailaws)
- [Scripting](#scripting)
    - [Command Blocks](#command-blocks)
    - [Functions](#functions)
    - [Resource Packs](#resource-packs)
    - [Behavior Packs](#behavior-packs)
    - [Connecting to a javascript 'script'](#connecting-to-a-javascript-script)
- [Meta Stuff](#meta-stuff)
    - [Copying worlds between servers and stand alone](#copying-worlds-between-servers-and-stand-alone)
    - [World Editors](#world-editors)
- [Minecraft Education Edition](#minecraft-education-edition)
- [Cool Stuff](#cool-stuff)
    - [Fany worlds](#fany-worlds)
- [Other Resources](#other-resources)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Bedrock not Java

There are two branches of Minecraft, Java, which is the old version, and bedrock which runs on all modern systems, e.g. iOS, Android, Windows 10, XBox. Because my goal is entertaining modern kids, I'm focused on Bedrock. There is no interoperability between Bedrock and Java, which is pretty frustrating.

As best I can tell, most of the mods and servers refer to the java version. I don't know why, but my hunch is that was back in Minecrafts hayday, and they switched to Bedrock, and people have been less interested in hacking around on it.

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

### Connecting to a javascript 'script'

## Meta Stuff

### Copying worlds between servers and stand alone

https://www.reddit.com/r/MCPE/comments/aqlld1/using_a_saved_realm_world_on_a_bedrock_dedicated/

### World Editors

Minecraft tool chest - https://mcctoolchest.weebly.com/blockeditor.html

## Minecraft Education Edition

Not sure what this is as you need an education account. Looks like you have an 'agent' that you can brogram using blockly. That's pretty cool.

## Cool Stuff

### Fany worlds

## Other Resources
