import { Worker } from "worker_threads";
import path from "path";
export function runWorker(sample, payload, model) {
    return new Promise((resolve, reject) => {
        const workerPath = path.join(__dirname, "worker.js");
        const worker = new Worker(workerPath);
        worker.postMessage({ sample, payload, model });
        worker.on("message", ({ status, output }) => {
            if (status === "success")
                resolve(output);
            else
                reject(new Error("Worker failed"));
        });
        worker.on("error", (err) => reject(err));
        worker.on("exit", (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}
