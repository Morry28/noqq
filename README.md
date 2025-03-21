# NOQQ (No Query Query) v0.1.14 - UNSTABLE VERSION 
Only supports single .csv for now.
70% Success rate (To ensure highest accuracy, always write clear queries, use exact column names, and keep your data format consistent)

![npm](https://img.shields.io/npm/v/noqq)
![coverage](https://img.shields.io/codecov/c/github/Morry28/noqq)
![last commit](https://img.shields.io/github/last-commit/Morry28/noqq)

**Intelligent queries at fractions of a penny instead of dollars.**

NOQQ is a lightweight, intelligent data querying system designed to handle massive CSV datasets quickly and affordably. It leverages the power of OpenAI to dynamically create efficient, precise data filters and retrieval functions directly from natural language prompts.

## Cost Comparison

Imagine you have a database file with **12 columns and 100,000 entities**, requiring the processing of approximately **2.5 million input tokens** per request.  

This is the actual cost comparison as of **March 2025**:

| Model        | Cost (USD) |
|--------------|------------|
| GPT-4.5      | $190       |
| GPT-4o       | $6.25      |
| GPT-4o-mini  | $0.37      |
| GPT-o1       | $37        |
| GPT-o1-mini  | $2.75      |
| **NOQQ**     | **$0.002** |

NOQQ provides an ultra-low-cost alternative to traditional LLM-powered queries, making large-scale data processing significantly more affordable.

## Installation

Install via npm:

```bash
npm install noqq
```

## Usage

Initialize NOQQ and query your CSV file effortlessly:

```javascript
import NOQQ from 'noqq';

const noqq = new NOQQ({
    openaiApiKey: 'YOUR_OPENAI_API_KEY',
});

await noqq.initFile('./customerDB.csv');
const result = await noqq.query('return all users from Eritrea');

console.log(result);
```

## Features

- **No Query-Query:** Query your datasets using plain language.
- **Cost-Effective:** Queries cost fractions of a cent instead of dollars.
- **High Efficiency:** Processes large datasets rapidly with streaming data support.
- **Flexible Integration:** Simple initialization and intuitive API.

## Current Limitations

- Only CSV format supported in version 0.1.
- Upcoming versions will support more file formats and data sources.

## Usage Example

Prompt:

```
return all users from Eritrea
```

This intelligently returns only relevant data rows matching your request, irrespective of dataset size.

## Roadmap

- Extend support beyond CSV (JSON, databases, etc.)
- Enhanced performance optimizations
- Improved error handling and validation

---

**Version:** 0.1

© 2024 NOQQ - Intelligent data queries simplified and made affordable.

