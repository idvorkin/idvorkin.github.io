---
layout: post
no-render-title: true
title: Pandas + IPython + Jupyter Incantations
permalink: /pandas
redirect_from:
  - /jupyter
---

_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/pandas-tutorial.md)_

# Pandas + IPython + Jupyter Incantations

A place to store my hard earned pandas learnings.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Misc](#misc)
    - [Jupyter set to window width](#jupyter-set-to-window-width)
    - [Pretty print the data frame](#pretty-print-the-data-frame)
    - [Jupyter run on a linux box, access from linux.](#jupyter-run-on-a-linux-box-access-from-linux)
    - [ipython magic commands](#ipython-magic-commands)
    - [fix column width to match terminal](#fix-column-width-to-match-terminal)
    - [List columns](#list-columns)
    - [Sorting](#sorting)
- [Column operations](#column-operations)
    - [Convert column type to category](#convert-column-type-to-category)
    - [Count values in category](#count-values-in-category)
    - [Histogram column](#histogram-column)
    - [Custom Apply to a row](#custom-apply-to-a-row)
    - [Convert Json BLOB to new Json Columns](#convert-json-blob-to-new-json-columns)
- [Tidy Data Long and Wide](#tidy-data-long-and-wide)
- [Reshaping Data](#reshaping-data)
- [Pivoting - Narrow to wide](#pivoting---narrow-to-wide)
    - [Simple pivot table by count](#simple-pivot-table-by-count)
    - [Simple pivot table by percent change](#simple-pivot-table-by-percent-change)
- [Group By - Apply aggregate to a group of facts](#group-by---apply-aggregate-to-a-group-of-facts)
    - [Named Aggregations](#named-aggregations)
- [Pandas performance](#pandas-performance)
- [Plotting](#plotting)
    - [Altair](#altair)
    - [Matplotlib](#matplotlib)
    - [Plotly with cufflinks](#plotly-with-cufflinks)
- [Exploratory Data Analysis](#exploratory-data-analysis)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

### Misc

#### Jupyter set to window width

    # Resize Jupyter to window width
    from IPython.core.display import display, HTML
    display(HTML("<style>.container { width:95% !important; }</style>"))

#### Pretty print the data frame

If you use print to show a dataframe, it'll look ugly, use display instead.

    display(df)

#### Jupyter run on a linux box, access from linux.

    https://coderwall.com/p/ohk6cg/remote-access-to-ipython-notebooks-via-ssh

#### ipython magic commands

    %history -n
    %history -g <string> search for string
    %recall - put in editor
    %rerun - execute in editor

#### fix column width to match terminal

    pd.set_option('display.large_repr', 'truncate')
    pd.set_option('display.max_columns', 0)

#### List columns

    df.columns()

#### Sorting

    df.sort_index()
    df.sort_values()

### Column operations

#### Convert column type to category

    df.column = df.column.astype("category")

#### Count values in category

    df.column.value_counts()
    df.column.value_counts(normalize=True)
    df.column.value_counts(normalize=False).cumsum()

#### Histogram column

    df.groupby(df.column).apply(len)

#### Custom Apply to a row

    df.apply(axis="columns", func=myFuncThatTakesArowAsInput) # pretty darn slow.

#### Convert Json BLOB to new Json Columns

    df = df.join(pd.DataFrame(df['json_string'].apply(json.loads).apply(pd.Series)))

### Tidy Data Long and Wide

Tidy data is [ideal for analysis](https://vita.had.co.nz/papers/tidy-data.pdf). The data definitions are confusing, so I'll provide my own:

- **Dimension (Dim/Pivot)** - A caregorical property of a entity
- **Entity (Independent Variable)** - Set of **dimensions** that uniquely identify the facts
- **Fact (Measure/Dependent Variable)** - A **fact**/measure for an entity.

With these definitions, Tidy data is defined as:

1. Each fact forms a column.
2. Each observation (of an entity) forms a row (with a fact per column).
3. Each type of observational unit forms a table. (??)

This is a **wide data set**, where a row is the **Set of Dimensions (Entity), and a fact per column**. This is:

- Easiest for humans to digest
- An Excel Pivot Table
- The best shape for panadas
- (From Narrow: pivot, or multi group and un-stack)

Another form of tidy data, often how raw data looks is called narrow data,in this case a row is a **Set of Dimensions (Entity), A column for Fact Name, A column for Fact Value**. This is

- Hard for humans to grock
- The best shape for altair
- (From wide: Use melt to get from wide to narrow)

### Reshaping Data

- [Reshaping Tutorial](https://pandas.pydata.org/pandas-docs/stable/user_guide/reshaping.html)
- [Tidy Reshaping cheat sheet](https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf)

### Pivoting - Narrow to wide

#### Simple pivot table by count

    pv = pd.pivot_table(df,index=pd.Grouper(freq='2W'), columns="column_1",values="column2", aggfunc='count')

#### Simple pivot table by percent change

    pv = pd.pivot_table(df,index=pd.Grouper(freq='2W'), columns="column_1",values="column2", aggfunc='count').pcnt_change()

### Group By - Apply aggregate to a group of facts

#### Named Aggregations

Groupby is great, but it's a bugger to name aggregations, until [pandas 0.25 added named aggregations](https://pandas.pydata.org/pandas-docs/stable/user_guide/groupby.html#named-aggregation)

### Pandas performance

- [Pandas Performance Tutorial](https://pandas.pydata.org/pandas-docs/stable/user_guide/enhancingperf.html)

  - Numba - faster apply operations (swifter includes it)
  - df.eval - faster df operations
  - pandas.read_csv(), usecols to limit columns loaded
  - see memory - ts.memory_usage(deep=True)

- [Swifter](https://github.com/jmcarpenter2/swifter) - Smart Function Application (will use Numba, or Dask, or parallel apply)
- [Modin](https://github.com/modin-project/modin) - Parallel DataFrame, design for compatibility first
- [Dask](https://docs.dask.org/en/latest/) - Parallel DataFrame - but use Modin instead)
- [Numba](http://www.google.com?btnI=1&q=Numba) - JIT your functions, but use Swifter instead.
- [Pandarell](https://github.com/nalepae/pandarallel) - Parallel Apply (swifter equiv)

### Plotting

#### Altair

[Altair](https://github.com/altair-viz/altair) is completely obvious to use, and I enjoy it.

Altair normally can't use index's so you'll need to reset_index first. You can do this in_place

You'll also often need to unstack

#### Matplotlib

Learning plotting libraries can be a pain, dataviz is probably as important as data analysis, both because the viz will tell the story, but also because the viz will make analysis so much easier.

I spent a tonne of time working with matplotlib, but it's so non-obvious to write, and I always need to look up its non onbvious syntax, and spend hours trying to figure out whatever quirk I'm getting bitten by:

- [Anatomy of matploblib](https://github.com/matplotlib/AnatomyOfMatplotlib)
- [Matplotlib by J.R. Johansson](https://github.com/jrjohansson/scientific-python-lectures/blob/master/Lecture-4-Matplotlib.ipynb)

Gotchyas:

- Axes is a synonym for subplot. It should not be confused with axis.

#### Plotly with cufflinks

To check out:

plot.ly with [cufflinks](https://github.com/santosjorge/cufflinks) - seems to be emerging as a winner, but careful about the need for on-line vs offline mode.

### Exploratory Data Analysis

- [Pandas-Profiling](https://pandas-profiling.github.io/pandas-profiling/)
