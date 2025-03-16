import { parentPort, workerData } from "worker_threads";
import fs from "fs";
const { parse } = await import("fast-csv");
if (!parentPort) {
    console.error("This script must be run as a worker.");
    process.exit(1);
}
const { filePath } = workerData;
const results = [];
fs.createReadStream(filePath)
    .pipe(parse({ headers: true, ignoreEmpty: true }))
    .on("data", (row) => results.push(row))
    .on("end", () => parentPort.postMessage(results))
    .on("error", (error) => parentPort.postMessage({ error }));
