#!/usr/bin/env node
"use strict";
const path = require("path");
// Import the main function from the index file
const main = require(path.join(__dirname, "../", "index"));
// CLI arguments
const args = process.argv.slice(2);
const version = require("../../package.json").version;
// Options example: html-bundle-minifier input.html output.min.html --no-css --no-js
function parseOptions(args) {
    let optionList = [
        "--help",
        "--version",
        "--no-css",
        "--no-js",
        "--input",
        "--output",
        // Small versions of the options
        "-h", // --help
        "-v", // --version
        "-c", // --no-css
        "-j", // --no-js
        "-i", // --input
        "-o" // --output
    ];
    // Function to check if an argument is an option
    function isAnOption(arg) {
        return optionList.includes(arg);
    }
    // If no arguments are provided run the cli with prompts
    if (args.length === 0) {
        main().catch((error) => {
            console.error("An error occurred:", error);
            process.exit(1);
        });
    }
    else {
        // If the user requested help or version, show it and exit and ignore the rest of the options
        //  help is the most important one then version and then the actual functionality
        if (args.includes("--help") || args.includes("-h")) {
            console.log(`Usage: html-bundle-minifier [options] <inputFile> <outputFile>
If nothing is specified you will be prompted for the input and output files and the minification options.
Options:
--help, -h          Show this help message
--version, -v       Show the version of the HTML Bundle Minifier
--no-css, -c        Do not minify CSS files
--no-js, -j         Do not minify JS files
--input, -i         Specify the input HTML file (default: prompt)
--output, -o        Specify the output HTML file (default: <inputFile>.min.html)
Examples:
html-bundle-minifier input.html output.min.html --no-css --no-js
html-bundle-minifier -i src/index.html -o dist/index.html --no-css
html-bundle-minifier --config minify.config.js`);
            process.exit(0);
        }
        else if (args.includes("--version") || args.includes("-v")) {
            console.log(version);
            process.exit(0);
        }
        else {
            // Default values for input and output files
            let inputFile = undefined;
            let outputFile = undefined;
            let minifyCSS = true;
            let minifyJS = true;
            let invalidOptions = [];
            // Check for invalid options/non-existing options
            args.forEach((arg, index) => {
                // Check if the argument is an option
                if (!isAnOption(arg)) {
                    // Check if the argument before is an I/O option
                    // List of i/o options
                    let IO_Options = ["--input", "-i", "--output", "-o"];
                    if (IO_Options.includes(args[index - 1])) {
                        // If the argument is not an option and the previous one is an i/o option, it's valid
                        return;
                    }
                    else {
                        // If the argument is not an option and the previous one is not an i/o option, it's invalid
                        invalidOptions.push(arg);
                    }
                }
            });
            // If there are invalid options, show an error message displaying all the invalid options and exit
            if (invalidOptions.length > 0) {
                if (invalidOptions.length === 1) {
                    console.error(`Invalid option: ${invalidOptions[0]}`);
                }
                else {
                    console.error(`Invalid options: ${invalidOptions.join(", ")}`);
                }
                console.error("Use --help or -h to see the available options.");
                process.exit(1);
            }
            // Parse the arguments
            args.forEach((arg, index) => {
                if (arg === "--no-css" || arg === "-c") {
                    minifyCSS = false;
                }
                else if (arg === "--no-js" || arg === "-j") {
                    minifyJS = false;
                }
                else if (arg === "--input" || arg === "-i") {
                    // Basic error checking for input file
                    if (isAnOption(args[index + 1]) || !args[index + 1]) {
                        console.error(`Input file must be specified after ${arg}`);
                        process.exit(1);
                    }
                    else {
                        inputFile = args[index + 1];
                    }
                }
                else if (arg === "--output" || arg === "-o") {
                    // Basic error checking for output file
                    if (isAnOption(args[index + 1]) || !args[index + 1]) {
                        console.error(`Output file must be specified after ${arg}`);
                        process.exit(1);
                    }
                    else {
                        outputFile = args[index + 1];
                    }
                }
            });
            // If input file is not provided warn the user
            if (!inputFile) {
                console.warn("Input file wasn't specified, you will be prompted for it.\n if you want to specify it, use the --input or -i option.");
            }
            // If output file is not provided warn the user
            if (!outputFile) {
                console.warn("Output file wasn't specified, you will be prompted for it.\n if you want to specify it, use the --output or -o option.");
            }
            // Call the main function with the parsed options
            main(inputFile, outputFile, minifyCSS, minifyJS, true).catch((error) => {
                console.error("An error occurred:", error);
                process.exit(1);
            });
        }
    }
}
// Call the parseOptions function
parseOptions(args);
//# sourceMappingURL=cli.js.map