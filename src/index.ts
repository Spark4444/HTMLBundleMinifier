// Varable declarations
const fs = require("fs");
const path = require("path");

// imports
import { readline, askQuestion, promptForMinificationOption, findFiles } from "./functions/readLine";
import minifyHTML from "./functions/minifyHTML";
import mergeFiles from "./functions/mergeFiles";
import { cssRegex, jsRegex } from "./regex";


// Main function to handle the minification process
async function main(inputFile?: string, outputFile?: string, minifyCSS: boolean = true, minifyJS: boolean = true, cli: boolean = false) {
    // Main variable declarations
    let running: boolean = true;
    let welcomeMessage: boolean = true;

    while (running) {
        // Display welcome message only once on the first run
        if (welcomeMessage) {
            console.log("Welcome to the HTML Bundle Minifier! \n This tool will minify your HTML files along with their related CSS and JS files. \n You can exit at any time by typing 'exit'.");
        }


        // If inputFile and outputFile are not provided, ask the user for them without errors
        if (inputFile === undefined) {
            inputFile = await askQuestion("Enter the path to the HTML file: ");
        }

        let stringInputFile: string = inputFile as string;

        // Check if the input file exists and prompt for a valid path if it doesn't
        while (!fs.existsSync(stringInputFile)) {
            console.error(`Input file does not exist: ${stringInputFile}`);
            stringInputFile = await askQuestion("Please enter a valid path to the HTML file (hint enter 'exit' to quit): ");
        }


        if (outputFile === undefined) {
            outputFile = await askQuestion("Enter the path to save the minified HTML file (leave empty for default 'filename.min.html'): ");
        }

        let stringOutputFile: string = outputFile as string;

        // Check if the output file is a valid path and ends with .html and prompt for a valid path if it doesn't
        while (!stringOutputFile.endsWith(".html") && stringOutputFile !== "") {
            console.error(`Output file must be an HTML file: ${stringOutputFile}`);
            stringOutputFile = await askQuestion("Please enter a valid path to save the minified HTML file (hint enter 'exit' to quit): ");
        }

        // If no output file is specified, use the default name
        if (stringOutputFile === "") {
            stringOutputFile  = path.basename(stringInputFile, path.extname(stringInputFile)) + ".min.html";
            stringOutputFile  = path.resolve(path.dirname(stringInputFile), stringOutputFile);
            console.log(`No output file specified. Using default: ${stringOutputFile}`);
        }   

        // Prompt for minification options if not running with CLI args
        if (!cli) {
            minifyCSS = await promptForMinificationOption(minifyCSS, "CSS");
            minifyJS = await promptForMinificationOption(minifyJS, "JS");
        }

        // Read the input file
        let htmlContent = fs.readFileSync(stringInputFile, "utf8");

        // Find related CSS and JS files
        let cssFiles: string[] = [];
        let jsFiles: string[] = [];
        let compiledCSS: string | false = "";
        let compiledJS: string | false = "";

        console.log("\n");

        // Compile CSS and JS files if minification is enabled
        if (minifyCSS) {
            cssFiles = await findFiles(cssRegex, htmlContent, "CSS", stringInputFile);
            compiledCSS = mergeFiles(cssFiles);
        }
        else {
            compiledCSS = false;
        }

        if (minifyJS) {
            jsFiles = await findFiles(jsRegex, htmlContent, "JS", stringInputFile);
            compiledJS = mergeFiles(jsFiles);
        } 
        else {
            compiledJS = false;
        }

        if (compiledCSS || compiledJS) {
            console.log("\n");
        }

        // Minify HTML
        await minifyHTML(htmlContent, stringOutputFile, compiledCSS, compiledJS);
        console.log("Minification process completed.");

        // Close the readline interface if user wants to exit
        welcomeMessage = false; // Disable welcome message after the first run
        
        let exitQuestion = await askQuestion("Do you want to exit? (yes/no, default is yes): ");

        // Exit if the user doesn't exactly type "no" instead of doing it vica versa
        if (exitQuestion.toLowerCase() !== "no") {
            running = false;
            console.log("Exiting...");
            readline.close();
            process.exit(0);
        }
    }
}

// Export the main function so it can be used by the CLI
module.exports = { main };

// Only run main if this file is executed directly (not when imported)
if (require.main === module) {
    main();
}