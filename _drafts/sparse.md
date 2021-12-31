---
layout: note
title: Data Structures for Sparse Matrices from Scratch in Python
location:
category: bookshelf
published: true
include_math: true
---

When a matrix has a large proportion of zero values we can make use of this
sparsity with data structures that are efficient in memory and time complexity
of operations.

Decades of numerical analysis research provide us with a variety of data
structures available in commonly used scientific computing packages like 
Scipy, Boost and Eigen.

It's worth understanding how these data structures are built and what
operations they're most efficient for.

In this post I'll build up some of the common data structures for sparse
matrices from scratch using primitive datatypes in Python and compare their
performance on typical operations.

The implementations can be read in the associated repo. Note that these
implementations are designed only for study and avoid many optimisations that
would be used in code designed for production.

\begin{equation}
A = 
\begin{bmatrix}
   1 & 2 & 0 & 0 \\\
   0 & 0 & 3 & 0 \\\
   0 & 4 & 0 & 5
 \end{bmatrix}
\end{equation}

## Dense format

As a baseline we'll implement a dense matrix as a `list` of `list`s representing
a 2D array.

```py
A = [[1, 2, 0, 0], [0, 0, 3, 0], [0, 4, 0, 5]]
```

We'll create a class to represent Dense matrix objects:

```python
class DenseMatrix(base.BaseMatrix):

    def __init__(self, nrows, ncols):
        super().__init__(nrows=nrows, ncols=ncols)
        self.data = [[0.0 for j in range(self.ncols)] for i in 
            range(self.nrows)]
```

The `Dense` format offers `insert`, `delete` and `get` operations that are
constant time, $\mathcal{O}(1)$.

Consider multiplication with a vector.
\begin{equation}
\mathbf{A} \cdot \mathbf{x} = \mathbf{b}
\end{equation}

```py
    def mul_vector(self, vector):
        '''Muliplies the matrix with a vector.
        O(MN)
        Args:
            vector (array)
        '''
        if len(vector) != self.ncols:
            raise ValueError('len(vector) != self.ncols')
        rv = [0.0]*len(vector)
        for i in range(self.nrows):
            for j in range(self.ncols):
                rv[i] += self.get(i,j)*vector[j]
        return rv
```

## Coordinate (COO) format

```py
A = [(0, 0, 1), (0, 1, 2), (1, 2, 3), (2, 1, 4), (2, 3, 5)]
```

## Dictionary of Keys (DOK) format

```py
A = {(0, 0): 1, (0, 1): 2, (1, 2): 3, (2, 1): 4, (2, 3): 5}
```


## Compressed Sparse Row (CSR) format
