import { arrayPromptFintech, decomposePrompt, streamingPrompt, validatePrompt } from "../prompts/prompts.js";
const { default: OpenAI } = await import("openai");
class GPTRules {
    static async generate(prompt, sample, model, decomposition, openaiApiKey) {
        const apiKey = openaiApiKey;
        const openai = new OpenAI({ apiKey });
        if (!openai) {
            console.error("❌ OpenAI client is not initialized!");
            return null;
        }
        try {
            let mainPrompt = "";
            switch (model) {
                case "basic":
                    mainPrompt = streamingPrompt(sample, prompt, decomposition);
                    break;
                case "fintech":
                    mainPrompt = arrayPromptFintech(sample, prompt, decomposition);
                    break;
                case "noquery":
                    break;
            }
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: mainPrompt }],
                max_tokens: 500,
            });
            return response.choices[0]?.message?.content || null;
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }
    static async validate(func, prompt, sample, openaiApiKey) {
        const apiKey = openaiApiKey;
        const openai = new OpenAI({ apiKey });
        if (!openai) {
            console.error("❌ OpenAI client is not initialized!");
            return false;
        }
        const validationPrompt = validatePrompt(func, prompt, sample);
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: validationPrompt }],
                max_tokens: 500,
            });
            return Boolean(response.choices[0]?.message?.content) || false;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    static async decomposePrompt(prompt, sample, openaiApiKey) {
        const apiKey = openaiApiKey;
        const openai = new OpenAI({ apiKey });
        if (!openai) {
            console.error("❌ OpenAI client is not initialized!");
            return "false";
        }
        const decomposedPrompt = decomposePrompt(prompt, sample);
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: decomposedPrompt }],
                max_tokens: 500,
            });
            return response.choices[0]?.message?.content || "sorry no data";
        }
        catch (e) {
            console.error(e);
            return "false";
        }
    }
}
export default GPTRules;
