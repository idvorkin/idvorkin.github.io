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
    - [The Amazing book this is based on](#the-amazing-book-this-is-based-on)
    - [Netflix Prize](#netflix-prize)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Intro to Recommmendation Systems

### Concepts

- Recommendation != Prediction. Prediction = What a user would rate content; A recommendation is what content is relevant for a user.

### Understand Netflix (collect user behavior and present recommendations)

### How to monitor a system

### How to calculate ratings

- Implict vs Explicit Rating - Users lie, implicit is better (see flossing example)
- The bannana problem - knowing someone buys a bananna doesn't tell you much (See TF-IFD)

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

### The Amazing book this is based on

{%include amazon.html asin="B09782BTD3" %}

### Netflix Prize

Netflix put out a 1M bounty for users that could build the best recommender ssytem. Ultimetly not used in production because not fast enough inferencing, but pretty cool, and a great place to start playing around:

- Just the [data set](https://www.kaggle.com/datasets/netflix-inc/netflix-prize-data)
- Someone's [detailed analysis](https://github.com/storieswithsiva/Movie-Recommendation-Netflix) looks worthy of study.
