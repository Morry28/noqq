const supportedFileTypes = ["csv", "xls", "xlsx", "sql", "pgsql"];
export default class NOQQ {
    constructor({ openaiApiKey, user = "default", serverSideProcessing = false }) {
        this.filePath = '';
        this.openaiApiKey = openaiApiKey;
        this.serverSideProcessing = serverSideProcessing;
        this.user = new ProfileManager().setProfile(user);
    }
    async initFile(filePath) {
        this.filePath = filePath;
        this.sample = await new FileManager(filePath).sampleFile();
    }
    async query(userQueryText) {
        return await this.createResponse(userQueryText);
    }
    async createResponse(userQueryText) {
        const turingManager = new TuringMachineManager();
        const turingRes = await turingManager.newWork(userQueryText, this.sample, this.filePath, this.openaiApiKey);
        return turingRes;
    }
}
class TuringMachineManager {
    constructor() {
        this.workFileType = '';
    }
    async newWork(userQueryText, sample, filePath, openaiApiKey) {
        const fileManager = new FileManager(filePath);
        this.workFileType = fileManager.fileType;
        const turingMachine = new TuringMachine(userQueryText, sample, this.workFileType, 'basic', openaiApiKey);
        await turingMachine.createNewFunction();
        const res = await fileManager.applyTuringFunction(turingMachine);
        return res;
    }
}
class FileManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.isNode = typeof window === "undefined";
        this.fileType = this.getFileType(filePath);
        if (!supportedFileTypes.includes(this.fileType)) {
            throw new Error(`Invalid File type: ${this.fileType}. Supported types: ${supportedFileTypes.join(", ")}`);
        }
    }
    getFileType(filePath) {
        if (typeof filePath === "string") {
            console.log('getFiletype : ', typeof filePath, filePath);
            return filePath.split(".").pop()?.toLowerCase() || "";
        }
        else {
            throw Error(`Error:File path is expected string, received ${typeof filePath}. NOQQ package can be used only in node.js enviroment (backend)`);
        }
    }
    async applyTuringFunction(turingMachine) {
        const machine = FileConverterFactory.getStream(turingMachine, this.filePath);
        const res = await machine.run();
        return res;
    }
    async sampleFile() {
        return FileConverterFactory.getSample(this.filePath, this.fileType).run();
    }
}
class FileConverterFactory {
    static getStream(turingMachine, filePath) {
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
    static getSample(file, type) {
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
    constructor(filePath, turingMachine) {
        this.filePath = filePath;
        this.isNode = typeof window === "undefined";
        this.turingMachine = turingMachine;
    }
    async run() {
        console.log('We got into run() end of flow');
        if (typeof this.filePath !== "string")
            throw new Error("Expected file path in Node.js");
        return new Promise((resolve, reject) => {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const worker = new Worker(path.resolve(__dirname, "workers/csv.worker.turing.js"), {
                workerData: { filePath: this.filePath, fnString: this.turingMachine?.turingFunction?.toString() }
            });
            worker.on("message", (data) => resolve(data));
            worker.on("error", reject);
            worker.on("exit", (code) => {
                if (code !== 0)
                    reject(new Error(`Worker stopped with exit code ${code}`));
            });
        });
    }
}
class CSVSampler {
    constructor(file) {
        this.file = file;
        this.isNode = typeof window === "undefined";
    }
    async run() {
        if (typeof this.file !== "string")
            throw new Error("Expected file path in Node.js");
        return new Promise((resolve, reject) => {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const worker = new Worker(path.resolve(__dirname, "workers/csv.sample.worker.js"), {
                workerData: { filePath: this.file }
            });
            worker.on("message", (data) => resolve(data));
            worker.on("error", reject);
            worker.on("exit", (code) => {
                if (code !== 0)
                    reject(new Error(`Worker stopped with exit code ${code}`));
            });
        });
    }
}
class ProfileManager {
    constructor() {
        this.currentProfile = '';
        this.conversation = [];
    }
    setProfile(nextProfile) {
        this.currentProfile = nextProfile;
        return this;
    }
    getProfile() {
        return this.currentProfile;
    }
    getConversation() {
        return this.conversation;
    }
}
