import main from "../HTMLBundleMinifier/dist/index.js";
import path from "path";

const __filename = new URL(import.meta.url).pathname;

const inputFile = path.join(__filename, "../index.html");
const outputFile = path.join(__filename, "../index.min.html");

main(inputFile, outputFile, {
    prompts: false
});