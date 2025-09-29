import { error } from "../../functions/colors.js";
import { CLIOptions } from "../data/optionKeys.js";
import path from "path";
import convertPathToAbsolute from "convert-path-to-absolute";

const __dirname = path.resolve();

// Function to autocomplete an option
export function autocompleteOption(option: string, array: string[]): string {
    return array.find(opt => opt.startsWith(option)) || option;
}

// Function to check if an argument is an option
export function isAnOption(arg: string): boolean {
    return CLIOptions.flat().includes(arg);
}

// Check if the input file is provided
export function checkForInputFile(args: string[], index: number, type: String): string | undefined {
    let file = args[index + 1];
    if (isAnOption(file) || !file) {
        error(`${type} file must be specified after ${args[index]}`);
        process.exit(1);
    }
    // Convert to absolute path if not already
    return convertPathToAbsolute(file);
}