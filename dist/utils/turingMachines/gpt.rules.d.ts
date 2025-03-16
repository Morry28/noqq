declare class GPTRules {
    static generate(prompt: string, sample: any, model: string, decomposition: any, openaiApiKey: string): Promise<string | null>;
    static validate(func: string, prompt: string, sample: any, openaiApiKey: string): Promise<boolean>;
    static decomposePrompt(prompt: string, sample: any, openaiApiKey: string): Promise<string>;
}
export default GPTRules;
