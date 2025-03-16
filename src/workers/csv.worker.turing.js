import { parentPort, workerData } from "worker_threads";
import fs from "fs";

const { parse } = await import("fast-csv");

if (!parentPort) {
    console.error("This script must be run as a worker.");
    process.exit(1);
}

const { filePath, fnString } = workerData;
let cleanFnString = fnString
    .replace(/^.*?function\s+turingFunction\(\)\s*{([\s\S]*?)}\s*turingFunction;\s*}.*$/s, 'function turingFunction() {$1}') //lol
    .trim();
console.log('clean function: ', cleanFnString)
const turingFunction = eval(`(${cleanFnString})`);
const response = turingFunction();

fs.createReadStream(filePath)
    .pipe(parse({ headers: true, ignoreEmpty: true }))
    .on("data", (row) => response(row))
    .on("end", () => {
        parentPort.postMessage(response(null, true))
    })
    .on("error", (error) => parentPort.postMessage({ error }));


/* Turing Function example
function turingFunction(turingFunction) {
    const res = []
    //here you are free to add code

    return (row,lastChunk)=>{
        if(lastChunk) return res

        //here you are free to add code
        //never return bullshit, always see the bigger picture


    }
}
*/