export const arrayPrompt = (sample: any, prompt: string, decomposition: string) =>
  `
        This request is from app, not from user, so stick strictly to the rules:
        Your response will be ONLY a JavaScript code block. (your code will be additionally wrapped in a function)
        You are providing ONLY: Core of function and return

        Here is a sample of Array (first 3 lines), notice if the first row is just heads of table:
        "${sample}"

        Access Array as a variable named 'input', type of Array. Preffer loops (for loops) over prototype methods.
        Before accessing any array element (e.g., input[i]), always check if it exists and has the expected type.
        Ensure that the returned value matches the expected data structure and format based on the input.
        IMPORTANT: The dataset you receive is already an array of arrays.  
        - Do NOT attempt to use ".split(",")" as the data is NOT a CSV-formatted string.  
        - Access each element directly using "input[i][columnIndex]".  
        - If extracting multiple columns, use direct indexing: "input[i][0]", "input[i][1]", etc.

        According to this Array structure, process the data to achieve the following request:
        User input: "${prompt}", if necessary return a message instead of output to user in his language.
        This is user promp decomposed into steps that will help you code response: ${decomposition}
        
        Your response will be ONLY a JavaScript CORE OF FUNCTION,DONT WRAP IN FUCNTION, IT WILL BE INSERTED INTO FUNCTION.(your code will be additionally wrapped in a function)
        YOU MUST RETURN A VALUE, NEVER RETURN UNDEFINED, NULL, OR AN EMPTY RESULT. YOUR RESPONSIBILITY IS TO RETURN A VALID RESULT.
        DONT ICLUDE ANY EXPLANATION, COMMENTS, FUNCTION DEFINITIONS, OR DESCRIPTIONS. YOUR CODE WILL BE USED IN ARRAY WITH MILIONS OF ENTITIES, MAKE IT VERSATILE.
  `;

  export const streamingPrompt = (sample:any, prompt:string, decomposition:string) =>`
  This request is from an app, not a user. Stick strictly to these rules:
  Your response will ONLY be JavaScript code without explanation, comments, or function definitions.
  
  You must provide code for TWO SPECIFIC PLACES:
  
  1. Initial setup area (top-level code within 'turingFunction'): Initialize accumulators, variables, or structures needed across chunks.
  2. The return function (row processing): This function is called with each streamed row of data (as a JavaScript OBJECT with column names as keys, ALL VALUES ARE ALWAYS STRINGS) and a boolean 'lastChunk' flag.
  
  CRITICAL RULES (ALWAYS FOLLOW THESE EXACTLY):
  - Always explicitly check if row[key] exists and is not undefined/null before using methods (.toLowerCase(), .includes(), new Date()).
  - Explicitly handle missing or empty values by checking row[key] === undefined || row[key] === null || row[key].trim() === "".
  - Always lowercase strings before comparison.
  - NEVER use strict equality (===) for strings. Use .includes() or similar robust methods.
  - Explicitly parse dates using "new Date()" and always verify validity using "isNaN(new Date(row[key]).getTime()) === false".
  - NEVER return intermediate results. ONLY return results when 'lastChunk' is true.
  - NEVER alter or reinterpret the user query. Exactly follow the user's instructions.
  
  Here's the exact function structure:

  function turingFunction() {
      const res = [];
      // INITIAL SETUP AREA - your code goes here
  
      return (row, lastChunk) => {
          if (lastChunk) return res;
  
          // ROW PROCESSING AREA - your code goes here
      };
  }

  Here is a sample row of streaming data as an OBJECT with keys (headers):
  ${sample}

  User input (EXACTLY FOLLOW THIS QUERY, NEVER ALTER IT): "${prompt}".

  Execute exactly these operations (DO NOT DEVIATE):
  ${decomposition}

  Ensure your code:
  - Handles streaming data efficiently and robustly.
  - Precisely matches user-requested output structure ONLY when lastChunk is true.
`;

export const arrayPromptFintech = (sample: any, prompt: string, decomposition: string) =>
  `
          This request is from app, not from user, so stick strictly to the rules:
          Your response will be ONLY a JavaScript code block. (your code will be additionally wrapped in a function)
          You are providing ONLY: Core of function and return
  
          Here is a sample of Array (first 3 lines), notice if the first row is just heads of table:
          "${sample}"
  
          Access Array as a variable named 'input', type of Array. Preffer loops (for loops) over prototype methods.
          Before accessing any array element (e.g., input[i]), always check if it exists and has the expected type.
          Ensure that the returned value matches the expected data structure and format based on the input.
          IMPORTANT: The dataset you receive is already an array of arrays.  
          - Do NOT attempt to use ".split(",")" as the data is NOT a CSV-formatted string.  
          - Access each element directly using "input[i][columnIndex]".  
          - If extracting multiple columns, use direct indexing: "input[i][0]", "input[i][1]", etc.
  
          According to this Array structure, process the data to achieve the following request:
          User input: "${prompt}", if necessary return a message instead of output to user in his language.
          This is user promp decomposed into steps that will help you code response: ${decomposition}

          ***THIS TYPE OF FILE IS FINANCIAL FINTECH FILE WITH FINANCIAL DATA SO TREAT IT LIKE THAT, THAT MEAN UNDERSTAND OHLC candel as C is price usually,etc***
          
          Your response will be ONLY a JavaScript CORE OF FUNCTION,DONT WRAP IN FUCNTION, IT WILL BE INSERTED INTO FUNCTION.(your code will be additionally wrapped in a function)
          YOU MUST RETURN A VALUE, NEVER RETURN UNDEFINED, NULL, OR AN EMPTY RESULT. YOUR RESPONSIBILITY IS TO RETURN A VALID RESULT.
          DONT ICLUDE ANY EXPLANATION, COMMENTS, FUNCTION DEFINITIONS, OR DESCRIPTIONS. YOUR CODE WILL BE USED IN ARRAY WITH MILIONS OF ENTITIES, MAKE IT VERSATILE.
    `;


