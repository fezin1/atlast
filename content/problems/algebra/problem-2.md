---
id: "p2"
title: "Divisibility by Squares"
year: 2011
source: "IMO Shortlist / Number Theory"
tags: ["number theory", "divisibility", "primes"]
difficulty: "medium"
author: "IMO Committee"
prerequisites: ["modular arithmetic", "prime factorization"]
---

## Problem Statement

Find all positive integers $n$ for which $n$ divides $2^n - 2$.

## Solution

The solution involves several cases:

1. **Prime case:** If $n = p$ is prime, then by Fermat's Little Theorem, $2^p \equiv 2 \pmod{p}$, so all primes satisfy the condition.

2. **Prime power case:** For $n = p^k$ with $k > 1$, we need to check when $p^k$ divides $2^{p^k} - 2$.

3. **Composite numbers:** For composite numbers, we use the concept of Carmichael numbers and the structure of the multiplicative group.

The complete solution shows that $n$ divides $2^n - 2$ if and only if $n$ is:
- Any prime number, or
- $n = 1$ (trivially), or
- Certain specific composite numbers like 341, 561, etc. (pseudoprimes to base 2)

**Key Techniques:** Fermat's Little Theorem, Chinese Remainder Theorem, and analysis of multiplicative orders.

## Proof Sketch

1. Show that if $n$ is square-free and for every prime $p$ dividing $n$, we have $(p-1)$ divides $(n-1)$, then $n$ satisfies the condition.

2. Verify that primes satisfy this condition.

3. Show that numbers with squared factors generally don't work except for specific cases.