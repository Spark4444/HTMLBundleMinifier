"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rs = void 0;
exports.askQuestion = askQuestion;
exports.promptForMinificationOption = promptForMinificationOption;
exports.findFiles = findFiles;
const readline_1 = __importDefault(require("readline"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const colors_1 = require("./colors");
const regex_1 = require("../data/regex");
const rs = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
exports.rs = rs;
// Function to ask questions in the console via readline
function askQuestion(query) {
    (0, colors_1.log)("\n");
    return new Promise(resolve => {
        rs.question(query, (answer) => {
            let trimmedAnswer = answer.trim().toLowerCase();
            if (trimmedAnswer.toLowerCase() === "exit") {
                (0, colors_1.log)("Exiting...");
                rs.close();
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
async function findFiles(content, type, inputFile, verbose) {
    let match;
    let result = [];
    let srcRegex = type === "CSS" ? regex_1.linkRegex : regex_1.scriptRegex;
    let contentRegex = type === "CSS" ? regex_1.styleRegex : regex_1.inlineScriptRegex;
    while ((match = srcRegex.exec(content)) !== null) {
        let filePath = match[1];
        if (filePath.startsWith("http"))
            continue; // Skip external links
        verbose && (0, colors_1.success)(`Found ${type} file: ${filePath}`);
        filePath = path_1.default.resolve(path_1.default.dirname(inputFile), filePath);
        // Check if the file exists
        if (fs_1.default.existsSync(filePath)) {
            result.push({
                type: "path",
                content: filePath
            });
        }
        else {
            // If the file does not exist, warn the user and continue
            (0, colors_1.warning)(`\nWarning: File ${filePath} does not exist, continuing without it.\n`);
        }
    }
    // Find inline CSS or JS content
    while ((match = contentRegex.exec(content)) !== null) {
        let inlineContent = match[1];
        if (inlineContent.trim()) {
            verbose && (0, colors_1.success)(`Found inline ${type} content.`);
        }
        result.push({
            type: "inline",
            content: inlineContent
        });
    }
    return result;
}
//# sourceMappingURL=readLine.js.map