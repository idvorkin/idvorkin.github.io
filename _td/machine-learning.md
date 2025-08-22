---
layout: post
no-render-title: true
title: Machine learning for regular programmers.
permalink: /ml
redirect_from:
  - /machine-learning
  - /machinelearning
  - /td/machine-learning
---

It used to be that software was eating the world. Now ML is eating software. ML is computers building algorithms by only looking at the data. This is powerful as the computer can find patterns in large data sets that are too complicated for humans to find and express via algorithms. In human terms programming is following a check list which someone else provided (E.g. bake a cake by following the recipe). ML is following your intuition. (E.g making a stir fry from stuff in the fridge). As with ML, you can't articulate your intuition as it built through countless experiences, but it mostly works (E.g. you never put a banana in your stirfry).

_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/machine-learning.md)_

**Success criteria For this post**

- I know the problems ML can solve, and the ML vocabulary.
- I have a good enough understanding of ML to tell if someone is full of shit.
- I can explain ML to a non-ML programmer, a PM or an executive.
- I can make some PoC projects to test my understanding.
- I can keep track of the ML concepts I've learned and cross check them with a PhD wielding ML guru.

I highly recommend: [Machine learning is like sex in high school](https://vas3k.com/blog/machine_learning/)

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Hierarchy of Abstraction in the ML space](#hierarchy-of-abstraction-in-the-ml-space)
    - [Disambiguating the word Model](#disambiguating-the-word-model)
    - [Using an ML Model](#using-an-ml-model)
    - [Building an ML model by training an ML algorithm](#building-an-ml-model-by-training-an-ml-algorithm)
    - [Implementing ML Algorithm](#implementing-ml-algorithm)
    - [Converting an ML model to hardware](#converting-an-ml-model-to-hardware)
- [What category of problems can ML algorithms solve](#what-category-of-problems-can-ml-algorithms-solve)
    - [Understanding Words - Natural Language Processing](#understanding-words---natural-language-processing)
    - [Understanding Images - Computer Vision](#understanding-images---computer-vision)
    - [What should I X - Recommenders and Ranking](#what-should-i-x---recommenders-and-ranking)
    - [What type is this - Classification](#what-type-is-this---classification)
    - [Predict a Value - Regression](#predict-a-value---regression)
    - [Make logical groups - Clustering](#make-logical-groups---clustering)
    - [Dimension Reduction](#dimension-reduction)
- [Other ML Concepts](#other-ml-concepts)
    - [Supervised vs Unsupervised vs Semi Supervised](#supervised-vs-unsupervised-vs-semi-supervised)
    - [Batch vs Online](#batch-vs-online)
    - [Instance vs Model](#instance-vs-model)
- [How to measure the effectiveness of ML by problem category](#how-to-measure-the-effectiveness-of-ml-by-problem-category)
    - [AI Testing](#ai-testing)
    - [Regression - Distance from prediction to actual](#regression---distance-from-predication-to-actual)
    - [Classification - Precision and Recall](#classification---precision-and-recall)
    - [Clustering - it's complicated](#clustering---its-complicated)
    - [PCA - it's complicated](#pca---its-complicated)
- [Why is ML hard?](#why-is-ml-hard)
- [About ML errors](#about-ml-errors)
    - [The ML learning challenges](#the-ml-learning-challenges)
    - [Model and feature interpretability](#model-and-feature-interpretability)
    - [ML Image Recognition Optical Illusions](#ml-image-recognition-optical-illusions)
    - [Google Photos recognizing black people as gorillas](#google-photos-recognizing-black-people-as-gorillas)
    - [HP face tracking doesn't recognize black people](#hp-face-tracking-doesnt-recognize-black-people)
    - [Clever Hans - the horse that could count](#clever-hans---the-horse-that-could-count)
    - [Likelihood of death from Pneumonia given asthma](#likely-hood-of-death-from-pneumonia-given-asthma)
- [Computing Power, Hardware](#computing-power-hardware)
    - [Why can't a big computer do all the tuning](#why-cant-a-big-computer-do-all-the-tuning)
    - [Why GPU vs CPU](#why-gpu-vs-cpu)
    - [What is a tensor](#what-is-a-tensor)
    - [What do on device ML cores do](#what-do-on-device-ml-cores-do)
    - [Model building vs Model Execution](#model-building-vs-model-execution)
    - [Computation power required for cat pictures](#computation-power-required-for-cat-pictures)
- [The steps in running an ML model at scale](#the-steps-in-running-an-ml-model-at-scale)
- [The steps in training an ML model](#the-steps-in-training-an-ml-model)
    - [Requirements gathering and problem definition](#requirements-gathering-and-problem-definition)
    - [Exploratory Data analysis](#exploratory-data-analysis)
    - [Data preparation](#data-preparation)
    - [Model Family Selection](#model-family-selection)
    - [Feature Section](#feature-section)
    - [Training](#training)
    - [Evaluation and tuning of model family features and hyperparameters](#evaluation-and-tuning-of-model-family-features-and-hyper-parameters)
    - [Validation](#validation)
    - [Present Results, Use it](#present-results-use-it)
- [ML Algorithms](#ml-algorithms)
    - [Regression](#regression)
    - [PCA](#pca)
    - [SVM](#svm)
    - [Language models and GPT 3](#language-models-and-gpt-3)
- [Topics to be explored](#topics-to-be-explored)
    - [DevOps for ML](#devops-for-ml)
    - [Measuring within the wider business context](#measuring-within-the-wider-business-context)
    - [Guard rails for inputs versus training data](#guard-rails-for-inputs-versus-training-data)
- [AI Domains](#ai-domains)
    - [Recommender Systems](#recommender-systems)
    - [Computer Vision](#computer-vision)
    - [Natural Language Processing (NLP)](#natural-language-processing-nlp)
- [AI Misbehaving](#ai-misbehaving)
    - [AI Ethics](#ai-ethics)
- [Misc Topics](#misc-topics)
    - [What is ML vs AI](#what-is-ml-vs-ai)
    - [Generalize vs Narrow AI](#generalize-vs-narrow-ai)
    - [Why is ML so complicated](#why-is-ml-so-complicated)
    - [Deep Fakes](#deep-fakes)
    - [Time Series Analysis](#time-series-analysis)
- [Neural Networks](#neural-networks)
    - [CNN: Convolutional Neural Networks](#cnn-convolutional-neural-networks)
    - [RNN: Recurrent Neural Network](#rnn-recurrent-neural-network)
    - [GAN: Generate Associative Networs](#gan-generate-associative-networs)
- [What should I read to learn more](#what-should-i-read-to-learn-more)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Hierarchy of Abstraction in the ML space

Before we get started, the term "model" is very overloaded, lets use these definitions.

### Disambiguating the word Model

The word model is overloaded - Wickhan describes the following terms ( but I haven't yet re-written the article):

- **Model Family** - The class of ML algorithm being used e.g. Linear Regression, Recurrant Neural Network.
- **Model Form** - The model family, the features and the hyper parameters
- **Fitted Model** - Model form fit to data and able to perform estimates.

Programming has levels of abstraction and so does ML. The levels from most general to most specific are below.

### Using an ML Model

This is the same as using a high level API or library, something like IsPlural(word). These APIs can run locally in a library, or remotely in a web service.

Notice that the user of an API doesn't care about the implementation and so doesn't care if ML or programming implements the API.

Web Services, like Microsoft's Cognitive Services and Amazon Translate, expose models for your application to use.

### Building an ML model by training an ML algorithm

This is the same as using data structures and algorithms to build high level libraries. Think of creating a file system from B-Trees.

Because the model is inferred implicitly, we need to provide data to build the model. These models are built by providing training data and hyper parameters (think parameters to data structures like the initial capacity of an auto-growing array)

Models are relatively simple to describe but require data to train.

To train a model on a reasonable sized dataset, use a tool like sci-kit. To train a model on a large data set, model use a cloud provider like Amazon SageMaker or Azure ML Studio.

### Implementing ML Algorithm

This is the same as implementing data structures and algorithms. As an example from programming, a linked list data structure and insert routine.

At this level of abstraction no data is required, as we're building algorithms. Building these algorithms requires knowledge of hard math.

The algorithm is often hard math, and written in languages like TensorFlow and PyTorch.

### Converting an ML model to hardware

This is the same as compiling C or assembly code to machine code. The machine code can execute on different hardware. Unlike conventional programming ML algorithms are slow on CPUs fast on GPUs and fast on specialized hardware like CoreML for iOS and TensorFlow Lite for Android. CPU's are slowest because they are optimized for integer operations on few threads (E.g. high end CPU has 8 threads). GPUs are optimized for parallel floating point optimization (E.g.high end GPU has 560K threads). I'm not sure the performance of CoreML, but it can always be improved with hardware revisions (and I suspect it will be).

## What category of problems can ML algorithms solve

### Understanding Words - Natural Language Processing

My early explorations ...
{%include summarize-page.html src="/nlp" %}

And in 2022 the world was taken by storm by gpt ...

{%include summarize-page.html src="/gpt" %}

### Understanding Images - Computer Vision

See my repository here: <https://github.com/idvorkin/video-edit>

### What should I X - Recommenders and Ranking

{%include summarize-page.html src="/recommend" %}

### What type is this - Classification

Given a sample, classify into a discrete set of known values. Mathematically F(sample):Enum. Find F. Training data must be labeled, into a discrete set of data.

Classification can be binary (spam detection), or categorical (image recognition, sentiment analysis, speech recognition). Many classifier provide a confidence score (I'm 90% sure this is a cat, but 20% sure it's dog).

Algorithms used include decision trees, and Baseyian classifiers.

### Predict a Value - Regression

Given a sample, what is the output value. Mathematically F(sample):Number. Find F.

For example, how much does age impact the probability of having cancer. Given an income, what is the happiness quotient. Linear Regression has been around for a long time (remember newton's method from high school)

### Make logical groups - Clustering

Given a set of unlabeled data, classify it into groups. Mathematically F(List[Data]):List[Set(Data)]. Find F, and List[Set(Data)]

For example, given all Netflix users, these are the group of users which are similar. The categories can then be combined with regression to decide which groups of movies a set of users would enjoy.

Another example is deduce the communities from a social network.

Another example is anomaly detection. Amazingly I have a published [paper](https://www.microsoft.com/en-us/research/publication/perfaugur-robust-diagnostics-for-performance-anomalies-in-cloud-services/) on anomaly detection.

Algorithms used include decision trees, and Baseyian classifiers.

### Dimension Reduction

## Other ML Concepts

### Supervised vs Unsupervised vs Semi Supervised

Supervised leraning means the a trainer provides 'ground truth' via labeled data. Getting labeled data is often the hardest part of ML. Regression is a supervisedalgorithom. Unsupervised learning means no labels are provided and the computer figures out the relationships - clustering is an example of this. Semi-supervised learning uses algortithoms to take a a small amount labeled data to mix with unlabbelled data creating more 'synthetic labeled' data. This is domain specific. As an example, imagine doing speech recognition. Take labeled audio files, and mix them with background noise to generate 'synthetic data'.

### Batch vs Online

In batch learning the model is built once, and ignores incoming data.

In online learning (better called incremental learning) an initial model is deployed but is then re-deployed with an updated model based on the incoming data. The rate at which the model is updated is the Learning Rate, and is an important parameter, if the model is updated quickly, it can break quickly based on a string of un-representative data, if the model is updated slowly there can be a prolonged period of time while the model performance is poor.

### Instance vs Model

## How to measure the effectiveness of ML by problem category

Because programming tends not to be probabilistic, we tend not to measure effectiveness. In programming we often care about performance, and for that we need a standard benchmark. Various benchmarks exist for various measures, E.g. crystal mark for disk, and battery burner for power utilization.
Similarly to measure effectiveness you need to use a standard data set. Also "good values" is a function of the data set and domain. E.g. a precision of 99% is OK on the MINST data set, but 50% fantastic good on a handwriting recognition dataset.

The class of problem being solved determines the effectiveness of ML. To measure effectiveness, you must do so over a dataset.

### AI Testing

{%include summarize-page.html src="/ai-testing" %}

### Regression - Distance from prediction to actual

### Classification - Precision and Recall

- **Precision (Exactness)** - Likely hood a result is a true positive. TP / (TP + FP). % of things you say are true, are actually true.

- **Recall (Completeness)** - Likely a true positive. TP / (TP + FN). % of true things you identify in the entire space

Precision and Recall are in opposition, and you need to decide which of these values you'll optimize for.

Examples from the hiring process:

When recruiting, you're happy to talk to lots of candidates, even if you're not sure they're good. E.g. High recall, low precision.

When hiring, it's essential you don't hire a bozo, and you're willing to not hire someone good, to avoid hiring the bozo. E.g. High precision, low recall.

An example for laymen:

Say, you have 10 balls (6 white and 4 red balls) in a box. I know you are not colorblind but still somebody asked you to pick up the red balls from them. What you did is that you thought 7 balls as red, picked them from the box and put them in a tray. Among these 7 balls, you picked 2 red balls and 5 white balls (but you thought all of them are red).

Your precision in picking red ball is number of correct pick-ups/(number of correct pick-ups + number of wrong pick-ups) which is 2/(2+5) = 2/7 = 28% in this case. Now, look carefully that your denominator can also be like (total pick-ups).

Your recall in picking red ball is number of correct pick-ups/(number of correct pick-ups + number of red balls that you missed) which is 2/(2+2) = 2/4 = 50% in this case.

Now, what do they mean? Precision says how exact you were among your pick-ups. So, as you picked them up as red balls, you were 28% exact. Recall says, how complete you were among your pick-ups. So, as you picked them up as red balls, you were 50% complete in identifying all the red balls.

We learn at this point- Precision describes exactness and Recall describes completeness.

From the same example, we will now take a look how to combine various terminology with these simple examples.

Number of correct pick-ups can be said "true positives" as they were red ball that you picked up and you were asked to pick the red ones. The balls you picked as red but eventually are white can be called "false positives"- you thought they are positive but they are not.

So, if we modify this formula of precision with these terms, it turns into-

Precision = true positives / (true positives + false positives)

Again, the number of red balls you missed are thought as you missed them thinking them as white. So, they can be called "false negatives", which means you thought they are not red balls, but they are.

So, if we modify this formula of recall with this new terminology, it turns into-

Recall = true positives / (true positives + false negatives)

So, from this "re-written" version of recall formula can pop-up one thing: this is the "rate of true positives". In other words, from all the red balls, what percentage of red balls were grabbed. You had 4 red balls but you got 2 and missed 2: means you could took 50% of the red balls!

### Clustering - it's complicated

### PCA - it's complicated

## Why is ML hard?

I've been an engineer for a long time, and always struggled to understand what people are explaining when talking about ML. I've been doing lots of studying lately and here are some of the reasons I think ML is hard:

- Modeling customer needs is hard.
  - What is good in a customers mind?
  - How does it change person to person?
  - How do you know if someone got what they wanted
  - Someones context/state of mind matter.
  - What people want changes over time relative to the rest of the world.
  - How hard is it to self motivate
- Even if you had perfect ML, your domain understanding is wrong (think how hard PMF is)
  - People probably lie?
  - Business needs change
  - People change
  - Who should you keep happy?
  - What's going on - world cup? More people less people
  - Snow storms?
  - Temporal changes
- ML is not perfect
  - Imagine you hired a great employee, but they don't change.
- You need to map IRL concepts to imprecise math functions
  - How should you model the words, pictures to numbers?
  - Each math function has biases, weight outliers?
  - Lots of subtelties
  - Not clear how it performs on many things.
- Hard to verify
  - Models are opaque
  - Lots of hard to verify steps in the pipeline
  - No ground truth.
  - Performance rots
  - Regressions hard to understand.
  - Not enough data
- Not clear what ground truth is
- Best practices changing non-stop
  - Yesterday's state of the art is today's old news.
  - Don't really share the training data. Only share the algos, and tied to the domain.

## About ML errors

### The ML learning challenges

- Insufficient Training Data
- Non-representative training data
- Low quality data
- Incorrect features
- Over fitting the data
- Under fitting the data (choosing the wrong model)

### Model and feature interpretability

Because some algorithms have opaque features and parameters, humans can't verify which features are used, which can result in many difficult to solve errors like the below. Also, when features are opaque, humans can't be trained from the ML.

When models are transparent, like PCA, that's great because human SMEs can validate and use the result for further exploration.

### ML Image Recognition Optical Illusions

Because ML features are not transparent, they can sometimes detect features which are wrong. By manipulating these incorrect features, you can apply an optical illusion. For example, a penguin ML detector has been followed by showing it a picture of static.

You can find great examples here: [Synthesizing the preferred inputs for neurons in neural networks via deep generator networks](https://arxiv.org/pdf/1412.1897v1.pdf)

### Google Photos recognizing black people as gorillas

From: <https://www.theverge.com/2015/7/1/8880363/google-apologizes-photos-app-tags-two-black-people-gorillas>

Google came under fire this week after its new Photos app categorized photos in one of the most racist ways possible. On June 28th, computer programmer Jacky Alcin� found that the feature kept tagging pictures of him and his girlfriend as "gorillas." He tweeted at Google asking what kind of sample images the company had used that would allow such a terrible mistake to happen.

Google attempted to fix the algorithm, but ultimately removed the gorilla label altogether. Zunger noted that the company is working on longer-term fixes that revolve around which labels could be problematic and better recognition of dark-skinned faces.

### HP face tracking doesn't recognize black people

### Clever Hans - the horse that could count

Using opaque features isnt just a problem for ML systems. There was a horse that [could count](https://en.wikipedia.org/wiki/Clever_Hans), but it didn't work by counting, it worked by understanding human emotions. I guess that's one of our first fails of machine learnings.

### Likelihood of death from Pneumonia given asthma

[Intelligible Models for HealthCare: Predicting Pneumonia Risk and Hospital 30-day Readmission](http://people.dbmi.columbia.edu/noemie/papers/15kdd.pdf)

A model trained to predict risk of death for pneumonia patients concluded that
asthma was predictive of lower risk.

This was a true correlation in the data, but it owed to the more aggressive treatment such co-morbid patients received.

Put simply, a researcher taking actions based on this information would be mistaking correlation for causation. And if a hospital used the risk score for triage, they would actually recklessly put the asthma patients at risk, thus invalidating the learned model model.

## Computing Power, Hardware

### Why can't a big computer do all the tuning

### Why GPU vs CPU

CPU's are optimized for integer operations on few threads (E.g. high end CPU has 8 threads). GPUs are optimized for parallel floating point optimization (E.g.high end GPU has 560K threads).

### What is a tensor

Tensor is a name for a multi-dimensional array.

### What do on device ML cores do

### Model building vs Model Execution

### Computation power required for cat pictures

## The steps in running an ML model at scale

From: <https://blog.fennel.ai/p/real-world-recommendation-system>

_Training a collaborative filtering based recommendation system on a toy dataset is a sophomore year project in colleges these days. But where the rubber meets the road is building such a system at scale, deploying in production, and serving live requests within a few hundred milliseconds while the user is waiting for the page to load. To build a system like this, engineers have to make decisions spanning multiple moving layers like:_

## The steps in training an ML model

Traditional programming progresses through requirements, design, implementation, and testing. Likewise there is a set of steps required for ML.

### Requirements gathering and problem definition

### Exploratory Data analysis

Often done in [pandas](/pandas)

### Data preparation

Often pre-processing in SciKit

### Model Family Selection

### Feature Section

### Training

### Evaluation and tuning of model family features and hyperparameters

### Validation

### Present Results, Use it

## ML Algorithms

Algorithms in [plain english](https://hackerbits.com/data/top-10-data-mining-algorithms-in-plain-english/).

### Regression

### PCA

### SVM

### Language models and GPT 3

This is an amazing topic. See [GPT](/gpt)

## Topics to be explored

_Thanks Dan Massey for your recommendation to discuss these topics_

### DevOps for ML

### Measuring within the wider business context

### Guard rails for inputs versus training data

## AI Domains

### Recommender Systems

{%include summarize-page.html src="/ranking" %}

### Computer Vision

See my explorations of [video editing](https://github.com/idvorkin/video-edit) and CV models.

### Natural Language Processing (NLP)

{%include summarize-page.html src="/nlp" %}

- Word masking NLP models [BERT](https://towardsml.com/2019/09/17/bert-explained-a-complete-guide-with-theory-and-tutorial/)

- [Introduction to word embeddings](http://jalammar.github.io/illustrated-word2vec)

- [Great Laymen's intro to embeddings](https://investigate.ai/text-analysis/word-embeddings/)

## AI Misbehaving

We often delegate decisions to AI, but they are as biased as their training data. Examples of what can go wrong at the site AI Misbehaving:

<https://incidentdatabase.ai/>

### AI Ethics

- AI models existing biases in society, example dr's as men. Terrorist as islam
- Society always has biases, what is the 'ground truth'?

## Misc Topics

### What is ML vs AI

AI is the idea that computers can do activities traditionally performed by humans . E.g. diagnose a disease, argue a case like a defense lawyer, drive a car, have a conversation. ML is a method to achieve artificial intelligence, but not the only one. Early medical diagnosis AI was implemented by human programmers using decision trees created by subject matter experts.

### Generalize vs Narrow AI

When most people say AI, they think about an AI that they can interact with like a human. This is complex of AI. Narrow AI, is simpler, and limits the AI to a simpler task - e.g. helping you find a good vacation.

### Why is ML so complicated

Imagine asking someone how HTML works, and they describe to you how an ARM processor works. If someone did that you'd find HTML incredibly complicated.

That's what's happening in ML today. The issue is the field is nascent and tools and abstractions haven't been well formulated and described yet.

### Deep Fakes

[Deep Fakes](https://arstechnica.com/science/2019/12/how-i-created-a-deepfake-of-mark-zuckerberg-and-star-treks-data/) are video (or image) transformation software from one person to another. So using a deep fake network you can turn a video of Igor talking into a video of Jeff Bezos (or some more current famous person) talking.

A good way to think about this is to simplify the problem. Imagine we had a 'compression' and 'decompression' program for an individual person's face E.g compress_igor(image)-> state, decompress_igor(state)->image. Imagine if it compressed to 2 bits (left eye open, right eye open). Even though the state is very small, we can create high quality (though low variance) output. The decompression doesn't need to be given all the face details, just the details of eye-open and eyes closed.

Now, lets use ML to create this algorithm, instead of humans defining the latent space (e.g. compressed-state) the ML model will. And it can do this with unsupervised learning, connecting compress_igor(igor_image_1) -> decompress_igor() -> igor_image_2 , and minimizing differences between igor_image_1 and igor_image_2. At the end of this process, we have a ML generated compression and decompression function for a users face.

So using this we have create compress_igor(image)->small_state and decompress_igor(small_state)-> image. If we did the same process on a second person, say Bob, we'd create compress_bob(image), and decompress_bob(small_state). So we can do a deep fake by connecting compress_igor -> decompress_bob Tada!

### Time Series Analysis

Check out [prophet](https://towardsml.com/2018/05/23/time-series-forecasting-the-easy-way-lets-analyze-microsofts-stocks/)

## Neural Networks

A laymens introduction to neural networks and deep learning. What's interesting here is that many of the stes of model selection and training is "semi random". This [post](https://ahgamut.github.io/2020/11/20/netpicking-1/) Does a great job discussing how to assess models using semi-random model creation.

{% include youtube.html src="BR9h47Jtqyw" %}

### CNN: Convolutional Neural Networks

A neural network with multiple hidden layers, great for pattern (e.g. image recognition)

{% include youtube.html src="2-Ol7ZB0MmU" %}

### RNN: Recurrent Neural Network

A neural network that includes history (e.g. t-1,t-2) as input features, great for time varying analysis

{% include youtube.html src="UNmqTiOnRfg" %}

### GAN: Generate Associative Networs

GANs are used train a lossy compression/decompression pair without human knowledge. Essentially saying, computer make a compression and decompression pair which turns the image back into itself with a much smaller representation . This can be used for deep fakes, by connecting the trained compression of one image, into the trained decompression of another image. Letting you go from person 1->person 2, with 0 training data.

Good explanation:

{% include youtube.html src="8L11aMN5KY8" %}

## What should I read to learn more

- [AI Expert roadmap](https://i.am.ai/roadmap/#introduction)
- [Google's rules of ML](https://developers.google.com/machine-learning/rules-of-ml/) and [summary](https://towardsml.com/2018/08/06/how-great-products-are-made-rules-of-machine-learning-by-google-a-summary/)
- [Hands on machine learning with SciKit-Learn and tensor flow](https://www.amazon.com//dp/1491962291)

{%include amazon.html asin="1491962291;1617294438" %}

- Neural network easier to grock [lectures](https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi)
