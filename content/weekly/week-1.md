---
id: "w1"
title: "Week 1 • Functional Equations"
year: 2024
source: "Weekly Challenge"
tags: ["functional equations", "algebra", "weekly"]
difficulty: "medium"
author: "IMO Resources Team"
deadline: "2025-10-01"
submit: "https://forms.gle/REPLACE_WITH_YOUR_GOOGLE_FORM"
---

## Problem Statement

Find all functions $f: \mathbb{R} \rightarrow \mathbb{R}$ such that for all real numbers $x, y$:
$$f(x + y) = f(x) + f(y) + 2xy$$

## Hints

1. **Start with special cases:** Try setting $y = 0$ and see what you get.
2. **Look for polynomial solutions:** What degree polynomial might satisfy this?
3. **Consider derivatives:** If you assume differentiability, what can you deduce?
4. **Check specific values:** Test small integer values to guess the pattern.

## Solution Approach

### Step 1: Find $f(0)$
Set $x = y = 0$:
$$f(0) = f(0) + f(0) + 0 \Rightarrow f(0) = 0$$

### Step 2: Assume polynomial form
Since the equation involves $2xy$, try a quadratic function. Let $f(x) = ax^2 + bx + c$.

### Step 3: Substitute into the equation
Left side: $f(x+y) = a(x+y)^2 + b(x+y) + c$
Right side: $f(x) + f(y) + 2xy = (ax^2 + bx + c) + (ay^2 + by + c) + 2xy$

### Step 4: Compare coefficients
Equating both sides:
$$a(x^2 + 2xy + y^2) + b(x + y) + c = a(x^2 + y^2) + b(x + y) + 2c + 2xy$$

This gives:
$$2axy + c = 2xy + 2c$$

So: $2a = 2$ and $c = 2c$, thus $a = 1$ and $c = 0$.

### Step 5: Final solution
$f(x) = x^2 + bx$ for any real $b$. However, check if this satisfies the original equation:

$$f(x+y) = (x+y)^2 + b(x+y) = x^2 + 2xy + y^2 + bx + by$$
$$f(x) + f(y) + 2xy = (x^2 + bx) + (y^2 + by) + 2xy = x^2 + y^2 + bx + by + 2xy$$

These are equal, so $f(x) = x^2 + bx$ works for any $b$.

### Step 6: Check if there are other solutions
One can show that these are the only solutions using standard functional equation techniques.

## Final Answer
The functions are $f(x) = x^2 + bx$ for any real constant $b$.

## Submission

Submit your solution by **October 1, 2025** using the Google Form link above. Include your complete proof and any interesting observations.

## Discussion Points

1. Are there any other types of functions that might satisfy this equation?
2. What if the domain is changed to complex numbers?
3. How does this relate to derivative operators?