
const supportedFileTypes = ["csv"]// "xls", "xlsx", "sql", "pgsql"]

export default class NOQQ {

    protected openaiApiKey: string;
    public user: ProfileManager;
    protected fileManager: FileManager | null = null;
    public serverSideProcessing: boolean;

    constructor(
        { openaiApiKey, user = "default", serverSideProcessing = false }
            : { openaiApiKey: string; user: string; serverSideProcessing?: boolean; }) {

        this.openaiApiKey = openaiApiKey;
        this.serverSideProcessing = serverSideProcessing;
        this.user = new ProfileManager().setProfile(user);
    }
    async initFile(...filePaths: string[]) {
        this.fileManager = new FileManager(filePaths);
        await this.fileManager.sampleFile()


    }
    async query(userQueryText: string) {
        return await this.createResponse(userQueryText)
    }

    private async createResponse(userQueryText: string): Promise<unknown> {
        if (!this.fileManager) throw Error('File Manager didnt initiate properly')

        const turingManager = new TuringMachineManager(this.fileManager, this.openaiApiKey)
        const turingRes = await turingManager.newWork(userQueryText)
        const respose = turingRes ?? 'Ups, something went wrong'

        return respose
    }
}

class TuringMachineManager {
    openaiApiKey: string
    fileManager: FileManager
    promptManager: PromptManager | null = null

    constructor(fileManager: FileManager, openaiApiKey: string) {
        this.fileManager = fileManager
        this.openaiApiKey = openaiApiKey
    }

    async newWork(userQueryText: string): Promise<unknown> {

        const singleFile = this.fileManager.fileMap.length < 2

        if (singleFile) {
            return this.singleFileWork(userQueryText)
        } else {
            return 'WARNING: Multi file support is not implemented yet. Expected in v0.1.5'
            //return this.multiFileWork(userQueryText)
        }
    }

    private async singleFileWork(userQueryText: string) {
        this.promptManager = new PromptManager(userQueryText, this.openaiApiKey)

        await this.promptManager.decomposeSingle(userQueryText, JSON.stringify(this.fileManager.fileMap[0].sample))
        if (!this.promptManager.decomposed[0]) throw Error('Error ocured at decompositions')

        const turingMachine = new TuringMachine(
            userQueryText,
            this.promptManager.decomposed[0],
            JSON.stringify(this.fileManager.fileMap[0].sample),
            this.fileManager.fileMap[0].fileType,
            'basic',
            this.openaiApiKey)

        await turingMachine.createNewFunction()
        const res = await this.fileManager.applyTuringFunction(turingMachine, this.fileManager.fileMap[0].filePath)
        return res
    }
    private async multiFileWork(userQueryText: string) {
        this.promptManager = new PromptManager(userQueryText, this.openaiApiKey)
        await this.promptManager.decomposeMultiple(userQueryText, this.fileManager.fileMap)



    }
}

import GPTRules from "./utils/turingMachines/gpt.rules.js";
class PromptManager {
    userPromptText: string
    openaiApiKey: string
    decomposed: string[] = []

    constructor(userPromptText: string, openaiApiKey: string) {
        this.userPromptText = userPromptText
        this.openaiApiKey = openaiApiKey
    }

    async decomposeSingle(userQueryText: string, sample: any) {
        try {
            this.decomposed.push(await GPTRules.decomposePromptSingle(userQueryText, sample, this.openaiApiKey))
        } catch (e) {
            this.decomposed = []
        }
    }

    async decomposeMultiple(userQueryText: string, filemap: { fileName: string, fileType: string, filePath: string, sample?: any }[]) {

            const decomposedMultipleRes = await GPTRules.decomposePromptMultiple(userQueryText,filemap,this.openaiApiKey)
            console.log('Decomposed Multiple: ', decomposedMultipleRes)





    }
}

class FileManager {
    filePath: string[];
    isNode: boolean;
    fileMap: { fileName: string, fileType: string, filePath: string, sample?: any }[];

    constructor(filePath: string[]) {
        this.filePath = filePath;
        this.isNode = typeof window === "undefined";
        this.fileMap = this.getFileType(filePath);
    }

