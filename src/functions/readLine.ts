import readline from "readline";
import fs from "fs";
import path from "path";
import { log, warning, success } from "./colors";

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
async function findFiles(regex: RegExp, content: string, type: string, inputFile: string, verbose: boolean, noPrompts: boolean): Promise<string[]> {
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
            else if (!noPrompts) {
                !verbose && !noPrompts && log("\n");
                warning(`${type} File not found: ${filePath}`);
                let question = await askQuestion(`Do you want to continue without this ${type} file? (y/n, default is n): `);
                if (question !== "yes" && question !== "y") {
                    log("Exiting...");
                    rs.close();
                    process.exit(0);
                }
                else {
                    verbose && success(`Continuing without ${type} file: ${filePath}`);
                }
            }
            else if (noPrompts) {
                !verbose && log("\n");
                // Show a different warning if no prompts are enabled without asking the user to continue
                warning(`File ${filePath} does not exist, continuing without it. \n If you want to configure this behavior use the -f or --full-prompt flags when running the CLI.`);
                !verbose && log("\n");
            }
        }

        return result;
}

export { rs, askQuestion, promptForMinificationOption, findFiles };