---
layout: post
---

_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/notes/pandas-tutorial.md)_

# Pandas + IPython + Jupyter Incantations

A place to store my hard earned pandas learnings.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Misc](#misc)
    - [Jupyter set to window width](#jupyter-set-to-window-width)
    - [Jupyter run on a linux box, access from linux.](#jupyter-run-on-a-linux-box-access-from-linux)
    - [ipython magic commands](#ipython-magic-commands)
    - [fix column width to match terminal](#fix-column-width-to-match-terminal)
    - [List columns](#list-columns)
    - [Sorting](#sorting)
- [Working with categories](#working-with-categories)
    - [Convert column type to category](#convert-column-type-to-category)
    - [Count values in category](#count-values-in-category)
    - [Histogram column](#histogram-column)
    - [Custom Apply to a row](#custom-apply-to-a-row)
- [Pivoting](#pivoting)
    - [Simple pivot table by count](#simple-pivot-table-by-count)
    - [Simple pivot table by percent change](#simple-pivot-table-by-percent-change)
- [Pandas for those that want to go faster.](#pandas-for-those-that-want-to-go-faster)
- [Plotting](#plotting)
- [Reshaping Data](#reshaping-data)
- [Exploratory Data Analysis](#exploratory-data-analysis)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

### Misc

#### Jupyter set to window width

    # Resize Jupyter to window width
    from IPython.core.display import display, HTML
    display(HTML("<style>.container { width:95% !important; }</style>"))

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

### Working with categories

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

### Pivoting

#### Simple pivot table by count

    pv = pd.pivot_table(df,index=pd.Grouper(freq='2W'), columns="column_1",values="column2", aggfunc='count')

#### Simple pivot table by percent change

    pv = pd.pivot_table(df,index=pd.Grouper(freq='2W'), columns="column_1",values="column2", aggfunc='count').pcnt_change()

### Pandas for those that want to go faster.

- [Modin](https://github.com/modin-project/modin) - Parallel DataFrame, design for compatiblity first
- [Dask](https://docs.dask.org/en/latest/) - Parallel DataFrame - but use Modin instead)
- [Swifter](https://github.com/jmcarpenter2/swifter)- Smart Function Application (will use Numba, or Dask, or etc)
- [Numba](http://www.google.com?btnI=1&q=Numba) - JIT your functions, but use Swifter instead

### Plotting

- [Anatomy of matploblib](https://github.com/matplotlib/AnatomyOfMatplotlib)
- [Matplotlib by J.R. Johansson](https://github.com/jrjohansson/scientific-python-lectures/blob/master/Lecture-4-Matplotlib.ipynb)

Gotchyas:

- Axes is a synonym for subplot. It should not be confused with axis.

### Reshaping Data

- [Official Pandas Tutorial](https://pandas.pydata.org/pandas-docs/stable/user_guide/reshaping.html)

### Exploratory Data Analysis

- [Pandas-Profiling](https://pandas-profiling.github.io/pandas-profiling/)
