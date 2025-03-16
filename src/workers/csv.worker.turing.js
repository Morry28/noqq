import { parentPort, workerData } from "worker_threads";
import fs from "fs";
const { parse } = await import("fast-csv");

if (!parentPort) throw new Error("This script must be run as a worker.");

const { filePath, fnString } = workerData;

const extractFunction = (str) => {
    const match = str.match(/function\s+turingFunction\(\)\s*{([\s\S]*?)\n}/);
    if (!match) throw new Error("Could not find a valid turingFunction definition!");
    return `function turingFunction() {${match[1]}\n}`;
};

const cleanFnString = extractFunction(fnString);

let extractedFunction;
try {
    extractedFunction = new Function(`${cleanFnString} return turingFunction;`)();
    if (typeof extractedFunction !== "function") {
        throw new Error("The extracted `turingFunction` is not a valid function.");
    }
} catch (error) {
    console.error("Eval failed:", error.message);
    parentPort.postMessage({ error: error.message });
    process.exit(1);
}

const response = extractedFunction();
if (typeof response !== "function") {
    console.error("The returned function from `turingFunction()` is invalid.");
    parentPort.postMessage({ error: "Returned function is invalid." });
    process.exit(1);
}

fs.createReadStream(filePath)
    .pipe(parse({ headers: true, ignoreEmpty: true }))
    .on("data", (row) => response(row))
    .on("end", () => {
        parentPort.postMessage(response(null, true));
    })
    .on("error", (error) => parentPort.postMessage({ error }));
