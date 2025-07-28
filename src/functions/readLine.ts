import readline from "readline";
import fs from "fs";
import path from "path";
import { log, warning, success } from "./colors";
import { linkRegex, scriptRegex,  styleRegex, inlineScriptRegex } from "../data/regex";
import { FileItem } from "../data/interfaces";

const rs = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Function to ask questions in the console via readline
function askQuestion(query: string): Promise<string> {
    log("\n");
    return new Promise(resolve => {
        rs.question(query, (answer: string) => {
            let trimmedAnswer: string = answer.trim().toLowerCase();
            if (trimmedAnswer.toLowerCase() === "exit") {
                log("Exiting...");
                rs.close();
                process.exit(0);
            }
            resolve(trimmedAnswer);
        });
    });
}

// Function to prompt for minification options
async function promptForMinificationOption(varaible: boolean, fileType: string, verbose: boolean): Promise<boolean> {
    let prompt: string = await askQuestion(`Do you want to minify ${fileType} files? (y/n, default is y): `);
    if (prompt === "n" || prompt === "no") {
        verbose && success(`Skipping ${fileType} minification.`);
        varaible = false;
    }
    else {
        verbose && success(`${fileType} will be minified.`);
        varaible = true;
    }
    return varaible;
}

// Function to find CSS and JS files in the HTML content
async function findFiles(content: string, type: string, inputFile: string, verbose: boolean): Promise<FileItem[]> {
        let match;
        let result: FileItem[] = [];
        let srcRegex = type === "CSS" ? linkRegex : scriptRegex;
        let contentRegex = type === "CSS" ? styleRegex : inlineScriptRegex;

        while ((match = srcRegex.exec(content)) !== null) {
            let filePath = match[1];

            if (filePath.startsWith("http")) continue; // Skip external links

            verbose && success(`Found ${type} file: ${filePath}`);
            filePath = path.resolve(path.dirname(inputFile), filePath);
            
            // Check if the file exists
            if (fs.existsSync(filePath)) {
                result.push({
                    type: "path",
                    content: filePath
                });
            } 
            else {
                // If the file does not exist, warn the user and continue
                warning(`\nWarning: File ${filePath} does not exist, continuing without it.\n`);
            }
        }

        // Find inline CSS or JS content
        while ((match = contentRegex.exec(content)) !== null) {
            let inlineContent = match[1];
            if (inlineContent.trim()) {
                verbose && success(`Found inline ${type} content.`);
            }
            result.push({
                type: "inline",
                content: inlineContent
            });
        }

        return result;
}

export { rs, askQuestion, promptForMinificationOption, findFiles };