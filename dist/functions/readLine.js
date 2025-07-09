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
async function findFiles(regex, content, type, inputFile, verbose, noPrompts) {
    let match;
    let result = [];
    while ((match = regex.exec(content)) !== null) {
        let filePath = match[1];
        if (filePath.startsWith("http"))
            continue; // Skip external links
        verbose && (0, colors_1.success)(`Found ${type} file: ${filePath}`);
        filePath = path_1.default.resolve(path_1.default.dirname(inputFile), filePath);
        // Check if the file exists
        if (fs_1.default.existsSync(filePath)) {
            result.push(filePath);
        }
        else if (!noPrompts) {
            !verbose && !noPrompts && (0, colors_1.log)("\n");
            (0, colors_1.warning)(`${type} File not found: ${filePath}`);
            let question = await askQuestion(`Do you want to continue without this ${type} file? (y/n, default is n): `);
            if (question !== "yes" && question !== "y") {
                (0, colors_1.log)("Exiting...");
                rs.close();
                process.exit(0);
            }
            else {
                verbose && (0, colors_1.success)(`Continuing without ${type} file: ${filePath}`);
            }
        }
        else if (noPrompts) {
            !verbose && (0, colors_1.log)("\n");
            // Show a different warning if no prompts are enabled without asking the user to continue
            (0, colors_1.warning)(`File ${filePath} does not exist, continuing without it. \n If you want to configure this behavior use the -f or --full-prompt flags when running the CLI.`);
            !verbose && (0, colors_1.log)("\n");
        }
    }
    return result;
}
//# sourceMappingURL=readLine.js.map