let readline = require("readline");
const fs = require("fs");
const path = require("path");
import { log, warning, success } from "./colors";

readline = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Function to ask questions in the console via readline
function askQuestion(query: string): Promise<string> {
    log("\n");
    return new Promise(resolve => {
        readline.question(query, (answer: string) => {
            let trimmedAnswer: string = answer.trim().toLowerCase();
            if (trimmedAnswer.toLowerCase() === "exit") {
                log("Exiting...");
                readline.close();
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
async function findFiles(regex: RegExp, content: string, type: string, inputFile: string, verbose: boolean): Promise<string[]> {
        let match;
        let result: string[] = [];
        while ((match = regex.exec(content)) !== null) {
            let filePath = match[1];

            if (filePath.startsWith("http")) continue; // Skip external links

            verbose && success(`Found ${type} file: ${filePath}`);
            filePath = path.resolve(path.dirname(inputFile), filePath);
            
            // Check if the file exists
            if (fs.existsSync(filePath)) {
                result.push(filePath);
            } 
            else {
                warning(`${type} File not found: ${filePath}`);
                let question = await askQuestion(`Do you want to continue without this ${type} file? (y/n, default is n): `);
                if (question !== "yes" && question !== "y") {
                    log("Exiting...");
                    readline.close();
                    process.exit(0);
                }
                else {
                    log(`Continuing without ${type} file: ${filePath}`);
                    log("\n");
                }
            }
        }

        return result;
}

export { readline, askQuestion, promptForMinificationOption, findFiles };