    private getFileType(filePath: string[]): { fileName: string, fileType: string, filePath: string, sample?: any }[] {

        if (!Array.isArray(filePath)) throw Error('File could not be initialized, incorrect data type')
        if (filePath.length < 1) throw Error('You forgot to pass a relative path of file')

        let extractedFileTypes: { fileName: string, fileType: string, filePath: string, sample?: any }[] = []


        if (filePath[0] && filePath.length === 1 && typeof filePath[0] === "string") {
            let fileNameWithType = filePath[0].split("/").pop() || "";
            let lastDotIndex = fileNameWithType.lastIndexOf(".");

            let fileNameWithoutType = lastDotIndex !== -1 ? fileNameWithType.substring(0, lastDotIndex) : fileNameWithType;
            let fileType = lastDotIndex !== -1 ? fileNameWithType.substring(lastDotIndex + 1) : "";

            if (!fileNameWithoutType || !supportedFileTypes.includes(fileType)) {
                throw Error(`Incorrect file types detected, only supported filetypes are ${supportedFileTypes.join(",")}`);
            }

            extractedFileTypes.push({
                fileName: fileNameWithoutType,
                fileType: fileType,
                filePath: filePath[0]
            });

        } else {
            filePath.forEach((fp: string, pos: number) => {
                if (typeof fp !== "string") throw Error(`Wrong file type on position ${pos}, expected string, got ${typeof fp}`);

                let fileNameWithType = fp.split("/").pop() || "";
                let lastDotIndex = fileNameWithType.lastIndexOf(".");

                let fileNameWithoutType = lastDotIndex !== -1 ? fileNameWithType.substring(0, lastDotIndex) : fileNameWithType;
                let fileType = lastDotIndex !== -1 ? fileNameWithType.substring(lastDotIndex + 1) : "";

                if (!fileNameWithoutType || !supportedFileTypes.includes(fileType)) {
                    throw Error(`Incorrect file types detected at position ${pos}, only supported filetypes are ${supportedFileTypes.join(",")}`);
                }

                extractedFileTypes.push({
                    fileName: fileNameWithoutType,
                    fileType: fileType,
                    filePath: fp,
                    sample: null
                });
            });
        }
        return extractedFileTypes
    }

    async applyTuringFunction(turingMachine: TuringMachine, filePath: string): Promise<string[]> {
        const machine = FileConverterFactory.getStream(turingMachine, filePath)
        const res = await machine.run()
        return res

    }

    async sampleFile(): Promise<void> {
        const fileArr = FileConverterFactory.getSample(this.fileMap)

        await Promise.all((fileArr.map(async (file: any) => {
            file.sample = await file.sample.run()
        })))

        this.fileMap = fileArr;

    }
}


class FileConverterFactory {
    static getStream(turingMachine: TuringMachine, filePath: string) {
        switch (turingMachine.type) {
            case "csv":
                return new CSVStreamer(filePath, turingMachine);
            case "xls":
                throw new Error("XLS Converter not implemented yet");
            case "xlsx":
                throw new Error("XLSX Converter not implemented yet");
            case "sql":
                throw new Error("SQL Converter not implemented yet");
            case "pgsql":
                throw new Error("PostgreSQL Converter not implemented yet");
            default:
                throw new Error(`Unsupported file type: ${turingMachine.type}`);
        }
    }

    static getSample(fileMap: { fileName: string, fileType: string, filePath: string, sample?: any }[])
        : { fileName: string, fileType: string, filePath: string, sample?: any }[] {

        const completedMap = fileMap.map((fileData: { fileName: string, fileType: string, filePath: string, sample?: any }) => {
            let temp

            switch (fileData.fileType) {
                case "csv":
                    temp = new CSVSampler(fileData.filePath);
                    break;
                case "xls":
                    throw new Error("XLS Converter not implemented yet");
                case "xlsx":
                    throw new Error("XLSX Converter not implemented yet");
                case "sql":
                    throw new Error("SQL Converter not implemented yet");
                case "pgsql":
                    throw new Error("PostgreSQL Converter not implemented yet");
                default:
                    throw new Error(`Sampler Error: Unsupported file type: ${fileMap[0].filePath}`);
            }

            fileData = { ...fileData, sample: temp }

            return fileData
        })
        return completedMap
    }
}
import { Worker } from "worker_threads";
import path, { resolve } from "path";
import { fileURLToPath } from "url";
import TuringMachine from "./utils/turingMachines/basic.turingmachine.js";
import { rejects } from "assert";

class CSVStreamer {
    filePath: string;
    isNode: boolean;
    turingMachine: TuringMachine;

    constructor(filePath: string, turingMachine: TuringMachine) {
        this.filePath = filePath;
        this.isNode = typeof window === "undefined";
        this.turingMachine = turingMachine
    }

    async run(): Promise<any> {

        if (typeof this.filePath !== "string") throw new Error("Expected file path in Node.js");

        return new Promise((resolve, reject) => {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const worker = new Worker(path.resolve(__dirname, "workers/csv.worker.turing.js"), {
                workerData: { filePath: this.filePath, fnString: this.turingMachine?.turingFunction?.toString() }
            });

            worker.on("message", (data) => resolve(data));
            worker.on("error", reject);
            worker.on("exit", (code) => {
                if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
            });
        });

    }
}

class CSVSampler {
    file: string;
    isNode: boolean;

    constructor(file: string) {
        this.file = file;
        this.isNode = typeof window === "undefined";
    }

    async run(): Promise<any[]> {

        if (typeof this.file !== "string") throw new Error("Expected file path in Node.js");

        return new Promise((resolve, reject) => {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const worker = new Worker(path.resolve(__dirname, "workers/csv.worker.sample.js"), {
                workerData: { filePath: this.file }
            });

            worker.on("message", (data) => {
                resolve(data)
                worker.terminate();
            });
            worker.on("error",(e)=> {
                reject(e)
                worker.terminate();

            });
            worker.on("exit", (code) => {
                if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
            });
        });
    }
}

class ProfileManager {

    currentProfile: string = ''
    private conversation: object[] = []

    constructor() { }

    setProfile(nextProfile: string) {
        this.currentProfile = nextProfile
        return this
    }

    getProfile() {
        return this.currentProfile
    }

    getConversation() {
        return this.conversation
    }
}


