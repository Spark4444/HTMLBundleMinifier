import { error } from "../../functions/colors.js";
import { CLIOptions } from "../data/optionKeys.js";
// Function to autocomplete an option
export function autocompleteOption(option, array) {
    return array.find(opt => opt.startsWith(option)) || option;
}
// Function to check if an argument is an option
export function isAnOption(arg) {
    return CLIOptions.flat().includes(arg);
}
// Check if the input file is provided
export function checkForInputFile(args, index, type) {
    let file = args[index + 1];
    if (isAnOption(file) || !file) {
        error(`${type} file must be specified after ${args[index]}`);
        process.exit(1);
    }
    else {
        return file;
    }
}
//# sourceMappingURL=cliFunctions.js.map