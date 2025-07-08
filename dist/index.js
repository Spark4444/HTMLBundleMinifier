"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Varable declarations
const fs = require("fs");
const path = require("path");
// imports
const readLine_1 = require("./functions/readLine");
const minifyHTML_1 = require("./functions/minifyHTML");
const mergeFiles_1 = __importDefault(require("./functions/mergeFiles"));
const regex_1 = require("./regex");
const colors_1 = require("./functions/colors");
// Options explanation:
// 1. inputFile: Path to the HTML file to be minified. If not provided, the user will be prompted to enter it.
// 2. outputFile: Path to save the minified HTML file. If not provided, the user will be prompted to enter it or a default name will be used.
// 3. minifyCSS: Boolean indicating whether to minify CSS files. Default is true.
// 4. minifyJS: Boolean indicating whether to minify JS files. Default is true.
// 5. noPrompts: Boolean indicating whether to skip welcome messages and minification prompts. Default is false. used for CLI.
// 6. verbose: Boolean indicating whether to log detailed information during the process. Default is true.
// 7. bundle: Boolean indicating whether to just bundle the CSS and JS files without minification. Default is false.
// 8. welcomeMessage: Boolean indicating whether to display a welcome message. Default is true. used for second run.
// Main function to handle the minification process
async function main(inputFile, outputFile, minifyCSS = true, minifyJS = true, noPrompts = false, verbose = true, bundle = false, welcomeMessage = true) {
    // Disable welcome message if no prompts are required and second run
    if (noPrompts) {
        welcomeMessage = false;
    }
    // Display welcome message only once on the first run
    if (welcomeMessage) {
        (0, colors_1.log)("\nWelcome to the HTML Bundle Minifier! \n This tool will minify your HTML files along with their related CSS and JS files. \n You can exit at any time by typing 'exit'.");
    }
    // If inputFile and outputFile are not provided, prompt the user for them
    if (inputFile === undefined) {
        inputFile = await (0, readLine_1.askQuestion)("Enter the path to the HTML file: ");
    }
    else if (verbose) {
        (0, colors_1.success)(`\nUsing provided input file: ${inputFile}`);
    }
    let stringInputFile = inputFile;
    // Check if the input file exists and prompt for a valid path if it doesn't
    while (!fs.existsSync(stringInputFile) || !stringInputFile.endsWith(".html")) {
        (0, colors_1.error)(`Input file does not exist/is not valid: ${stringInputFile}`);
        stringInputFile = await (0, readLine_1.askQuestion)("Please enter a valid path to the HTML file (hint enter 'exit' to quit): ");
    }
    verbose && (0, colors_1.success)(`Input file exists: ${stringInputFile}`);
    // Prompt for output file if not provided
    if (outputFile === undefined) {
        outputFile = await (0, readLine_1.askQuestion)("Enter the path to save the minified HTML file (leave empty for default 'filename.min.html'): ");
    }
    else if (outputFile !== "" && verbose) {
        (0, colors_1.success)(`\nUsing provided output file: ${outputFile}`);
    }
    let stringOutputFile = outputFile;
    // Check if the output file is a valid path and ends with .html and prompt for a valid path if it doesn't
    while (!stringOutputFile.endsWith(".html") && stringOutputFile !== "") {
        (0, colors_1.error)(`Output file must be an HTML file: ${stringOutputFile}`);
        stringOutputFile = await (0, readLine_1.askQuestion)("Please enter a valid path to save the minified HTML file (hint enter 'exit' to quit or leave empty for default): ");
    }
    // If no output file is specified, use the default name
    if (stringOutputFile === "") {
        stringOutputFile = path.basename(stringInputFile, path.extname(stringInputFile)) + ".min.html";
        stringOutputFile = path.resolve(path.dirname(stringInputFile), stringOutputFile);
        verbose && (0, colors_1.success)(`No output file specified. Using default: ${stringOutputFile}`);
    }
    else if (verbose) {
        (0, colors_1.success)(`Output file is valid: ${stringOutputFile}`);
    }
    // Prompt for minification options if not running with CLI args
    if (!noPrompts) {
        minifyCSS = await (0, readLine_1.promptForMinificationOption)(minifyCSS, "CSS", verbose);
        minifyJS = await (0, readLine_1.promptForMinificationOption)(minifyJS, "JS", verbose);
    }
    // Read the input file
    let htmlContent = fs.readFileSync(stringInputFile, "utf8");
    // Find related CSS and JS files
    let cssFiles = [];
    let jsFiles = [];
    let compiledCSS = "";
    let compiledJS = "";
    verbose && (0, colors_1.log)("\n");
    // Compile CSS and JS files into a single string
    cssFiles = await (0, readLine_1.findFiles)(regex_1.cssRegex, htmlContent, "CSS", stringInputFile, verbose);
    compiledCSS = (0, mergeFiles_1.default)(cssFiles);
    jsFiles = await (0, readLine_1.findFiles)(regex_1.jsRegex, htmlContent, "JS", stringInputFile, verbose);
    compiledJS = (0, mergeFiles_1.default)(jsFiles);
    if ((compiledCSS || compiledJS) && verbose) {
        (0, colors_1.log)("\n");
    }
    // Minify HTML
    if (bundle) {
        // If the user specified the --bundle option, bundle the CSS and JS files without minification
        await (0, minifyHTML_1.bundleHTML)(stringInputFile, stringOutputFile, compiledCSS, compiledJS, verbose);
    }
    else {
        // Otherwise, minify the HTML file with the provided options
        await (0, minifyHTML_1.minifyHTML)(htmlContent, stringOutputFile, compiledCSS, compiledJS, minifyCSS, minifyJS, verbose);
    }
    verbose && (0, colors_1.success)("Minification process completed.");
    welcomeMessage = false; // Disable welcome message after the first run
    // If no prompts is set don't ask the user if they want to exit
    if (noPrompts === false) {
        // Close the readline interface if user wants to exit 
        let exitQuestion = await (0, readLine_1.askQuestion)("Do you want to exit? (y/n, default is y): ");
        // Exit if the user doesn't exactly type "no" instead of doing it vica versa
        if (exitQuestion !== "n" && exitQuestion !== "no") {
            (0, colors_1.log)("Exiting...");
            readLine_1.readline.close();
            process.exit(0);
        }
        else {
            // Run the main function again with the same options to allow for another run
            // But this time without the welcome message
            // And also with prompts enabled to prompt for new minification options
            main(undefined, undefined, true, true, false, verbose, false, false);
        }
    }
    else {
        // If no prompts are required, exit after the first run
        (0, colors_1.log)("Exiting...");
        readLine_1.readline.close();
        process.exit(0);
    }
}
// Export the main function so it can be used by the CLI
module.exports = main;
// Only run main if this file is executed directly (not when imported)
if (require.main === module) {
    main();
}
//# sourceMappingURL=index.js.map