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
exports.readline = readline = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
// Function to ask questions in the console via readline
function askQuestion(query) {
    console.log("\n");
    return new Promise(resolve => {
        readline.question(query, (answer) => {
            let trimmedAnswer = answer.trim().toLowerCase();
            if (trimmedAnswer.toLowerCase() === "exit") {
                console.log("Exiting...");
                readline.close();
                process.exit(0);
            }
            resolve(trimmedAnswer);
        });
    });
}
// Function to prompt for minification options
async function promptForMinificationOption(varaible, fileType) {
    let prompt = await askQuestion(`Do you want to minify ${fileType} files? (yes/no, default is yes): `);
    if (prompt.toLowerCase() === "no") {
        console.log(`Skipping ${fileType} minification.`);
        varaible = false;
    }
    else {
        console.log(`${fileType} will be minified.`);
        varaible = true;
    }
    return varaible;
}
// Function to find CSS and JS files in the HTML content
async function findFiles(regex, content, type, inputFile) {
    let match;
    let result = [];
    while ((match = regex.exec(content)) !== null) {
        let filePath = match[1];
        if (filePath.startsWith("http"))
            continue; // Skip external links
        console.log(`Found ${type} file: ${filePath}`);
        filePath = path.resolve(path.dirname(inputFile), filePath);
        // Check if the file exists
        if (fs.existsSync(filePath)) {
            result.push(filePath);
        }
        else {
            console.warn(`${type} File not found: ${filePath}`);
            let question = await askQuestion(`Do you want to continue without this ${type} file? (yes/no, default is no): `);
            if (question.toLowerCase() !== "yes") {
                console.log("Exiting...");
                readline.close();
                process.exit(0);
            }
            else {
                console.log(`Continuing without ${type} file: ${filePath}`);
                console.log("\n");
            }
        }
    }
    return result;
}
//# sourceMappingURL=readLine.js.map