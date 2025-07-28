#!/usr/bin/env node

const path = require("path");

// Import the main function from the index file
const main = require(path.join(__dirname, "../", "index"));
import { log, error, warning, success } from "../functions/colors";

// CLI arguments
const args = process.argv.slice(2);
const version = require("../../package.json").version;

import { Options } from "../interfaces";

// Options example: html-bundle-minifier -i input.html -o output.min.html --no-css --no-js
// This function parses the command line arguments and options
function parseOptions(args: string[]): void {
    let optionList: string[] = [
        "--help", 
        "--version",
        "--no-css",
        "--no-js",
        "--input",
        "--output",
        "--no-verbose",
        "--bundle",
        "--full-prompt",
        "--no-mangle-js",
        "--keep-comments",
        "--keep-console",
        "--no-pretty-html",
        "--no-collapse-whitespace",
        // Small versions of the options
        "-h", // --help
        "-v", // --version
        "-c", // --no-css
        "-j", // --no-js
        "-i", // --input
        "-o", // --output
        "-V", // --no-verbose
        "-b", // --bundle
        "-f", // --full-prompt
        "-m", // --no-mangle-js
        "-C", // --keep-comments
        "-l", // --keep-console
        "-p", // --no-pretty-html
        "-w"  // --no-collapse-whitespace
    ];

    // Function to check if an argument is an option
    function isAnOption(arg: string): boolean {
        return optionList.includes(arg);
    }

    let invalidOptions: string[] = [];

    // Check for invalid options/non-existing options
    args.forEach((arg, index) => {
        // Check if the argument is an option
        if (!isAnOption(arg)) {
            // Check if the argument before is an I/O option
            // List of i/o options
            let IO_Options: string[] = ["--input", "-i", "--output", "-o"];

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
            error(`Invalid option: ${invalidOptions[0]}`);
        }
        else {
            error(`Invalid options: ${invalidOptions.join(", ")}`);
        }
        error("Use --help or -h to see the available options.");
        process.exit(1);
    }

    // If no arguments are provided run the cli with prompts
    if (args.length === 0) {
        warning("No arguments provided. You will be prompted for the input and output files and the minification options.");
        main().catch((err: Error) => {
            error("An error occurred:", err);
            process.exit(1);
        });
    }
    else {
        // If the user requested help or version, show it and exit and ignore the rest of the options
        //  help is the most important one then version and then the actual functionality
        if (args.includes("--help") || args.includes("-h")) {
            log(`Usage: html-bundle-minifier [options] -i <inputFile> -o <outputFile>
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
--no-mangle-js, -m  Do not mangle JS variable names (default: false)
--keep-comments, -C Keep comments in the minified HTML (default: false)
--keep-console, -l  Keep console statements in the minified JS (default: false)
--no-pretty-html, -p Skip HTML prettification (default: false)
--no-collapse-whitespace, -w Skip whitespace removal (default: false)

Examples:
html-bundle-minifier -i input.html -o output.min.html --no-css --no-js
html-bundle-minifier -i input.html -o output.min.html --verbose
html-bundle-minifier -i input.html -o output.min.html --bundle
html-bundle-minifier -i input.html -o output.min.html --full-prompt`);
            process.exit(0);
        }
        else if (args.includes("--version") || args.includes("-v")) {
            log(version);
            process.exit(0);
        }
        else {
            // Default values for input and output files
            // Try keeping the option varaibles clean and simple without using "noOption"
            let inputFile: string | undefined = undefined;
            let outputFile: string | undefined = undefined;
            let minifyCSS: boolean = true;
            let minifyJS: boolean = true;
            let verbose: boolean = true;
            let bundle: boolean = false;
            let prompts: boolean = false;
            let mangle: boolean = true;
            let removeComments: boolean = true;
            let removeConsole: boolean = true;
            let prettify: boolean = true;
            let whitespaces: boolean = true;

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
                        error(`Input file must be specified after ${arg}`);
                        process.exit(1);
                    }
                    else {
                        inputFile = args[index + 1];
                    }
                } 
                else if (arg === "--output" || arg === "-o") {
                    // Basic error checking for output file
                    if (isAnOption(args[index + 1]) || !args[index + 1]) {
                        error(`Output file must be specified after ${arg}`);
                        process.exit(1);
                    }
                    else {
                        outputFile = args[index + 1];
                    }
                }
                else if (arg === "--no-verbose" || arg === "-V") {
                    verbose = false;
                    success("Verbose mode is disabled. \n");
                }
                else if (arg === "--bundle" || arg === "-b") {
                    bundle = true;
                    verbose && success("Bundling mode is enabled. \n");
                }
                else if (arg === "--full-prompt" || arg === "-f") {
                    prompts = true;
                    verbose && success("Full prompt mode is enabled. \n");
                }
                else if (arg === "--no-mangle-js" || arg === "-m") {
                    mangle = false;
                    verbose && success("JS mangling is disabled. \n");
                }
                else if (arg === "--keep-comments" || arg === "-C") {
                    removeComments = false;
                    verbose && success("Keeping comments in the minified HTML. \n");
                }
                else if (arg === "--keep-console" || arg === "-l") {
                    removeConsole = false;
                    verbose && success("Keeping console statements in the minified JS. \n");
                }
                else if (arg === "--no-pretty-html" || arg === "-p") {
                    prettify = false;
                    verbose && success("Skipping HTML prettification. \n");
                }
                else if (arg === "--no-collapse-whitespace" || arg === "-w") {
                    whitespaces = false;
                    verbose && success("Skipping whitespace removal. \n");
                }
            });

            // If input file is not provided warn the user
            if (!inputFile) {
                warning("Input file wasn't specified, you will be prompted for it.\n if you want to specify it, use the --input or -i option.");;
            }

            if (!inputFile && !outputFile) {
                log("\n");
            }

            // If output file is not provided warn the user
            if (!outputFile) {
                warning("Output file wasn't specified, you will be prompted for it.\n if you want to specify it, use the --output or -o option.");
            }

            const options: Options = {
                minifyCSS,
                minifyJS,
                prompts,
                verbose,
                bundle,
                mangle,
                removeComments,
                removeConsole,
                prettify,
                whitespaces
            };
            // Call the main function with the parsed options
            main(inputFile, outputFile, options).catch((err: Error) => {
                error("An error occurred:", err);
                process.exit(1);
            });
        }

    }
}

// Call the parseOptions function
parseOptions(args);
