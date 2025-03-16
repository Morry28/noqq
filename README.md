# noqq
No query query data chat for fraction of normal cost
# NOQQ (No Query Query) v0.1

**Intelligent queries at fractions of a penny instead of dollars.**

NOQQ is a lightweight, intelligent data querying system designed to handle massive CSV datasets quickly and affordably. It leverages the power of OpenAI to dynamically create efficient, precise data filters and retrieval functions directly from natural language prompts.

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
    openAIKey: 'YOUR_OPENAI_API_KEY',
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

