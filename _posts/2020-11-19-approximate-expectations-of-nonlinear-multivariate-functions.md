---
layout: note
title: Approximate Expectations of Nonlinear Multivariate Functions
location: Manchester
category: research
published: true
description: lorem ipsum
permalink:
asset_path: /assets/notes/approximate-expectations-of-nonlinear-multivariate-functions
include_math: true
---

Let $X$ be a random variable and $f: \mathbb{R} \to \mathbb{R}$ a deterministic
function of that random variable. If $f$ is a linear function such that we may
write $f(X) = a + b X$ for $a, b \in \mathbb{R}$, then we have $\mathbb{E}(f(X))
= a + b~\mathbb{E}(X)$. If $f$ is nonlinear, we may not be able to write an
exact closed form expression for $\mathbb{E}(f(X))$. In this post I'll show
that if $f$ is continuous and sufficiently differentiable, we can approximate
the expected value using a Taylor series.

We expand $f(x)$ in a Taylor series around $\mu_X$, the mean of $X$, for
example to second order
\begin{equation}
 f(X) = f(\mu_x) + f'(\mu_x) (X - \mu_x) + \tfrac{1}{2} f''(\mu_x)
   (X - \mu_x)^2 + \mathcal{O }((X - \mu_x)^3).
\end{equation}
Then if the moments of $X$ are finite[^1], we may write the expected value as
\begin{equation}
 \mathbb{E}(f(X)) = f(\mu_X) + f'(\mu_X) \mathbb{E}( (X - \mu_X)) +
   \tfrac{1}{2} f''(\mu_X) \mathbb{E}((X - \mu_X)^2) +
   \mathcal{O}(\mathbb{E}((X - \mu_X)^3)).
\end{equation}
Now $\mathbb{E}( (X - \mu_x)) = 0$ and $\mathbb{E}((X - \mu_x)^2) =
\sigma^2_X$ is the variance so we can write the second-order approximation
\begin{equation}
 \mathbb{E}(f(X)) \approx f(\mu_X) + \tfrac{1}{2} f''(\mu_X) \sigma^2_X.
\end{equation}

## Multivariate Functions

Let $\mathbf{X}$ be a vector of $n$ random variables and $g: \mathbb{R}^n \to
\mathbb{R}$ be a function of such a random variable vector. If $g(\mathbf{X})$
is continuous and sufficiently differentiable we can in the same way expand a
Taylor series around $\mu_\mathbf{X}$, the mean of $\mathbf{X}$, and write
\begin{equation} 
  g(X) = g(\mu_\mathbf{X}) + \nabla g(\mu_\mathbf{X}) (\mathbf{X}
    - \mu_\mathbf{X}) + \tfrac{1}{2} (\mathbf{X} - \mu_\mathbf{X})^T H_g
    (\mu_\mathbf{X}) (\mathbf{X} - \mu_\mathbf{X}) + \mathcal{O}((\mathbf{X} -
    \mu_\mathbf{X})^3) 
\end{equation} 
where $H_g$ is the Hessian of $g$.

If the moments of each element of $\mathbf{X}$ are finite, we may approximate
the expectation of the function as[^2]
\begin{equation}
 \mathbb{E}(g(\mathbf{X})) \approx g(\mu_\mathbf{X}) +
   \tfrac{1}{2} \mathrm{Tr}
   \left[ H_f (\mu_\mathbf{X}) \Sigma_\mathbf{X} \right]
\end{equation}
where $\Sigma_\mathbf{X}$ is the covariance matrix of $\mathbf{X}$.

For example, if $n = 2$ such that 
$$
\mathbf{X} = \left[ \begin{smallmatrix} X_1 
\\ X_2 \end{smallmatrix} \right]
$$, we have a Hessian

$$
 H_g (\mu_\mathbf{X}) =
 \begin{bmatrix}
   \frac{\partial^2 g}{\partial X_1^2} & \frac{\partial^2 g}{\partial X_1
     \partial X_2} \\
   \frac{\partial^2 g}{\partial X_2
     \partial X_1}                     & \frac{\partial^2 g}{\partial X_2^2}
 \end{bmatrix} 
 (\mu_\mathbf{X})
$$

and a covariance matrix

$$
 \Sigma_\mathbf{X} =
 \begin{bmatrix}
   \sigma_{X_1}^2          & \mathrm{Cov}(X_1, X_2) \\
   \mathrm{Cov}(X_2, X_1)  & \sigma_{X_2}^2
 \end{bmatrix}.
$$

Then we can expand the trace,
$$
 \begin{split}
 \mathrm{Tr} \left[ H_g (\mu_\mathbf{X}) \Sigma_\mathbf{X} \right] =
 &\frac{\partial^2 g}{\partial X_1^2} (\mu_\mathbf{X}) \sigma_{X_1}^2 +
 \frac{\partial^2 g}{\partial X_1
 \partial X_2} (\mu_\mathbf{X}) \mathrm{Cov}(X_2, X_1) + \\
 &\frac{\partial^2 g}{\partial X_2
 \partial X_1} (\mu_\mathbf{X}) \mathrm{Cov}(X_1, X_2) +
 \frac{\partial^2 g}{\partial X_2^2} (\mu_\mathbf{X}) \sigma_{X_2}^2.
 \end{split}
$$

If $X_1, X_2$ are independent such that $\mathrm{Cov}(X_1, X_2) =
\mathrm{Cov}(X_2, X_1) = 0$, we are left with a second order approximation for
the expected value of the multivariate function,
\begin{equation}
   \mathbb{E}(g(\mathbf{X})) \approx g(\mu_\mathbf{X}) +
   \frac{\partial^2 g}{\partial X_1^2} (\mu_\mathbf{X}) \sigma_{X_1}^2 +
   \frac{\partial^2 g}{\partial X_2^2} (\mu_\mathbf{X}) \sigma_{X_2}^2.
\end{equation}

[^1]: See [this answer on stats.stackexchange.com][se-ans] for an explanation as to why that requirement is important and why this method does not work for heavy-tailed distributions.

[^2]: For a random vector $\mathbf{X}$ and symmetric matrix $\Lambda$ the [expectation of the quadratic form](https://en.wikipedia.org/wiki/Quadratic_form_\(statistics\)), $\mathbb{E}(\mathbf{X}^T \Lambda \mathbf{X}) = \mathbb{E}(\mathbf{X})^T \Lambda \mathbb{E}(\mathbf{X}) + \mathrm{Tr} \left[ \Lambda \Sigma_\mathbf{X} \right]$.


[se-ans]: https://stats.stackexchange.com/a/70822
