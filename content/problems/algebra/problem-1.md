---
id: "p1"
title: "Polynomial Identity Problem"
year: 2005
source: "IMO Shortlist / Algebra"
tags: ["algebra", "polynomial", "modular arithmetic"]
difficulty: "medium"
author: "IMO Committee"
prerequisites: ["polynomials", "modular arithmetic"]
---

## Problem Statement

Let $p(x)$ be a polynomial with integer coefficients such that $p(0) = 1$ and $p(1) = 1$. Show that $p(n)$ is odd for all integers $n$.

## Solution

Consider the polynomial modulo 2. Since $p(0) \equiv 1 \pmod{2}$ and $p(1) \equiv 1 \pmod{2}$, the polynomial $p(x) \pmod{2}$ takes the value 1 at both 0 and 1.

Over $\mathbb{F}\_2$, any polynomial that takes the value 1 at both points must be identically 1. Therefore, $p(x) \equiv 1 \pmod{2}$ for all integers $x$, which means $p(n)$ is odd for all integers $n$.

**Key Insight:** Working modulo 2 simplifies the problem significantly by focusing on the parity of the polynomial values.

## Alternative Approach

Let $q(x) = p(x) - 1$. Then $q(0) = 0$ and $q(1) = 0$, so $x(x-1)$ divides $q(x)$. Thus $p(x) = 1 + x(x-1)r(x)$ for some polynomial $r(x)$ with integer coefficients. For any integer $n$, $n(n-1)$ is even, so $p(n) = 1 + \text{even number} = \text{odd}$.