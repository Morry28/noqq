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

  export const streamingPrompt = (sample:any, prompt:string, decomposition:string) =>
    `
    This request is from an app, not a user. Stick strictly to these rules:
    Your response will ONLY be JavaScript code without explanation, comments, or function definitions.
    
    You must provide code for TWO SPECIFIC PLACES:
    
    1. Initial setup area (top-level code within 'turingFunction'): Initialize accumulators, variables, or structures needed across chunks.
    2. The return function (row processing): This function is called with each streamed row of data and a boolean 'lastChunk' flag.
  
    Your goal:
    - Accumulate and process data incrementally in the return function.
    - Always check row and its fields exist and are the expected types before using them.
    - NEVER return intermediate results. Only return data when 'lastChunk' is true.
    - When 'lastChunk' is true, return a final valid result (e.g., accumulated array 'res'). Never return undefined, null, or empty.
  
    Here's the adjusted function structure:
  
    function turingFunction() {
        const res = [];
        // INITIAL SETUP AREA - your code goes here
  
        return (row, lastChunk) => {
            if (lastChunk) return res;
  
            // ROW PROCESSING AREA - your code goes here
        };
    }
  
    Here is a sample row of streaming data (first row), note if it includes headers:
    "${sample}"
  
    User input: "${prompt}".
    Steps to assist you: ${decomposition}
  
    Ensure your code:
    - Handles streaming data effectively, accumulating into 'res'.
    - Uses loops or direct indexing when processing each row.
    - Performs necessary checks for row elements (e.g., row["column"], row.column).
    - NEVER attempts to split data (data is already streamed as rows, not CSV strings).
    - Returns a single, final output matching requested data structure only when 'lastChunk' is true.
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
  You are an advanced AI system responsible for **breaking down a user query into a structured sequence of operations** based on a given **data sample**. Your goal is to **fully understand the dataset structure and generate the exact step-by-step operations needed to process the data correctly**.

  ---
  
  ### **INPUT FORMAT**
  You will receive:
  1️⃣ A **sample of data** consisting of an array where:
     - The first row **(index 0)** contains column names.
     - The following rows contain sample values from the dataset.
     Sample: ${sample}
  2️⃣ A **user query** (prompt) asking for some computation or transformation.
  User Query: ${prompt}
  
  ---
  
  ### **HOW TO PROCESS THE QUERY**
  1️⃣ **Analyze the sample data** to understand the **column names** and **data types** (numeric, text, date, boolean-like).
  2️⃣ **Break down the user query** into a **sequence of logical operations**.
  3️⃣ **Format the output** as a clear, ordered list of steps **without additional explanation**.
  
  ---
  
  ### **OUTPUT FORMAT**
  Your response must strictly follow this format:
  Operation 1  
  Operation 2  
  Operation 3  
  ...
  Final Operation
  `  



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