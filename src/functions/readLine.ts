let readline = require("readline");
const fs = require("fs");
const path = require("path");

readline = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Function to ask questions in the console via readline
function askQuestion(query: string): Promise<string> {
    console.log("\n");
    return new Promise(resolve => {
        readline.question(query, (answer: string) => {
            let trimmedAnswer: string = answer.trim().toLowerCase();
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
async function promptForMinificationOption(varaible: boolean, fileType: string): Promise<boolean> {
    let prompt: string = await askQuestion(`Do you want to minify ${fileType} files? (yes/no, default is yes): `);
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
async function findFiles(regex: RegExp, content: string, type: string, inputFile: string): Promise<string[]> {
        let match;
        let result: string[] = [];
        while ((match = regex.exec(content)) !== null) {
            let filePath = match[1];

            if (filePath.startsWith("http")) continue; // Skip external links

            console.log(`Found ${type} file: ${filePath}`);
            filePath = path.resolve(path.dirname(inputFile), filePath);
            
            // Check if the file exists
            if (fs.existsSync(filePath)) {
                result.push(filePath);
            } 
            else {
                console.warn(`${type} File not found: ${filePath}`);
                let question = await askQuestion(`Do you want to continue without this ${type} file? (yes/no): `);
                if (question.toLowerCase() !== "yes") {
                    console.log("Exiting...");
                    readline.close();
                    process.exit(0);
                }
            }
        }

        return result;
}

export { readline, askQuestion, promptForMinificationOption, findFiles };