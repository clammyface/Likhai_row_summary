# LikhAI Google Sheets Add-on

## Overview

LikhAI is a custom Google Sheets add-on that brings the power of LLMs (like GPT-4o) into your spreadsheet to:

1. **Classify or extract structured outputs row-by-row** from a table (e.g., support tickets)
2. **Summarize full tables** to detect themes, clusters, or common issues

---

## ✅ Use Cases

### 1. `=LIKHAI.ROW(...)` – Row-wise Classification

Analyze each row independently with an LLM and populate response directly into the sheet.

#### Example Use:

* Range: `A2:C20` (support ticket descriptions, channel, priority)
* Prompt: "Classify into product, category, subcategory"
* Model: `gpt-4o-mini`
* Try mode: `FALSE` (use all rows)

**Formula:**

```excel
=LIKHAI.ROW(A2:C20, "Classify each row into Product, Category, Subcategory", FALSE, "gpt-4o-mini")
```

---

### 2. `=LIKHAI.SUMMARY(...)` – Table-Level Summary

Send the full range to LLM for a single summarization output.

**Formula:**

```excel
=LIKHAI.SUMMARY(A2:C20, "Summarize the table and identify themes", FALSE, "gpt-4o-mini")
```

---

## 🔄 Batching & Output

* Rows are processed in **batches of 5**
* Each response is returned **line-by-line per row**
* Input rows = Output rows (no mismatch)
* Avoids API timeout using controlled chunking

---

## 🧠 Prompting Behavior

You can:

* Write prompts directly in the formula
* Or reference a cell like `Sheet2!B3`

### Output Expectations for `=LIKHAI.ROW(...)`

LLM is instructed to:

* Respond **per row**
* Use Markdown-style headers like `**1.**`, `**2.**` etc.
* Include newline-separated values like:

```
**1.**
Product: Nucleus
Category: Login
Subcategory: Forgot Password
```

---

## ⚙️ Configuration Sheet: `.likhai-do-not-remove`

On first use, a hidden sheet is created with:

* API Key (`B1`)
* Base URL (`B2`)
* Model Name (`B3`)

You may update this anytime manually.

---

## 💬 Feedback Loop with Product Team

* Met with **Product & Support teams** to refine the use case
* Aligned response formatting with downstream usage in dashboards
* Incorporated model choice flexibility based on their preferences

---

## 📦 Deployment Strategy

LikhAI will be shipped as an internal Google Sheets Add-on to enable cross-org usage:

* Available from **Extensions > Add-ons**
* No spreadsheet ownership needed
* Safe for scale-up with logging (planned)

---

## ✅ Example Formulas

**Row-by-row using prompt string:**

```excel
=LIKHAI.ROW(A2:C20, "Classify each row", FALSE, "gpt-4o-mini")
```

**Row-by-row using prompt cell reference:**

```excel
=LIKHAI.ROW(A2:C20, Sheet2!A1, FALSE, "gpt-4o-mini")
```

**Summary mode:**

```excel
=LIKHAI.SUMMARY(A2:C20, Sheet2!A2, FALSE, "gpt-4o-mini")
```

---

## 📈 Auto-Refresh Strategy

* **Formula is reactive**: auto-updates if input changes
* **Row hash-based caching** planned to avoid duplicate API calls

---

## 🛡️ Security & Monitoring

* Config values stored per user (in hidden sheet)
* Planned logging to avoid overuse or token abuse
* LLM errors (404, 429, etc.) handled gracefully with clear messages

---

## ✅ Final Notes

LikhAI simplifies row-level intelligence and table summarization using LLMs. Thanks to collaboration with the product team, it’s tailored to their real workflow and already shows significant time savings in support triage, reporting, and feature tagging.

> Built for speed, built with empathy. 🌱
## ⚠️ Known Issues & Errors

### ❗1. "Missing response" Error

Sometimes the formula (`=LIKHAI.ROW(...)`) returns blank output or shows `"Missing response"` in the result cell.
### ❗2. Row Output Misalignment (Answer Skips to Next Row)

Even when a valid response is received, the output may appear **line-by-line in consecutive rows**, instead of all in a single cell.
