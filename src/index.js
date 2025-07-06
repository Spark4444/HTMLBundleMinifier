let readline = require("readline");
let fs = require("fs");
let path = require("path");


readline = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Function to ask questions in the console via readline
function askQuestion(query) {
    return new Promise(resolve => {
        readline.question(query, answer => {
            if (answer.toLowerCase() === "exit") {
                console.log("Exiting...");
                readline.close();
                process.exit(0);
            }
            resolve(answer);
        });
    });
}

// Function to find CSS and JS files in the HTML content
async function findFiles(regex, content, fileList, type, inputFile) {
        let match;
        while ((match = regex.exec(content)) !== null) {
            let filePath = match[1];

            if (filePath.startsWith("http")) continue; // Skip external links

            console.log(`Found ${type} file: ${filePath}`);
            filePath = path.resolve(path.dirname(inputFile), filePath);
            
            // Check if the file exists
            if (fs.existsSync(filePath)) {
                fileList.push(filePath);
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

        return fileList;
}

// Function to merge the content of multiple files into a single string
// For the js and css files
function mergeFiles(fileList) {
    let mergedContent = "";
    for (const file of fileList) {
        try {
            const content = fs.readFileSync(file, "utf8");
            mergedContent += content + "\n"; // Add a newline for separation
        } catch (error) {
            console.error(`Error reading file ${file}:`, error);
        }
    }
    return mergedContent;
}

// Main function to handle the minification process
async function main() {
    let running = true;
    let welcomeMessage = true;
    while (running) {
        if (welcomeMessage) {
            console.log("Welcome to the HTML Bundle Minifier! \n This tool will minify your HTML files along with their related CSS and JS files. \n You can exit at any time by typing 'exit'.");
        }
        let inputFile = await askQuestion("Enter the path to the HTML file: ");
        let outputFile = await askQuestion("Enter the path to save the minified HTML file (leave empty for default 'filename.min.html'): ");

        // Check if the input file exists and prompt for a valid path if it doesn't
        while (!fs.existsSync(inputFile)) {
            console.error(`Input file does not exist: ${inputFile}`);
            inputFile = await askQuestion("Please enter a valid path to the HTML file (hint enter 'exit' to quit): ");
        }

        // Check if the output file is a valid path and ends with .html and prompt for a valid path if it doesn't or
        while (!outputFile.endsWith(".html") && outputFile !== "") {
            console.error(`Output file must be an HTML file: ${outputFile}`);
            outputFile = await askQuestion("Please enter a valid path to save the minified HTML file (hint enter 'exit' to quit): ");
        }

        // If no output file is specified, use the default name
        if (outputFile === "") {
            outputFile = path.basename(inputFile, path.extname(inputFile)) + ".min.html";
            outputFile = path.resolve(path.dirname(inputFile), outputFile);
            console.log(`No output file specified. Using default: ${outputFile}`);
        }

        // Read the input file
        let htmlContent = fs.readFileSync(inputFile, "utf8");

        // Find related CSS and JS files
        let cssFiles = [];
        let jsFiles = [];
        const { cssRegex, jsRegex } = require("./regex.js");

        cssFiles = await findFiles(cssRegex, htmlContent, cssFiles, "CSS", inputFile);
        jsFiles = await findFiles(jsRegex, htmlContent, jsFiles, "JS", inputFile);

        // Minify CSS files
        const compiledCSS = mergeFiles(cssFiles);

        // Minify JS files
        const compiledJS = mergeFiles(jsFiles);

        // Minify HTML
        const minifyHTML = require("./minifyHTML.js");
        await minifyHTML(htmlContent, compiledCSS, compiledJS, outputFile);
        console.log("Minification process completed.");

        // Close the readline interface if user wants to exit
        welcomeMessage = false; // Disable welcome message after the first run
        let exitQuestion = await askQuestion("Do you want to exit? (yes/no): ");
        // Exit if the user doesn't exactly type "no" instead of doing it vica versa
        if (exitQuestion.toLowerCase() !== "no") {
            running = false;
            console.log("Exiting...");
            readline.close();
            process.exit(0);
        }
    }
}

main();