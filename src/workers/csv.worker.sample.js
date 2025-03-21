import { parentPort, workerData } from "worker_threads";
import fs from "fs";

const { parse } = await import("fast-csv");

if (!parentPort) {
    throw new Error("This script must be run as a worker.");

}

const { filePath } = workerData;

fs.createReadStream(filePath)
    .pipe(parse({ headers: true, ignoreEmpty: true }))
    .on("data", (row) => {
        parentPort.postMessage(Object.keys(row));
        stream.destroy()
    })
    .on("error", (error) => parentPort.postMessage({ error }))
