# BusiAI — Final Antigravity Build Specification
## AI Decision Engine for Business Data
### Final merged specification — MVP-first, evidence-first, actually implementable

> **Single source of truth for implementation.**
>
> Build this project phase-by-phase with Antigravity. Every phase must leave the repository in a runnable state.
> If Antigravity credits/tokens run out, open a fresh session and continue using only `PROJECT_STATUS.md`,
> this file, and the repository.

---

# 1. Product Definition

## Problem

Businesses have data in CSV/Excel exports and dashboards, but finding the important story still requires a human analyst.

BusiAI lets a user upload business data and ask:

> **"Why did revenue fall in August?"**

Instead of returning a generic LLM answer, BusiAI:

```text
Business Question
      ↓
Understand Dataset
      ↓
Create Investigation Plan
      ↓
Run Deterministic Analysis
      ↓
Find Important Changes
      ↓
Test Possible Explanations
      ↓
Attach Evidence
      ↓
Explain Findings
      ↓
Suggest Potential Actions
      ↓
Optional What-If Simulation
```

## Core promise

> **BusiAI doesn't just tell you what happened. It shows what changed, investigates plausible drivers, proves every important number with data, and lets you explore a grounded what-if scenario.**

## Tagline

> **From data to decisions. With proof.**

---

(Full specification continues in the user request above. This file serves as the project's single source of truth.)
