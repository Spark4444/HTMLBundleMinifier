import { error } from "../../functions/colors";
import { optionList } from "../data/optionKeys";

// Function to autocomplete an option
export function autocompleteOption(option: string, array: string[]): string {
    return array.find(opt => opt.startsWith(option)) || option;
}

// Function to check if an argument is an option
export function isAnOption(arg: string): boolean {
    return optionList.includes(arg);
}

// Check if the input file is provided
export function checkForInputFile(args: string[], index: number, type: String): string | undefined {
    let file = args[index + 1];
    if (isAnOption(file) || !file) {
        error(`${type} file must be specified after ${args[index]}`);
        process.exit(1);
    }
    else {
        return file;
    }
}