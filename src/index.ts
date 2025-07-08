// Varable declarations
const fs = require("fs");
const path = require("path");

// imports
import { readline, askQuestion, promptForMinificationOption, findFiles } from "./functions/readLine";
import { minifyHTML, bundleHTML } from "./functions/minifyHTML";
import mergeFiles from "./functions/mergeFiles";
import { cssRegex, jsRegex } from "./regex";


// Options explanation:
// - inputFile: Path to the HTML file to be minified. If not provided, the user will be prompted to enter it.
// - outputFile: Path to save the minified HTML file. If not provided, the user will be prompted to enter it or a default name will be used.
// - minifyCSS: Boolean indicating whether to minify CSS files. Default is true.
// - minifyJS: Boolean indicating whether to minify JS files. Default is true.
// - noPrompts: Boolean indicating whether to skip welcome messages and minification prompts. Default is false. used for CLI.
// - verbose: Boolean indicating whether to log detailed information during the process. Default is true.
// - bundle: Boolean indicating whether to just bundle the CSS and JS files without minification. Default is false.

// Main function to handle the minification process
async function main(inputFile?: string, outputFile?: string, minifyCSS: boolean = true, minifyJS: boolean = true, noPrompts: boolean = false, verbose: boolean = true, bundle: boolean = false): Promise<void> {
    // Main variable declarations
    let running: boolean = true;
    let welcomeMessage: boolean = true;

    while (running) {
        // Disable welcome message if no prompts are required and second run
        if (noPrompts) {
            running = false; 
            welcomeMessage = false;
        }

        // Display welcome message only once on the first run
        if (welcomeMessage) {
            console.log("\nWelcome to the HTML Bundle Minifier! \n This tool will minify your HTML files along with their related CSS and JS files. \n You can exit at any time by typing 'exit'.");
        }


        // If inputFile and outputFile are not provided, prompt the user for them
        if (inputFile === undefined) {
            inputFile = await askQuestion("Enter the path to the HTML file: ");
        }
        else if (verbose) {
            console.log(`\nUsing provided input file: ${inputFile}`);
        }

        let stringInputFile: string = inputFile as string;

        // Check if the input file exists and prompt for a valid path if it doesn't
        while (!fs.existsSync(stringInputFile)) {
            console.error(`Input file does not exist: ${stringInputFile}`);
            stringInputFile = await askQuestion("Please enter a valid path to the HTML file (hint enter 'exit' to quit): ");
        }


        // Prompt for output file if not provided
        if (outputFile === undefined) {
            outputFile = await askQuestion("Enter the path to save the minified HTML file (leave empty for default 'filename.min.html'): ");
        }
        else if (outputFile !== "" && verbose) {
            console.log(`\nUsing provided output file: ${outputFile}`);
        }

        let stringOutputFile: string = outputFile as string;

        // Check if the output file is a valid path and ends with .html and prompt for a valid path if it doesn't
        while (!stringOutputFile.endsWith(".html") && stringOutputFile !== "") {
            console.error(`Output file must be an HTML file: ${stringOutputFile}`);
            stringOutputFile = await askQuestion("Please enter a valid path to save the minified HTML file (hint enter 'exit' to quit or leave empty for default): ");
        }

        // If no output file is specified, use the default name
        if (stringOutputFile === "") {
            stringOutputFile  = path.basename(stringInputFile, path.extname(stringInputFile)) + ".min.html";
            stringOutputFile  = path.resolve(path.dirname(stringInputFile), stringOutputFile);
            verbose && console.log(`No output file specified. Using default: ${stringOutputFile}`);
        }   

        // Prompt for minification options if not running with CLI args
        if (!noPrompts) {
            minifyCSS = await promptForMinificationOption(minifyCSS, "CSS", verbose);
            minifyJS = await promptForMinificationOption(minifyJS, "JS", verbose);
        }

        // Read the input file
        let htmlContent = fs.readFileSync(stringInputFile, "utf8");

        // Find related CSS and JS files
        let cssFiles: string[] = [];
        let jsFiles: string[] = [];
        let compiledCSS: string = "";
        let compiledJS: string = "";

        if (verbose) {
            console.log("\n");
        }

        // Compile CSS and JS files into a single string
        cssFiles = await findFiles(cssRegex, htmlContent, "CSS", stringInputFile, verbose);
        compiledCSS = mergeFiles(cssFiles);

        jsFiles = await findFiles(jsRegex, htmlContent, "JS", stringInputFile, verbose);
        compiledJS = mergeFiles(jsFiles);

        if (compiledCSS || compiledJS && verbose) {
            console.log("\n");
        }

        // Minify HTML
        if (bundle) {
            // If the user specified the --bundle option, bundle the CSS and JS files without minification
            await bundleHTML(stringInputFile, stringOutputFile, compiledCSS, compiledJS, verbose);
        } else {
            // Otherwise, minify the HTML file with the provided options
            await minifyHTML(htmlContent, stringOutputFile, compiledCSS, compiledJS, minifyCSS, minifyJS, verbose);
        }
        verbose && console.log("Minification process completed.");

        welcomeMessage = false; // Disable welcome message after the first run
        
        // If no prompts is set don't ask the user if they want to exit
        if (noPrompts === false) {
            // Close the readline interface if user wants to exit 
            let exitQuestion = await askQuestion("Do you want to exit? (y/n, default is y): ");

            // Exit if the user doesn't exactly type "no" instead of doing it vica versa
            if (exitQuestion !== "n" && exitQuestion !== "no") {
                running = false;
                console.log("Exiting...");
                readline.close();
                process.exit(0);
            }
        }
        else {
            // If no prompts are required, exit after the first run
            running = false;
            console.log("Exiting...");
            readline.close();
            process.exit(0);
        }
    }
}

// Export the main function so it can be used by the CLI
module.exports = main;

// Only run main if this file is executed directly (not when imported)
if (require.main === module) {
    main();
}