export const validatePrompt = (func: string, prompt: string, sample: any) =>
  `
        This request is from the app, not from the user.
        Your only output should be either "true" or "false".
        
        **Task:**
        - Check if the given function **correctly implements** the user's prompt based on the provided sample data.
        - If the function **accurately represents** the user's request, return **"true"**.
        - If the function **does not match** the intent of the user's request, return **"false"**.
        
        **Inputs:**
        - User Prompt: "${prompt}"
        - Function to check: "${func}"
        - Sample Data: ${JSON.stringify(sample)}
        
        Respond **only** with "true" or "false". No explanations or additional text.
  `;


export const decomposePrompt = (sample: any, prompt: any): string => 
`
  You are an advanced AI responsible for converting a user query into a precise, structured list of logical operations based ONLY on dataset structure, NOT VALUES. NEVER assume data from sample—use it only to infer COLUMN NAMES and DATA TYPES.
  
  ---
  
  ### INPUT:
  1️⃣ Data sample: ${sample}
  - Use sample ONLY for determining COLUMN NAMES and TYPES. NEVER directly reuse sample values in output.
  
  2️⃣ User query (FOLLOW EXACTLY, NEVER ALTER):
  "${prompt}"
  
  ---
  
  CRITICAL RULES:
  - NEVER reinterpret or alter the user's original query.
  - NEVER directly reuse example values from the provided data.
  - Explicitly list all relevant subjects when user mentions a known group (e.g., "European Union" must include all member countries explicitly).
  - ALWAYS use robust methods for string comparison (lowercase + includes).
  - ALWAYS explicitly state required data conversions clearly:
    - Dates: explicitly mention "Convert 'Subscription Date' to a Date object using 'new Date()' and verify validity with 'isNaN(new Date(row[key]).getTime()) === false'."
    - Numbers: explicitly mention "Convert string to number via 'parseInt(row[key])' or 'parseFloat(row[key])' and verify with '!isNaN()'."
  - When filtering missing or empty values, clearly instruct to explicitly check row[key] === undefined || row[key] === null || row[key].trim() === "".

  ---
  
  OUTPUT FORMAT (STRICTLY FOLLOW THIS STRUCTURE, NO EXTRA TEXT):
  Operation 1  
  Operation 2  
  Operation 3  
  ...  
  Final Operation
`;
  export const decomposePromptMultiple = (
    prompt: string,
    filemap: { fileName: string; fileType: string; filePath: string; sample?: any }[]
  ) => `
  You are an advanced AI system tasked with decomposing a user query into structured operations for multiple datasets. 
  
  Given:
  1. User Query: ${prompt}
  2. Array of datasets with structure and sample data:
  ${JSON.stringify(filemap, null, 2)}
  
  Produce a structured JSON output in the exact following format without extra text:
  
  [
    {
      "fileName": "firstFileName",
      "operations": [
        "Operation 1",
        "Operation 2",
        "Final Operation"
      ]
    },
    ...,
    {
      "fileName": "xFileName",
      "operations": [
        "Operation 1",
        "Final Operation"
      ]
    }
  ]
  
  Important rules:
  - Provide operations independently per dataset.
  - Do NOT merge operations from different datasets.
  - The output must be pure JSON, directly parsable without additional formatting.
  `;
  
  
  


/*
LEGCY
  `
        This request is from app, not from user, so stick strictly to the rules:
        Your response will be ONLY a JavaScript code block. (your code will be additionally wrapped in a function)
        You are providing ONLY: Core of function and return

        Here is a sample of Array(first 3 lines), notice if the first row is just heads of table:
"${sample}"

        Access Array as a variable named 'input', type of Array.Preffer loops(for loops) over prototype methods.
        Before accessing any array element(e.g., input[i]), always check if it exists and has the expected type.
        Ensure that the returned value matches the expected data structure and format based on the input.
        According to this Array structure, process the data to achieve the following request:
        User input: "${prompt}", if necessary return a message instead of output to user in his language.
        
        Your response will be ONLY a JavaScript CORE OF FUNCTION, DONT WRAP IN FUCNTION, IT WILL BE INSERTED INTO FUNCTION.(your code will be additionally wrapped in a function)
        YOU MUST RETURN A VALUE, NEVER RETURN UNDEFINED, NULL, OR AN EMPTY RESULT.YOUR RESPONSIBILITY IS TO RETURN A VALID RESULT.
        DONT ICLUDE ANY EXPLANATION, COMMENTS, FUNCTION DEFINITIONS, OR DESCRIPTIONS.YOUR CODE WILL BE USED IN ARRAY WITH MILIONS OF ENTITIES, MAKE IT VERSATILE.
        `;




*/