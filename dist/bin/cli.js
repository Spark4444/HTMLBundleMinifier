#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
// Import the main function from the index file
const main = require(path.join(__dirname, "../", "index"));
const colors_1 = require("../functions/colors");
// CLI arguments
const args = process.argv.slice(2);
const version = require("../../package.json").version;
// Options example: html-bundle-minifier -i input.html -o output.min.html --no-css --no-js
// This function parses the command line arguments and options
function parseOptions(args) {
    let optionList = [
        "--help",
        "--version",
        "--no-css",
        "--no-js",
        "--input",
        "--output",
        "--no-verbose",
        "--bundle",
        "--full-prompt",
        // Small versions of the options
        "-h", // --help
        "-v", // --version
        "-c", // --no-css
        "-j", // --no-js
        "-i", // --input
        "-o", // --output
        "-V", // --no-verbose
        "-b", // --bundle
        "-f" // --full-prompt
    ];
    // Function to check if an argument is an option
    function isAnOption(arg) {
        return optionList.includes(arg);
    }
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
            (0, colors_1.error)(`Invalid option: ${invalidOptions[0]}`);
        }
        else {
            (0, colors_1.error)(`Invalid options: ${invalidOptions.join(", ")}`);
        }
        (0, colors_1.error)("Use --help or -h to see the available options.");
        process.exit(1);
    }
    // If no arguments are provided run the cli with prompts
    if (args.length === 0) {
        (0, colors_1.warning)("No arguments provided. You will be prompted for the input and output files and the minification options.");
        main().catch((err) => {
            (0, colors_1.error)("An error occurred:", err);
            process.exit(1);
        });
    }
    else {
        // If the user requested help or version, show it and exit and ignore the rest of the options
        //  help is the most important one then version and then the actual functionality
        if (args.includes("--help") || args.includes("-h")) {
            (0, colors_1.log)(`Usage: html-bundle-minifier [options] -i <inputFile> -o <outputFile>
If nothing is specified you will be prompted for the input and output files and the minification options.
Input/output files always need to be specified with the --input or -i and --output or -o options.
You can also place options before or after or in middle of the input and output options.

Options:
--help, -h          Show this help message
--version, -v       Show the version of the HTML Bundle Minifier
--no-css, -c        Do not minify CSS files
--no-js, -j         Do not minify JS files
--input, -i         Specify the input HTML file (default: prompt)
--output, -o        Specify the output HTML file (default: <inputFile>.min.html)
--no-verbose, -V    Disable verbose mode (default: true)
--bundle, -b        Bundle without minification (default: false)
--full-prompt, -f   Enable full prompt mode (default: false)

Examples:
html-bundle-minifier -i input.html -o output.min.html --no-css --no-js
html-bundle-minifier -i input.html -o output.min.html --verbose
html-bundle-minifier -i input.html -o output.min.html --bundle
html-bundle-minifier -i input.html -o output.min.html --full-prompt`);
            process.exit(0);
        }
        else if (args.includes("--version") || args.includes("-v")) {
            (0, colors_1.log)(version);
            process.exit(0);
        }
        else {
            // Default values for input and output files
            let inputFile = undefined;
            let outputFile = undefined;
            let minifyCSS = true;
            let minifyJS = true;
            let verbose = true;
            let bundle = false;
            let noPrompts = true;
            // Parse the arguments and enable/disable their respective options
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
                        (0, colors_1.error)(`Input file must be specified after ${arg}`);
                        process.exit(1);
                    }
                    else {
                        inputFile = args[index + 1];
                    }
                }
                else if (arg === "--output" || arg === "-o") {
                    // Basic error checking for output file
                    if (isAnOption(args[index + 1]) || !args[index + 1]) {
                        (0, colors_1.error)(`Output file must be specified after ${arg}`);
                        process.exit(1);
                    }
                    else {
                        outputFile = args[index + 1];
                    }
                }
                else if (arg === "--no-verbose" || arg === "-V") {
                    verbose = false;
                    (0, colors_1.success)("Verbose mode is disabled. \n");
                }
                else if (arg === "--bundle" || arg === "-b") {
                    bundle = true;
                    verbose && (0, colors_1.success)("Bundling mode is enabled. \n");
                }
                else if (arg === "--full-prompt" || arg === "-f") {
                    noPrompts = false;
                    verbose && (0, colors_1.success)("Full prompt mode is enabled. \n");
                }
            });
            // If input file is not provided warn the user
            if (!inputFile) {
                (0, colors_1.warning)("Input file wasn't specified, you will be prompted for it.\n if you want to specify it, use the --input or -i option.");
                ;
            }
            if (!inputFile && !outputFile) {
                (0, colors_1.log)("\n");
            }
            // If output file is not provided warn the user
            if (!outputFile) {
                (0, colors_1.warning)("Output file wasn't specified, you will be prompted for it.\n if you want to specify it, use the --output or -o option.");
            }
            // Call the main function with the parsed options
            main(inputFile, outputFile, minifyCSS, minifyJS, noPrompts, verbose, bundle).catch((err) => {
                (0, colors_1.error)("An error occurred:", err);
                process.exit(1);
            });
        }
    }
}
// Call the parseOptions function
parseOptions(args);
//# sourceMappingURL=cli.js.map