// Imports for the main
import fs from "fs";
import path from "path";

// Functions and regex imports
import { rs, askQuestion, promptForMinificationOption, findFiles } from "./functions/readLine.js";
import minifyHTML from "./functions/minifyHTML.js";
import bundleHTML from "./functions/bundleHTML.js";
import mergeFiles from "./functions/mergeFiles.js";
import { log, error, success } from "./functions/colors.js";

import { JSDOM, VirtualConsole} from "jsdom";

// Interfaces declaration
interface FileItem {
    type: "inline" | "path";
    content: string;
}

import { Options, MinifierOptions, BundlerOptions } from "./data/interfaces.js";

// Main function to handle the minification process
export default async function main(inputFile?: string, outputFile?: string, options: Options = {}): Promise<void> {
    let {
        minifyCSS = true,
        minifyJS = true,
        prompts = true,
        verbose = true,
        bundle = false,
        welcomeMessage = true,
        mangle = true,
        removeComments = true,
        removeConsole = true,
        prettify = true,
        whitespaces = true
    } = options;

    // Disable welcome message if no prompts are required and second run
    if (!prompts) {
        welcomeMessage = false;
    }

    // Display welcome message only once on the first run
    if (welcomeMessage) {
        log("\nWelcome to the HTML Bundle Minifier! \n This tool will minify your HTML files along with their related CSS and JS files. \n You can exit at any time by typing 'exit'.");
    }


    // If inputFile and outputFile are not provided, prompt the user for them
    if (inputFile === undefined) {
        inputFile = await askQuestion("Enter the path to the HTML file: ");
    }
    else if (verbose) {
        success(`\nUsing provided input file: ${inputFile}`);
    }

    let stringInputFile: string = inputFile as string;

    // Check if the input file exists and prompt for a valid path if it doesn't
    while (!fs.existsSync(stringInputFile) || !stringInputFile.endsWith(".html")) {
        error(`Input file does not exist/is not valid: ${stringInputFile}`);
        stringInputFile = await askQuestion("Please enter a valid path to the HTML file (hint enter 'exit' to quit): ");
    }
    verbose && success(`Input file exists: ${stringInputFile}`);


    // Prompt for output file if not provided
    if (outputFile === undefined) {
        outputFile = await askQuestion("Enter the path to save the minified HTML file (leave empty for default 'filename.min.html'): ");
    }
    else if (outputFile !== "" && verbose) {
        success(`\nUsing provided output file: ${outputFile}`);
    }

    let stringOutputFile: string = outputFile as string;

    // Check if the output file is a valid path and ends with .html and prompt for a valid path if it doesn't
    while (!stringOutputFile.endsWith(".html") && stringOutputFile !== "") {
        error(`Output file must be an HTML file: ${stringOutputFile}`);
        stringOutputFile = await askQuestion("Please enter a valid path to save the minified HTML file (hint enter 'exit' to quit or leave empty for default): ");
    }

    // If no output file is specified, use the default name
    if (stringOutputFile === "") {
        stringOutputFile  = path.basename(stringInputFile, path.extname(stringInputFile)) + ".min.html";
        stringOutputFile  = path.resolve(path.dirname(stringInputFile), stringOutputFile);
        verbose && success(`No output file specified. Using default: ${stringOutputFile}`);
    }
    else if (verbose) {
        success(`Output file is valid: ${stringOutputFile}`);
    }

    // Prompt for minification options if not running with CLI args
    if (prompts) {
        minifyCSS = await promptForMinificationOption(minifyCSS, "CSS", verbose);
        minifyJS = await promptForMinificationOption(minifyJS, "JS", verbose);
    }

    // Read the input file
    let htmlContent = fs.readFileSync(stringInputFile, "utf8");

    // Find related CSS and JS files
    let cssFiles: FileItem[] = [];
    let jsFiles: FileItem[] = [];
    let compiledCSS: string = "";
    let compiledJS: string = "";

    verbose && log("\n");

    const virtualConsole = new VirtualConsole();
    virtualConsole.on("error", (msg) => {
        // Suppress jsdom errors
    });

    const dom = new JSDOM(htmlContent, { virtualConsole });

    // Compile CSS and JS files into a single string
    cssFiles = await findFiles(htmlContent, "CSS", stringInputFile, dom, verbose);
    compiledCSS = mergeFiles(cssFiles, "CSS", inputFile, verbose);

    verbose && log("\n");

    jsFiles = await findFiles(htmlContent, "JS", stringInputFile, dom, verbose);
    compiledJS = mergeFiles(jsFiles, "JS", inputFile, verbose);

    if ((compiledCSS || compiledJS) && verbose) {
        log("\n");
    }

    // Minify HTML
    if (bundle) {
        // If the user specified the --bundle option, bundle the CSS and JS files without minification
        const bundlerOptions: BundlerOptions = {
            prettify,
            verbose
        };
        await bundleHTML(stringInputFile, stringOutputFile, compiledCSS, compiledJS, dom, bundlerOptions);
    } else {
        // Otherwise, minify the HTML file with the provided options
        const minifierOptions: MinifierOptions = {
            minifyCSS,
            minifyJS,
            verbose,
            mangle,
            removeComments,
            removeConsole,
            whitespaces
        };
        await minifyHTML(htmlContent, stringOutputFile, compiledCSS, compiledJS, dom, minifierOptions);
    }
    verbose && success("Minification process completed.");

    welcomeMessage = false; // Disable welcome message after the first run
    
    // If no prompts is set don't ask the user if they want to exit
    if (prompts) {
        // Close the readline interface if user wants to exit
        let exitQuestion = await askQuestion("Do you want to exit? (y/n, default is y): ");

        // Exit if the user doesn't exactly type "no" instead of doing it vica versa
        if (exitQuestion !== "n" && exitQuestion !== "no") {
            log("Exiting...");
            rs.close();
            process.exit(0);
        }
        else {
            // Run the main function again
            main();
        }
    }
    else {
        // If no prompts are required, exit after the first run
        log("\nExiting...");
        rs.close();
        process.exit(0);
    }
}