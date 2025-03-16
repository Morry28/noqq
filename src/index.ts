
const supportedFileTypes = ["csv", "xls", "xlsx", "sql", "pgsql"]

export default class NOQQ {

    protected openaiApiKey: string;
    public user: ProfileManager;
    public sample: any;
    public serverSideProcessing: boolean;
    private filePath: string = ''

    constructor(
        { openaiApiKey, user = "default", serverSideProcessing = false }:
            { openaiApiKey: string; user: string; serverSideProcessing?: boolean; }) {

        this.openaiApiKey = openaiApiKey;
        this.serverSideProcessing = serverSideProcessing;
        this.user = new ProfileManager().setProfile(user);
    }
    async initFile(filePath: string) {
        this.filePath = filePath
        this.sample = await new FileManager(filePath).sampleFile();

    }
    async query(userQueryText: string) {
        return await this.createResponse(userQueryText)
    }

    private async createResponse(userQueryText: string): Promise<unknown> {

        const turingManager = new TuringMachineManager()
        const turingRes = await turingManager.newWork(userQueryText, this.sample, this.filePath, this.openaiApiKey)


        return turingRes
    }
}

class TuringMachineManager {
    workFileType: string = ''

    constructor() { }

    async newWork(userQueryText: string, sample: any, filePath: string, openaiApiKey: string):Promise<unknown> {

        const fileManager = new FileManager(filePath)
        this.workFileType = fileManager.fileType

        const turingMachine = new TuringMachine(userQueryText, sample, this.workFileType, 'basic', openaiApiKey)
        await turingMachine.createNewFunction()

        const res = await fileManager.applyTuringFunction(turingMachine)
        return res
    }



}

class FileManager {
    filePath: string;
    isNode: boolean;
    fileType: string;

    constructor(filePath: string) {
        this.filePath = filePath;
        this.isNode = typeof window === "undefined";
        this.fileType = this.getFileType(filePath);

        if (!supportedFileTypes.includes(this.fileType)) {
            throw new Error(`Invalid File type: ${this.fileType}. Supported types: ${supportedFileTypes.join(", ")}`);
        }
    }

    private getFileType(filePath: string): string {
        if (typeof filePath === "string") {
            console.log('getFiletype : ', typeof filePath, filePath)
            return filePath.split(".").pop()?.toLowerCase() || "";
        } else {
            throw Error(`Error:File path is expected string, received ${typeof filePath}. NOQQ package can be used only in node.js enviroment (backend)`)
        }
    }

    async applyTuringFunction(turingMachine: TuringMachine):Promise<string> {
        const machine = FileConverterFactory.getStream(turingMachine, this.filePath)
        const res = await machine.run()
        return res

    }

    async sampleFile(): Promise<any[]> {
        return FileConverterFactory.getSample(this.filePath, this.fileType).run();
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

    static getSample(file: string, type: string) {
        switch (type) {
            case "csv":
                return new CSVSampler(file);
            case "xls":
                throw new Error("XLS Converter not implemented yet");
            case "xlsx":
                throw new Error("XLSX Converter not implemented yet");
            case "sql":
                throw new Error("SQL Converter not implemented yet");
            case "pgsql":
                throw new Error("PostgreSQL Converter not implemented yet");
            default:
                throw new Error(`Unsupported file type: ${type}`);
        }
    }
}
import { Worker } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";
import TuringMachine from "./utils/turingMachines/basic.turingmachine.js";

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
        console.log('We got into run() end of flow')

        if (typeof this.filePath !== "string") throw new Error("Expected file path in Node.js");

        return new Promise((resolve, reject) => {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const worker = new Worker(path.resolve(__dirname, "workers/csv.worker.turing.js"), {
                workerData: { filePath: this.filePath, fnString : this.turingMachine?.turingFunction?.toString() }
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
            const worker = new Worker(path.resolve(__dirname, "workers/csv.sample.worker.js"), {
                workerData: { filePath: this.file }
            });

            worker.on("message", (data) => resolve(data));
            worker.on("error", reject);
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


