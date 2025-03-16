import { parentPort, workerData } from "worker_threads";
import fs from "fs";

// Dynamically import fast-csv to work in ES module mode
const { parse } = await import("fast-csv");

if (!parentPort) {
    throw new Error("This script must be run as a worker.");

}

const { filePath } = workerData;
const results = [];

fs.createReadStream(filePath)
    .pipe(parse({ headers: true, ignoreEmpty: true }))
    .on("data", (row) => results.push(row))
    .on("end", () => parentPort.postMessage(results))
    .on("error", (error) => parentPort.postMessage({ error }));
