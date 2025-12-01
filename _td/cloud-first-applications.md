---
layout: post
title: Cloud First Applications
---

The world is now on the cloud, here are my random notes on the topic.

<!-- prettier-ignore-start -->

<!-- vim-markdown-toc-start -->

- [Micro services](#micro-services)
- [Containers](#containers)
    - [Containers are about application packaging and delivery.](#containers-are-about-application-packaging-and-delivery)
        - [The power of the Dockerfile and image repository.](#the-power-of-the-dockerfile-and-image-repository)
    - [Containers as execution hosts - vs Virtual and Physical Machines](#containers-as-execution-hosts---vs-virtual-and-physical-machines)
    - [Container Orchestration](#container-orchestration)
        - [Kubernetes](#kubertnetes)
        - [Everything else](#everything-else)
- [Front Door - AWS API Gateway](#front-door---aws-api-gateway)
    - [Caching + Throttling](#caching--throttling)
    - [Logging/Monitoring/Alarming](#loggingmonitoringalarming)
    - [Routing + API Transformation](#routing--api-transformation)
    - [Websocket transformation](#websocket-transformation)
- [Networking](#networking)
    - [Connections, data refresh and data transfer](#connections-data-refresh-and-data-transfer)
        - [Connection Establishment - Client or Service](#connection-establishment---client-or-service)
        - [Data Refresh - Polling vs Event Driven - Web Sockets](#data-refresh---polling-vs-event-driven---web-sockets)
        - [Data Transfer - REST vs WebSocket](#data-transfer---rest-vs-websocket)
    - [Planes - Control, Data, and Management](#planes---control-data-and-management)
    - [Latency is real](#latency-is-real)
    - [Communication buses: Envoy](#communication-buses-envoy)
- [New patterns](#new-patterns)
    - [Side cars](#side-cars)
    - [Resilience Patterns - Retry, Circuit-Breaker, Timeout, Fallback, Bulkhead, Cache.](#resilience-patterns---retry-circuit-breaker-timeout-fallback-bulkhead-cache)
- [Functions as a Service FaaS](#functions-as-a-service-faas)
    - [Introduction](#introduction)
    - [FaaS Orchestration](#faas-orchestration)
    - [Triggers](#triggers)
    - [Security](#security)
    - [Logging](#logging)
    - [Debugging](#debugging)
- [Data Systems](#data-systems)
- [Challenges](#challenges)
    - [Conway's law - Four compiler teams implies a four pass compiler](#conways-law---four-compiler-teams-implies-a-four-pass-compiler)
- [Other Resources](#other-resources)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Micro services

## Containers

### Containers are about application packaging and delivery.

We often talk about containers being a light weight VM, which they are. However, I think the real value of the container (which is why docker is synonymous with container), is a software packaging and delivery mechanism.The sole reason Docker containers got more attention than its competition is because of this software delivery approach.

#### The power of the Dockerfile and image repository.

### Containers as execution hosts - vs Virtual and Physical Machines

(Yes there is other container tech, for example [here](https://www.katacoda.com/courses/containers-without-docker))

### Container Orchestration

#### Kubernetes

#### Everything else

- Docker Swarm
- Service Bus
- Methods

## Front Door - AWS API Gateway

[The AWS SaaS for front door is API Gateway,](https://aws.amazon.com/blogs/aws/amazon-api-gateway-build-and-run-scalable-application-backends/) and it provides several capabilities.

- Scalable & Efficient – Serverless auto scale pay for usage.
- Self-Service & Highly Usable – Allow you to define, revise, deploy, and monitor APIs including SDK generation for iOS and Android.
- Reliable – Custom error handling and error responses.
- Secure – AWS and IAM AuthN/AuthZ.
- Performant – Globally accessible (via CloudFront) low latency access, with data transfer to the backend over the AWS network.
- Cost-Effective – pay-as-you-go pricing.

### Caching + Throttling

Can apply simple caching, and throttling to protect legacy TPS systems.

### Logging/Monitoring/Alarming

Can log everything to cloud watch to enable api access debugging and auto-scale alarms

### Routing + API Transformation

Define a client callable REST api and map it to arbitrary backend services including parameter and representation re-mapping. Can use this implement stages and version upgrades.

### Websocket transformation

Can translate websocket calls to backend calls (REST, Lambda, or any other API transformation). Today it's limited to routing 'connect', 'disconnect', 'push', 'get, but as we do protocols over WebSockets like [WAMP](https://wamp-proto.org/index.html) API gateway could do a stronger mismatch.

## Networking

Now adays the majority of networking is done over HTTP. Here are the aspects of it.

### Connections, data refresh and data transfer

Client to server communication has three aspects, connection establishment notifications data transfer.

#### Connection Establishment - Client or Service

99.9% of the time you want clients to initiate connections because clients are often unaccessible due to NATs and Firewalls.

#### Data Refresh - Polling vs Event Driven - Web Sockets

Can be either polling or event driven. Polling has the client requesting data periodically and is the simplest method to implement, however it suffers from latency. The alternative is having the server give data to the client when it is available.

Websockets allow you to simply implement server initiated push notifications to clients. The client establishes a long pole connection, and server writes to it when available, allowing the client to listen.

#### Data Transfer - REST vs WebSocket

This isn’t an apples to apples comparison. But the ideas are usually compared with these concepts.

REST is a frequently used request/response protocol with easy API semantics and many years of supporting gobs (caches, routing, API semantics, debugging tools, etc).

WebSockets are frequently used when push notification or high data volumes are required, essentially raw socket access (sockets were the default network access from user mode and represented a TCP connection before the web ate the world). WebSockets do not define a common interface, so it’s up to the app developer to define these and as a result there are few tools to support this.

I suspect a common pattern will be using WebSockets for a server initiated push notification requesting the client to call for current state.

I also suspect an eco system will emerge around WebSockets providing protocols and tools. For example [WOMP](https://wamp-proto.org/index.html) is a standard for APIs and PubSub over WebSocket.

### Planes - Control, Data, and Management

### Latency is real

Turns out speed of light matters, and cities are really far apart. Seattle has awesome networking, but even still [Seattle to India still takes 260ms](https://wondernetwork.com/pings/), that's a lot of latency.

### Communication buses: Envoy

[Envoy](https://www.envoyproxy.io/docs/envoy/latest/intro/what_is_envoy) makes communication application transparent. From their intro:

Envoy is an L7 proxy and communication bus designed for large modern service oriented architectures. The project was born out of the belief that the network should be transparent to applications. When network and application problems do occur it should be easy to determine the source of the problem.
Achieving the previously stated goal is incredibly difficult. Envoy attempts to do so by providing the following high level features:

**Communication Bus**

![Communction Mesh](https://www.envoyproxy.io/docs/envoy/latest/_images/service_to_service.svg)

Out of process architecture: Envoy is a self contained process that is designed to run alongside every application server. All of the Envoys form a transparent communication mesh in which each application sends and receives messages to and from localhost and is unaware of the network topology. The out of process architecture has two substantial benefits over the traditional library approach to service to service communication. 1) Language independence - everyone talks to localhost 2) Auto upgrade - since proxy service is injected into the containers.

**L7 Proxy**
![L7 Proxy](https://www.envoyproxy.io/docs/envoy/latest/_images/front_proxy.svg)
Similar to Nginx or HA Proxy, or AWS ELB, terminate the https and redirect to the apps.

## New patterns

### Side cars

Package functionality into a separately injected application: https://docs.microsoft.com/en-us/azure/architecture/patterns/sidecar

### Resilience Patterns - Retry, Circuit-Breaker, Timeout, Fallback, Bulkhead, Cache.

Distributed services fail, and resilience patterns like mentioned above are critical. See [Polly](https://github.com/App-vNext/Polly) as an example library implementing these concepts.

[Azure cloud patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/) also has many good patterns.

## Functions as a Service FaaS

### Introduction

### FaaS Orchestration

### Triggers

### Security

### Logging

### Debugging

## Data Systems

Huge topic, see [Data Systems](data-systems).

## Challenges

### Conway's law - Four compiler teams implies a four pass compiler

Conway's law is an aphorism in IT that posits the idea that “organizations which design systems are constrained to produce designs which are copies of the communication structures of these organizations.” This idea can be traced back to a programmer named Melvin Conway who developed this principle in the late 1960s.

## Other Resources

- [Container usage study](https://www.datadoghq.com/container-orchestration/)
- [Azure cloud patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/)
- [Building Microservices: Designing Fine-Grained Systems](https://www.amazon.com/Building-Microservices-Designing-Fine-Grained-Systems/dp/1491950358)
- [Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems](https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321/ref=pd_lpo_sbs_14_t_0?_encoding=UTF8&psc=1&refRID=AZ1QGMVFB2K45MWY14X0)
- [Awesome Scalability](https://github.com/binhnguyennus/awesome-scalability)
