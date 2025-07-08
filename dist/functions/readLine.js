"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readline = void 0;
exports.askQuestion = askQuestion;
exports.promptForMinificationOption = promptForMinificationOption;
exports.findFiles = findFiles;
let readline = require("readline");
exports.readline = readline;
const fs = require("fs");
const path = require("path");
const colors_1 = require("./colors");
exports.readline = readline = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
// Function to ask questions in the console via readline
function askQuestion(query) {
    (0, colors_1.log)("\n");
    return new Promise(resolve => {
        readline.question(query, (answer) => {
            let trimmedAnswer = answer.trim().toLowerCase();
            if (trimmedAnswer.toLowerCase() === "exit") {
                (0, colors_1.log)("Exiting...");
                readline.close();
                process.exit(0);
            }
            resolve(trimmedAnswer);
        });
    });
}
// Function to prompt for minification options
async function promptForMinificationOption(varaible, fileType, verbose) {
    let prompt = await askQuestion(`Do you want to minify ${fileType} files? (y/n, default is y): `);
    if (prompt === "n" || prompt === "no") {
        verbose && (0, colors_1.success)(`Skipping ${fileType} minification.`);
        varaible = false;
    }
    else {
        verbose && (0, colors_1.success)(`${fileType} will be minified.`);
        varaible = true;
    }
    return varaible;
}
// Function to find CSS and JS files in the HTML content
async function findFiles(regex, content, type, inputFile, verbose) {
    let match;
    let result = [];
    while ((match = regex.exec(content)) !== null) {
        let filePath = match[1];
        if (filePath.startsWith("http"))
            continue; // Skip external links
        verbose && (0, colors_1.success)(`Found ${type} file: ${filePath}`);
        filePath = path.resolve(path.dirname(inputFile), filePath);
        // Check if the file exists
        if (fs.existsSync(filePath)) {
            result.push(filePath);
        }
        else {
            (0, colors_1.warning)(`${type} File not found: ${filePath}`);
            let question = await askQuestion(`Do you want to continue without this ${type} file? (y/n, default is n): `);
            if (question !== "yes") {
                (0, colors_1.log)("Exiting...");
                readline.close();
                process.exit(0);
            }
            else {
                (0, colors_1.log)(`Continuing without ${type} file: ${filePath}`);
                (0, colors_1.log)("\n");
            }
        }
    }
    return result;
}
//# sourceMappingURL=readLine.js.map