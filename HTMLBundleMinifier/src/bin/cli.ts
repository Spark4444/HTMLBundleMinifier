#!/usr/bin/env node
import fs from "fs";
import path from "path";

// Import the main function from the index file
import main from "../index.js";
import convertPathToAbsolute from "convert-path-to-absolute";

// CLI arguments
const args = process.argv.slice(2);
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const packageJsonPath = path.join(__dirname, "../../package.json");
const version = JSON.parse(fs.readFileSync(packageJsonPath, "utf8")).version;


import { log, error, warning, success } from "../functions/colors.js";

import { Options } from "../data/interfaces.js";

import { CLIOptions, mainOptions } from "./data/optionKeys.js";
import { autocompleteOption, isAnOption, checkForInputFile } from "./functions/cliFunctions.js";

// Options example: html-bundle-minifier -i input.html -o output.min.html --no-css --no-js
// This function parses the command line arguments and options
function parseOptions(args: string[]): void {
    let invalidOptions: string[] = [];

    // Check for invalid options/non-existing options
    args.forEach((arg, index) => {
        // Check if the argument is an option
        if (!isAnOption(arg)) {
            // Check if the argument before is an I/O option
            // List of i/o options
            let IOOptions: string[] = ["--input", "-i", "--output", "-o", "--config", "-g"];

            if (IOOptions.includes(args[index - 1])) {
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

            // Show suggestions only for a single invalid option
            const suggestion = autocompleteOption(invalidOptions[0], CLIOptions.flat());
            if (suggestion !== invalidOptions[0]) {
                error(`Perhaps you meant "${suggestion}"? \n`);
            }
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
--help, -h                      Show this help message
--version, -v                   Show the version of the HTML Bundle Minifier
--config, -g                    Specify a config file
--input, -i                     Specify the input HTML file (default: prompt)
--output, -o                    Specify the output HTML file (default: <inputFile>.min.html)
--no-verbose, -V                Disable verbose mode (default: true)
--bundle, -b                    Bundle without minification (default: false)
--no-css, -c                    Do not minify CSS files (default: true)
--no-js, -j                     Do not minify JS files (default: true)
--full-prompt, -f               Enable full prompt mode (default: false)
--no-mangle-js, -m              Do not mangle JS variable names (default: false)
--keep-comments, -C             Keep comments in the minified HTML (default: false)
--keep-console, -l              Keep console statements in the minified JS (default: false)
--no-pretty-html, -p            Skip HTML prettification (default: false)
--no-collapse-whitespace, -w    Skip whitespace removal (default: false)
--fetch-remote, -F              Fetch remote files and embed them (default: false)
--embed-assets, -E              Embed local assets (default: false)

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
        else if (args.includes("--config") || args.includes("-g")) {
            // Ignore all options except for the config file and input/output files
            let options: Options = {};
            let inputFile: string | undefined = undefined;
            let outputFile: string | undefined = undefined;

            args.forEach((arg, index) => {
                if (arg === "--config" || arg === "-g") {
                    let configPath = args[index + 1];
                    if (configPath) {
                        configPath = convertPathToAbsolute(configPath);
                        if (!fs.existsSync(configPath)) {
                            error(`Config file does not exist: ${configPath}`);
                            process.exit(1);
                        }

                        const configContent = fs.readFileSync(configPath, "utf8");

                        try {
                            options = JSON.parse(configContent);
                            options.verbose && success(`Using config file: ${configPath}`);
                        } 
                        catch (err) {
                            error("Invalid JSON in config file:", err);
                            process.exit(1);
                        }
                    }
                    else {
                        error("Config file path must be specified after --config or -g");
                        process.exit(1);
                    }
                }
                else if (arg === "--input" || arg === "-i") {
                    inputFile = checkForInputFile(args, index, "Input");
                } 
                else if (arg === "--output" || arg === "-o") {
                    outputFile = checkForInputFile(args, index, "Output");
                }
            });


            // Warn user for for any invalid options
            Object.keys(options).forEach((key) => {
                if (!mainOptions.includes(key)) {
                    warning(`Invalid option in config file: ${key}`);
                    const suggestion = autocompleteOption(key, mainOptions);
                    if (suggestion !== key) {
                        warning(`Perhaps you meant "${suggestion}"?`);
                    }
                }
            });

            // Call the main function with the parsed options
            main(inputFile, outputFile, options).catch((err: Error) => {
                error("An error occurred:", err);
                process.exit(1);
            });
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
            let fetchRemote: boolean = false;
            let embedAssets: boolean = false;

            // Parse the arguments and enable/disable their respective options
            args.forEach((arg, index) => {
                if (arg === "--no-css" || arg === "-c") {
                    minifyCSS = false;
                } 
                else if (arg === "--no-js" || arg === "-j") {
                    minifyJS = false;
                } 
                else if (arg === "--input" || arg === "-i") {
                    inputFile = checkForInputFile(args, index, "Input");
                } 
                else if (arg === "--output" || arg === "-o") {
                    outputFile = checkForInputFile(args, index, "Output");
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
                else if (arg === "--fetch-remote" || arg === "-F") {
                    fetchRemote = true;
                    verbose && success("Fetching remote files is enabled.");
                    verbose && warning("Warning: Use this option at your own risk as it may break some specific remote URLs if they return dynamic content. \n");
                }
                else if (arg === "--embed-assets" || arg === "-E") {
                    embedAssets = true;
                    verbose && success("Embedding assets is enabled. \n");
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
                whitespaces,
                embedAssets,
                fetchRemote
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
