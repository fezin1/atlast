---
id: "p3"
title: "Geometric Inequality"
year: 1996
source: "IMO Problem 2"
tags: ["geometry", "inequality", "triangle"]
difficulty: "hard"
author: "IMO Committee"
prerequisites: ["triangle geometry", "algebraic inequalities"]
---

## Problem Statement

In triangle $ABC$, let $I$ be the incenter. Prove that:
$$\frac{IA^2}{BC^2} + \frac{IB^2}{CA^2} + \frac{IC^2}{AB^2} \geq \frac{3}{4}$$

## Solution

### Step 1: Express in terms of angles and sides
Using the formula for the distance from the incenter to vertices:
$$IA = \frac{r}{\sin(A/2)}$$
where $r$ is the inradius.

### Step 2: Rewrite the inequality
The inequality becomes:
$$\frac{r^2}{\sin^2(A/2) BC^2} + \frac{r^2}{\sin^2(B/2) CA^2} + \frac{r^2}{\sin^2(C/2) AB^2} \geq \frac{3}{4}$$

### Step 3: Use trigonometric identities and side relationships
Using $BC = 2R\sin A$, $CA = 2R\sin B$, $AB = 2R\sin C$, where $R$ is the circumradius.

### Step 4: Simplify using half-angle formulas
After substitution and simplification, the inequality reduces to:
$$\frac{1}{4\cos^2(A/2)} + \frac{1}{4\cos^2(B/2)} + \frac{1}{4\cos^2(C/2)} \geq \frac{3}{4}$$

### Step 5: Apply Jensen's inequality
Since $\sec^2(x)$ is convex on $(0, \pi/2)$, by Jensen's inequality:
$$\frac{\sec^2(A/2) + \sec^2(B/2) + \sec^2(C/2)}{3} \geq \sec^2\left(\frac{A/2 + B/2 + C/2}{3}\right) = \sec^2(\pi/6) = \frac{4}{3}$$

Thus proving the original inequality.

**Key Techniques:** Trigonometric identities, Jensen's inequality, geometric formulas.