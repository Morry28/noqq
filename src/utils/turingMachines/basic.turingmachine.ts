import GPTRules from "./gpt.rules.js";

type TSuppoertedFiles = string[] | number[]
type TSuppoertedTypes = string

/**
 * Trieda TuringMachine pre spracovanie vstupných dát pomocou GPT pravidiel.
 */
class TuringMachine {
  /**
   * @property {string} prompt - Prompt od užívateľa pre GPTRules.
   * @property {TSuppoertedTypes} type - Typ súboru.
   * @property {TSuppoertedFiles} sample - Vzor súboru.
   * @property {unknown} input - Vstupné dáta.
   * @property {string | null} functionCore - Pravidlá pre worker.
   * @property {string | null} decomposedPrompt - 
   * @property {string} model - Ai data model
   */
  prompt: string;
  type: TSuppoertedTypes;
  sample: TSuppoertedFiles;
  input: unknown;
  private functionCore: string | null = null;
  turingFunction:Function | undefined  
  decomposedPrompt:string|null = null;
  model:string
  openaiApiKey:string

  /**
   * @param {string} prompt - Užívateľský prompt.
   * @param {TSuppoertedFiles} sample - Vzor súboru.
   * @param {TSuppoertedTypes} type - Typ spracovania.
   * @param {string} model - Ai data model
   */
  constructor(
    prompt: string,
    sample: TSuppoertedFiles,
    type: TSuppoertedTypes,
    model:string,
    openaiApiKey:string) {
    this.prompt = prompt;
    this.sample = sample;
    this.type = type;
    this.model = model;
    this.openaiApiKey = openaiApiKey
  }

  /**
   * Inicializuje pravidlá pomocou GPT.
   * @private
   * @return {Promise<void>}
   */
  private async initializeFunction(): Promise<void> {
    this.functionCore = await GPTRules.generate(this.prompt, this.sample, this.model, this.decomposedPrompt || this.decomposeUserPrompt(), this.openaiApiKey);

    if (this.functionCore) {
      this.functionCore = this.functionCore.replace(/```javascript|```/g, "").trim();
    }

  }

  private async decomposeUserPrompt():Promise<string>{
    this.decomposedPrompt = await GPTRules.decomposePrompt(this.prompt,this.sample, this.openaiApiKey)
    return this.decomposedPrompt
  }

  async createNewFunction(){
    await this.initializeFunction();

    if (this.functionCore === null) throw Error('Error Creating Turing functions');

    try {
      for (let i = 0; i < 3; i++) {

        const workload = new Function("input", `
          "use strict";
           return (() => { 
           ${this.functionCore} 
           })();
           `);

        await this.initializeFunction();

        const validated = await this.validate(workload.toString()) // Passujeme stringovanu funkciu na validaciu
        if (validated === false) continue

        this.turingFunction = workload
        return

      }
    } catch (err) {
      throw Error("Error creating functionCore:" + err);

    }
    return null;
  }

  private async validate(workload: string): Promise<boolean> {
    return await GPTRules.validate(workload, this.prompt, this.sample,this.openaiApiKey)
  }
}

export default TuringMachine

