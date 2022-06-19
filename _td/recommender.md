---
layout: post
title: Recommender Systems
permalink: /recommend
redirect_from:
  - /recommender
---

My explorations of recommender systems, heavly based on the superb book Practical Recommender Systems

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Intro to Recommmendation Systems](#intro-to-recommmendation-systems)
    - [Concepts](#concepts)
    - [Understand Netflix (collect user behavior and present recommendations)](#understand-netflix-collect-user-behavior-and-present-recommendations)
    - [How to monitor a system](#how-to-monitor-a-system)
    - [How to calculate ratings](#how-to-calculate-ratings)
    - [Non Personalized Recommendations](#non-personalized-recommendations)
    - [Solving Cold Start](#solving-cold-start)
    - [Similary between content and users](#similary-between-content-and-users)
    - [Collaborative Filtering](#collaborative-filtering)
    - [Testing a recommender](#testing-a-recommender)
    - [Content Based Recommenders](#content-based-recommenders)
    - [Hidden Gems: Matrix Factorization](#hidden-gems-matrix-factorization)
    - [Hybrid Recommenders](#hybrid-recommenders)
    - [From recommending to ranking](#from-recommending-to-ranking)
    - [Future of Recommendors](#future-of-recommendors)
- [Datasets](#datasets)
    - [Real Movie Datasets](#real-movie-datasets)
- [Other Stuff](#other-stuff)
    - [Practical Recommender Systems - The book this is based on](#practical-recommender-systems---the-book-this-is-based-on)
    - [Netflix Prize](#netflix-prize)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Intro to Recommmendation Systems

### Concepts

- Recommendation != Prediction. Prediction = What a user would rate content; A recommendation is what content is relevant for a user.

### Understand Netflix (collect user behavior and present recommendations)

- Connect a snitch to a website by attaching a call to all events happing on a site. Good evidence provides information to the system about a user’s taste.
- It’s good to record all events because they might turn out to be useful later.
- Implicit ratings are deduced from the events triggered by the user, while explicit ratings are the actual ratings a user inserts.

### How to monitor a system

- Key performance indicators are good because they can be benchmarked and easily used to see whether your site is improving.
- A visitor is converted when they perform a goal or do something that you’re hoping for. The conversion funnel shows a series of steps you want the user to take.
- The conversion path is the actual path visitors take before converting. Understanding your site’s conversion funnel is important so you can understand how close users are to converting.
- Analytics is important to understand and always have running.

### How to calculate ratings

- Implict vs Explicit Rating - Users lie, implicit is better (see flossing example)
- The bannana problem - knowing someone buys a bananna doesn't tell you much (See TF-IFD)

- A user-item matrix is the data format for recommender algorithms. You can populate them by using explicit as well as implicit ratings or by indicating which items were consumed by the user in a binary matrix.
- A rating is the glue that connects a user to an item. It can either be manually entered by the user or calculated based on the behavior of the user.
- The time decay algorithm takes into account that not all information is equally important: old evidence is less important because people tend to change their tastes.
- Inverse frequency factors into the equation because interactions with less popular items provide more information about the user than interactions with popular items.

### Non Personalized Recommendations

### Solving Cold Start

### Similary between content and users

### Collaborative Filtering

### Testing a recommender

### Content Based Recommenders

### Hidden Gems: Matrix Factorization

### Hybrid Recommenders

### From recommending to ranking

### Future of Recommendors

## Datasets

### Real Movie Datasets

- [TMDB](https://developers.themoviedb.org/3) Kind of like a semi open-source IMDB API.
- [MovieTweeting](https://github.com/sidooms/MovieTweetings) Ratings based on tweets
- [MovieLens](https://grouplens.org/datasets/movielens/) - Like Movie Tweeting

## Other Stuff

### Practical Recommender Systems - The book this is based on

{%include amazon.html asin="B09782BTD3" %}

### Netflix Prize

Netflix put out a 1M bounty for users that could build the best recommender ssytem. Ultimetly not used in production because not fast enough inferencing, but pretty cool, and a great place to start playing around:

- Just the [data set](https://www.kaggle.com/datasets/netflix-inc/netflix-prize-data)
- Someone's [detailed analysis](https://github.com/storieswithsiva/Movie-Recommendation-Netflix) looks worthy of study.
