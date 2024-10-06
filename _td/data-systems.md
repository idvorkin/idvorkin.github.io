---
layout: post
no-render-title: true
title: Data Systems
---

This page contains my knowledge of data systems. Mostly just a summary of [Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems](https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321/ref=pd_lpo_sbs_14_t_0?_encoding=UTF8&psc=1&refRID=AZ1QGMVFB2K45MWY14X0)

_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/data-systems.md)_

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Success criteria For this post](#success-criteria-for-this-post)
- [Comparisons](#comparisons)
    - [Dataflows Service vs Database vs Message Broker](#dataflows-service-vs-database-vs-message-broker)
    - [OLTP vs Analytics](#oltp-vs-analytics)
    - [Authoritative vs Derived Data](#authoritative-vs-derived-data)
    - [Stream vs Batch Processing](#stream-vs-batch-processing)
    - [Facts Measures and Dimensions.](#facts-measures-and-dimensions)
    - [Data lakes and Data warehouse](#data-lakes-and-data-warehouse)
- [Databases](#databases)
    - [Distributed File System - S3](#distributed-file-system---s3)
    - [RelationalDB - AWS Aurora and Aurora Serverless](#relationaldb---aws-aurora-and-aurora-serverless)
    - [Key Value Store - Dynamo DB](#key-value-store---dynamo-db)
    - [Document - AWS DocumentDB](#document---aws-documentdb)
    - [Column Store - AWS Redshift](#column-store---aws-redshift)
    - [Graph - AWS Neptune](#graph---aws-neptune)
- [Message Brokers](#message-brokers)
    - [What happens when messages are not consumed in time?](#what-happens-when-messages-are-not-consumed-in-time)
    - [What happens when a message is missed](#what-happens-when-a-message-is-missed)
    - [Event BroadCasting- PubSub- SNS](#event-broadcasting--pubsub--sns)
    - [Durable Message Queues - SQS](#durable-message-queues---sqs)
    - [Kinesis - Data Streams](#kinesis---data-streams)
    - [Kinesis - Data Analytics](#kinesis---data-analytics)
    - [Kinesis - Firehouse](#kinesis---firehouse)
    - [Kinesis - Video Streams](#kinesis---video-streams)
    - [Event Bridge - Event Bus](#event-bridge---event-bus)
- [Big Ideas](#big-ideas)
    - [Write path vs read path](#write-path-vs-read-path)
    - [Write path derived data system flows](#write-path-derived-data-system-flows)
    - [Event sourcing and event logs](#event-sourcing-and-event-logs)
    - [E2E asyncronous verification with apology workflow](#e2e-asyncronous-verification-with-apology-workflow)
- [Related Reading](#related-reading)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Success criteria For this post

## Comparisons

### Dataflows Service vs Database vs Message Broker

A service is often a tightly defined interface over a database. Hiding implementation database details from the client.

A message broker is arguably an asynchronous uni-directional service. Hiding service addressability, availability and scalability.

### OLTP vs Analytics

OLTP often operates in real time on many columns in a single row. Analytics are usually operating on every row for a single column. Analytics systems are often called cubes and data warehouses.

### Authoritative vs Derived Data

Source of truth, vs caches, materialized views, denormalized data etc.

### Stream vs Batch Processing

Batch jobs take a time window of data and process it at once. Think Full File In -> Full File Out. Stream processing is a batch job where the 'window' is as small as possible. Think For each new line in file -> create a new file out.

### Facts Measures and Dimensions.

When we do analytics we have want to apply measures (list computation) over facts, often sliced by dimensions. Imagine we have data

    |  ID | HoursSleep | Age|  City |

In this case the fact would be HoursSleep. Measure can be median, min, or max. Dimensions are slicers or filters.

Analytics systems like column store are optimized for this type of analysis (later). Traditional row stores can simulate column stores using star

### Data lakes and Data warehouse

The difference is schema on write vs scheme on read. In a warehouse, you figure out your schema upfront, which is expensive, and can result in data loss. In a lake, you store all your data with the assumption you'll need it eventually and you'll figure out how to use it after its been generated. Given the speed of new technology, I'd highly recommend a data lake.

A data warehouse is a database optimized to analyze relational data coming from transactional systems and line of business applications. The data structure, and schema are defined in advance to optimize for fast SQL queries, where the results are typically used for operational reporting and analysis. Data is cleaned, enriched, and transformed so it can act as the “single source of truth” that users can trust.

A data lake is different, because it stores relational data from line of business applications, and non-relational data from mobile apps, IoT devices, and social media. The structure of the data or schema is not defined when data is captured. This means you can store all of your data without careful design or the need to know what questions you might need answers for in the future. Different types of analytics on your data like SQL queries, big data analytics, full text search, real-time analytics, and machine learning can be used to uncover insights.

## Databases

### Distributed File System - S3

Store files in the cloud, auto scaling.

### RelationalDB - AWS Aurora and Aurora Serverless

Postgres and MYSQL compatible, reserved or serverless DB application.

### Key Value Store - Dynamo DB

Look up a json blob by key.

### Document - AWS DocumentDB

Key-Value store with better indexing on json properties?

### Column Store - AWS Redshift

High performance analytics since can scan column at once.

### Graph - AWS Neptune

## Message Brokers

### What happens when messages are not consumed in time?

Buffer, Data Loss, Throttle

### What happens when a message is missed

### Event BroadCasting- PubSub- SNS

This is similar to broadcasting a message. Multiple publishers can write to a topic, and multiple subscribers can are notified of the message. If someone isn't subscribed at notification time, they will not hear the message. This is useful for scenarios where you want to expose an event occurred, but aren't interested in how they process it. E.g. "There's a new video uploaded by user". If you need to take an action on this event, you'll need to connect SNS to SQS.

### Durable Message Queues - SQS

This is similar to an asynchronous API call. Multiple publishers can write to a topic, and a single consumer is guaranteed to process the message. Useful scenarios are "tell a worker to encode a video". If no one listens to the "messages" they will queue incurring high costs.

### Kinesis - Data Streams

Base layer for Kinesis. A log based message broker with 100ms ish latency. Can use this with Fire Hose, Data Analaytics or your own Lambda. Data streams don't yet have elastic scaling and are somewhat expensive.

### Kinesis - Data Analytics

Run streaming SQL over your Kinesis data stream. Often part of a data flow whose output will be a Kinesis data stream.

### Kinesis - Firehouse

Automatically store (and transform) realtime event streams to durable storage (S3, Redshift, ES, Splunk,etc)

### Kinesis - Video Streams

Auto-upload video while it's being created. Supports video things like compression and live streaming.

### Event Bridge - Event Bus

Global integration for common providers (like web hooks) to get remapped to events. Also supports filter and transform to handle impedance mismatches. This 'solves' the web-hook 'call-home' problem.

## Big Ideas

### Write path vs read path

### Write path derived data system flows

### Event sourcing and event logs

### E2E asyncronous verification with apology workflow

## Related Reading

- [Azure cloud patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/)
- [Building Microservices: Designing Fine-Grained Systems](https://www.amazon.com/Building-Microservices-Designing-Fine-Grained-Systems/dp/1491950358)
