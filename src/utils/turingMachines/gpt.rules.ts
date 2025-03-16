import { arrayPrompt, arrayPromptFintech, decomposePrompt, streamingPrompt, validatePrompt } from "../prompts/prompts.js";
const { default: OpenAI } = await import("openai");

/**
 * Trieda na interakciu s OpenAI GPT-3 API.
 * @class
 */
class GPTRules {
  /**
   * Generuje pravidlá pre spracovanie súborov pomocou GPT-3.
   * @param {string} prompt - Užívateľský vstup.
   * @param {any} sample - Vzorka dát.
   * @param {string} model - Typ spracovania.
   * @return {Promise<string | null>} Odpoveď od AI alebo `null` pri chybe.
   * @static
   * @async
   */
  static async generate(
    prompt: string,
    sample: any,
    model: string,
    decomposition: any,
    openaiApiKey:string): Promise<string | null> {

    const apiKey = openaiApiKey;
    const openai = new OpenAI({ apiKey });
    if (!openai) {
      throw Error('OpenAI client is not initialized!');
    }
    try {
      let mainPrompt=""
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
    } catch (e) {
      console.error(e);
      return null;
    }
  }
  /**
   * Overuje pravidlá pre spracovanie súborov pomocou GPT-3.
   * @param {string} prompt - Užívateľský vstup.
   * @param {any} sample - Vzorka dát.
   * @param {string} type - Typ spracovania.
   * @return {Promise<string | null>} Odpoveď od AI alebo `null` pri chybe.
   * @static
   * @async
   */
  static async validate(
    func: string,
    prompt: string,
    sample: any,
    openaiApiKey:string): Promise<boolean> {
    const apiKey = openaiApiKey;
    const openai = new OpenAI({ apiKey });
    if (!openai) {
      throw Error('OpenAI client is not initialized!');
    }

    const validationPrompt = validatePrompt(func, prompt, sample)

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: validationPrompt }],
        max_tokens: 500,
      });

      return Boolean(response.choices[0]?.message?.content) || false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async decomposePrompt(
    prompt: string,
    sample: any,
    openaiApiKey:string): Promise<string> {
    const apiKey = openaiApiKey;
    const openai = new OpenAI({ apiKey });
    if (!openai) {
      throw Error('OpenAI client is not initialized!');
    }
    const decomposedPrompt = decomposePrompt(prompt, sample)

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: decomposedPrompt }],
        max_tokens: 500,
      });

      return response.choices[0]?.message?.content || "sorry no data"
    } catch (e) {
      throw Error(e as string);
    }
  }

}

export default GPTRules;
