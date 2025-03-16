import GPTRules from "./gpt.rules.js";
class TuringMachine {
    constructor(prompt, sample, type, model, openaiApiKey) {
        this.functionCore = null;
        this.decomposedPrompt = null;
        this.prompt = prompt;
        this.sample = sample;
        this.type = type;
        this.model = model;
        this.openaiApiKey = openaiApiKey;
    }
    async initializeFunction() {
        this.functionCore = await GPTRules.generate(this.prompt, this.sample, this.model, this.decomposedPrompt || this.decomposeUserPrompt(), this.openaiApiKey);
        console.log("decomposedPrompt : ", this.decomposedPrompt);
        if (this.functionCore) {
            this.functionCore = this.functionCore.replace(/```javascript|```/g, "").trim();
        }
    }
    async decomposeUserPrompt() {
        this.decomposedPrompt = await GPTRules.decomposePrompt(this.prompt, this.sample, this.openaiApiKey);
        return this.decomposedPrompt;
    }
    async createNewFunction() {
        await this.initializeFunction();
        if (this.functionCore === null)
            throw Error('Error Creating Turing functions');
        try {
            for (let i = 0; i < 3; i++) {
                const workload = new Function("input", `
          "use strict";
           return (() => { 
           ${this.functionCore} 
           })();
           `);
                await this.initializeFunction();
                const validated = await this.validate(workload.toString());
                console.log(workload.toString());
                console.log("Validation result: " + validated);
                if (validated === false)
                    continue;
                this.turingFunction = workload;
            }
        }
        catch (err) {
            console.error("Error creating functionCore:", err);
            return null;
        }
        return null;
    }
    async validate(workload) {
        return await GPTRules.validate(workload, this.prompt, this.sample, this.openaiApiKey);
    }
}
export default TuringMachine;
