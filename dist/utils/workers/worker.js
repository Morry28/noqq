import { parentPort } from "worker_threads";
import launchWork from "../touringMachines";
parentPort?.on("message", async ({ sample, payload, model }) => {
    try {
        const output = await launchWork(sample, payload, model);
        parentPort?.postMessage({ status: "success", output });
    }
    catch (e) {
        parentPort?.postMessage({ status: "failed", error: e });
    }
});
