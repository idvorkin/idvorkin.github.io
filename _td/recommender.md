---
layout: post
title: Recommender Systems
permalink: /recommend
redirect_from:
  - /recommender
  - /ranking
---

My explorations of recommender and ranking systems, heavly based on the superb book Practical Recommender Systems

<!-- prettier-ignore-start -->

<!-- vim-markdown-toc-start -->

- [Intro to Recommmendation Systems](#intro-to-recommmendation-systems)
    - [Concepts](#concepts)
    - [Recommender processes](#recommender-processes)
    - [What makes ML hard](#what-makes-ml-hard)
    - [Understand Netflix (collect user behavior and present recommendations)](#understand-netflix-collect-user-behavior-and-present-recommendations)
    - [How to monitor a system](#how-to-monitor-a-system)
    - [How to calculate ratings](#how-to-calculate-ratings)
    - [Non Personalized Recommendations](#non-personalized-recommendations)
        - [Top 10 lists](#top-10-lists)
        - [Spot Lights](#spot-lights)
        - [Seeded Recommendations, seed to find clusters, Frequently Bouht Together (FBT)](#seeded-recommendations-seed-to-find-clusters-frequently-bouht-together-fbt)
        - [Implementation notes](#implementation-notes)
        - [Commercial vs a recommendation](#commercial-vs-a-recommendation)
    - [Solving Cold Start For Users](#solving-cold-start-for-users)
        - [How to find new stuff](#how-to-find-new-stuff)
        - [Business Rules](#business-rules)
        - [How to engage biz rules](#how-to-engage-biz-rules)
        - [Semi-personalized by geo/segment/demographic](#semi-personalized-by-geosegmentdemographic)
    - [Similarly between content and users](#similarly-between-content-and-users)
    - [How to represent content/users](#how-to-represent-contentusers)
        - [How to measure similarity](#how-to-measure-similarity)
    - [Collaborative Filtering](#collaborative-filtering)
    - [Testing a recommender](#testing-a-recommender)
        - [Happy customers](#happy-customers)
        - [Matthew effect, diversity, filter bubbles](#matthew-effect-diversity-filter-bubbles)
        - [Coverage](#coverage)
        - [Serendipity](#serendipity)
    - [Content Based Recommenders - More Like This](#content-based-recommenders---more-like-this)
        - [LDA](#lda)
    - [Hidden Gems: Matrix Factorization](#hidden-gems-matrix-factorization)
    - [Hybrid Recommenders](#hybrid-recommenders)
    - [From recommending to ranking](#from-recommending-to-ranking)
    - [Future of Recommends](#future-of-recommends)
- [Datasets](#datasets)
    - [Real Movie Datasets](#real-movie-datasets)
- [Ideas](#ideas)
    - [The progression of recommender systems](#the-progression-of-recommender-systems)
- [Code](#code)
- [Other Stuff](#other-stuff)
    - [Source Materials, The book and google course:](#source-materials-the-book-and-google-course)
    - [Netflix Prize](#netflix-prize)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Intro to Recommmendation Systems

### Concepts

- Recommendation != Prediction. Prediction = What a user would rate content; A recommendation is what content is relevant for a user.
- Items - The things being recommended
- Query - Information system uses to make a recommendation (user, items user previously used, time of day, user device, etc)

### Recommender processes

Candidate Generation - huge corpus, can't search all on-line. Offline generate candidates, down to order of hundreds
Scoring - Next round goes from 100s to 10s. Can be more precise, and take into consideration more things.
Re-ranking - Final online ranking, remove dislikes, fairness, etc. Since online needs to be super fast.

### What makes ML hard

- Need to convert a domain into math (floats, and functions operating on floats). Each of these conversions is lossy with subteties that have unexpected impact.
- Data drifts over time for reasons that are unclear to your system
- Search post for #ml_art

### Understand Netflix (collect user behavior and present recommendations)

- Connect a snitch to a website by attaching a call to all events happening on a site. Good evidence provides information to the system about a user's taste.
- It’s good to record all events because they might turn out to be useful later.
- Implicit ratings are deduced from the events triggered by the user, while explicit ratings are the actual ratings a user inserts.

### How to monitor a system

- Key performance indicators are good because they can be benchmarked and easily used to see whether your site is improving.
- A visitor is converted when they perform a goal or do something that you’re hoping for. The conversion funnel shows a series of steps you want the user to take.
- The conversion path is the actual path visitors take before converting. Understanding your site’s conversion funnel is important so you can understand how close users are to converting.
- Analytics is important to understand and always have running.

### How to calculate ratings

- Implicit vs Explicit Rating - Users lie, implicit is better (see flossing example)
- The bannana problem - knowing someone buys a bananna doesn't tell you much (See TF-IFD)

- A user-item matrix is the data format for recommender algorithms. You can populate them by using explicit as well as implicit ratings or by indicating which items were consumed by the user in a binary matrix.
- A rating is the glue that connects a user to an item. It can either be manually entered by the user or calculated based on the behavior of the user.
- The time decay algorithm takes into account that not all information is equally important: old evidence is less important because people tend to change their tastes.
- Inverse frequency factors into the equation because interactions with less popular items provide more information about the user than interactions with popular items.

### Non Personalized Recommendations

- What else can you do before we have logged in users

-

#### Top 10 lists

- Most Bought
- Cheapest
- New Arrivals
- All we had with mass media (Radio/TV/Newspaper)

#### Spot Lights

- Manual Curatoin
- Categories with Manual Curation

#### Seeded Recommendations, seed to find clusters, Frequently Bouht Together (FBT)

- Top 10 list, but with a seed, aka a keyword.
- Is that search? Not quite, can be clusters/associations
- Can build clusters on stuff bought together. If you buy shoes, you probably want socks
- Cross Selling See what we have

**Item Set** Bought together, but not with everything else.

**Confidence** Number of times have that subset/(number of times first item present)

**Support** s

TODO: Work through this example.

T(X) = set of transactions containing X
C(Bread given milk) = T(bread and milk)/T(bread)

QQ: Is this like TF/TFID

#### Implementation notes

- Can make recommendations more resonsive by doing offline
- Keep multiple sets of versioned recommendations. Helpful for testing and rolling back

#### Commercial vs a recommendation

- Commercial - something we want to sell you vs the right thing for you
- Deal of the day is a commercial
- Coupons are commercials, and trade CAC for LTCV or ARPU

### Solving Cold Start For Users

What is cold start

#### How to find new stuff

- Add a new stuff section - users like that.
- Boost and then let decay

Keeping track of visitors

Using Algos for cold start

Those who won't ask, won't know

Association rules to start recommending fast

- Cold start = What to recommend to the new users
- Conscious ordering
- Grey sheep = Users who don't cluster with others, could help them with genres

#### Business Rules

If someone watches Toy Story and Texas Chain saw, don't recommend Texacs Chainsaw during Childrens rules. Need biz rules

- When watching family movies, only recommend family
- Never recommend a horror movie when watching family movies

#### How to engage biz rules

- Build short list (Search)
- Filter out w/Biz Rules
- Presonalize what's left with fast recommender

#### Semi-personalized by geo/segment/demographic

Country (can use IP), can use to

- Association rules is a fast way to bootstrap
- Segments built or generated to make semi-personalized recommendations
- Can make demographic recommendations

Age, Star Wars

Great for folks who saw them as kids (now 40) and their kids who have watched them. In the middle group, they are boring.

### Similarly between content and users

### How to represent content/users

We need to represent them into a vector, vectors can be explicit, like for a user age/gender, or they can be latent, latent means the computer came upw tih the model and users don't know what it means.

#### How to measure similarity

Given two things (people or items), how similar or different are they, 1 is the same, and 0 is not at all.

There are multiple ways to measure, and depends on the representation of the thing, and the domain (#ml_art)

- Euclidean Distance - just like you remember from lines in algebra sqrt(Sum(yi-xi)^2)
- Dot product -
- Cosine Similarity - The angle between the djfh distance, without the magnitude/intensity.

### Collaborative Filtering

### Testing a recommender

- Paper verification
  - Work through a small example on paper
  - If doesn't work small, might not work big.
  - Might see don't have required data
  - Verify with stake holders what they want.
  - Verify you have required data (pivacy, retention, etc)
  - Can you join aggregate the data into required shape
- Regression Testing
  - But it's hard.
  - Too bad, bugs are harder.
  - Both UT and regression testing
  - Test every part you can
  - Similarly methods, anything you can
  - Use small dataset to verify everything you can
- Test Scenarios
  - Offline
  - Controlled user
  - Online
- Offline Evaluation
  - Assume data set is accurate
  - Train on the training data
  - Verify with the test data if it recommended success
  - Verification based on the inferior algorithm
- Measuring error metrics
  - Hidden data vs new algo recommendations
  - Error = User Rating - Prediction
  - Error Sums
    - Mean Absolute Error
    - Root Mean Squared Error
    - Not these correct for +/- cancelling each other out
    - RMSE - Sensitive to really bad errors
    - MAE - Not sensitive. Decent when a terrible rating is OK.
    - Be careful if you have user with lots of recommendation and popular items that will overweight in the results
- Decision Support - Precision and Recall

  - True Positive - Recommended and consumed
  - False Positive - Recommended and not consumed
  - False Negative - Didn't include the recommendation, but user consumed
  - True Negative - Wasn't recommended, and user didn't select

- Precision - What % of recommend items did users consume
- Recall - What % of items users concsumed were recommended.
- Precision is more important for ranking
- But since using TopN, need to have precision at K.
- Ranking Metrics:
  - Need to turn the results into a number, the formula for that has consequences, you need to understand as has different impacts.f
  - Wrong farther down the list is less important, ignore tat
  - Mean active Precision (MAP)
- Data splitting

  - User w/o enough data - probably need to remove from set
  - Too much data - sampling
  - Stratified sampling - sample more from under represented

- Data Sets
  - Test - only used once on final recommendations
  - Validate Set - Optimize the model. Optimize one param at a time. Then test it.
  - Training Set - Use it to give data to the recommender.
  - How to split data sets
    _ Random
    _ By Time
    _ End up with cold users in the test set.
    _ Can clean them out \*
    Cross validation
  - Split into folds, and combine randomly.
  - Average results from all of them

Benchmarkingi predictions - How often do you watch something? - Consider starting with popular items as the baseline predictor to get a benchmark

- Friends and Family
- A/B test
- Explore and Exploit

#### Happy customers

- The site understands my tastes
- The site gives me a nice variety of recommendations
- The site surprises me
- (Catalog owner) Users see lots of the catalog

#### Matthew effect, diversity, filter bubbles

- Rich get richer, poor get poorer
- True for popularity. Once popular more hits, when less less shown.
- This results in a filter bubble where you only see the same stuff again and again.
- If recommender only shows top 10, it doesn't help you see the whole catalog.

#### Coverage

- Content coverage - what percent of your catalog gets recommended
- User coverage - what percent of users get personalized recommendations

#### Serendipity

- People like surprise don't make your recommender too tight, or they'll always get the same thing.

### Content Based Recommenders - More Like This

Use a category, not just the collaborative filtering

#### LDA

- Latent - topics aren't known before hand
- Dirichlet - How documents described using topics
- Allocation - Words map to topics
- QQ: Are topics just clusters which are words?

### Hidden Gems: Matrix Factorization

### Hybrid Recommenders

### From recommending to ranking

- Give a list of stuff users like, don't need a score, just give a top N order.

### Future of Recommends

## Datasets

### Real Movie Datasets

- [TMDB](https://developers.themoviedb.org/3) Kind of like a semi open-source IMDB API.
- [MovieTweeting](https://github.com/sidooms/MovieTweetings) Ratings based on tweets
- [MovieLens](https://grouplens.org/datasets/movielens/) - Like Movie Tweeting

## Ideas

### The progression of recommender systems

1. Spotlight - manual curation
2. Top 10 lists
   - Can build by using viewership data
3. Non-personalized by demographic
   - People in this demographic like XYZ
4. Non-personlized by item
   - People who buy item X by item Y
5. Non personalized by item when items sparse
   - Use a higher order attribute, so use the artist that creates instead of the item itself.
6. Personlized via Clustering

7. ## Similarity in items and users

## Code

This stuff is kind of complicated, so I'm working through the code in the book. Follow along at <https://github.com/idvorkin/moviegeek>

If you're running the docker setup locally, you can run the webpage at ...

<http://localhost:8010>

## Other Stuff

### Source Materials, The book and google course

{%include amazon.html asin="B09782BTD3" %}

<https://developers.google.com/machine-learning/recommendation/>

Notebook from google - <https://colab.research.google.com/github/google/eng-edu/blob/main/ml/recommendation-systems/recommendation-systems.ipynb?utm_source=ss-recommendation-systems&utm_campaign=colab-external&utm_medium=referral&utm_content=recommendation-systems#scrollTo=O3bcgduFo4s6>

### Netflix Prize

Netflix put out a 1M bounty for users that could build the best recommender ssytem. Ultimetly not used in production because not fast enough inferencing, but pretty cool, and a great place to start playing around:

- Just the [data set](https://www.kaggle.com/datasets/netflix-inc/netflix-prize-data)
- Someone's [detailed analysis](https://github.com/storieswithsiva/Movie-Recommendation-Netflix) looks worthy of study.
