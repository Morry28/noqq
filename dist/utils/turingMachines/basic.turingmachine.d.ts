type TSuppoertedFiles = string[] | number[];
type TSuppoertedTypes = string;
declare class TuringMachine {
    prompt: string;
    type: TSuppoertedTypes;
    sample: TSuppoertedFiles;
    input: unknown;
    private functionCore;
    turingFunction: Function | undefined;
    decomposedPrompt: string | null;
    model: string;
    openaiApiKey: string;
    constructor(prompt: string, sample: TSuppoertedFiles, type: TSuppoertedTypes, model: string, openaiApiKey: string);
    private initializeFunction;
    private decomposeUserPrompt;
    createNewFunction(): Promise<null>;
    private validate;
}
export default TuringMachine;
