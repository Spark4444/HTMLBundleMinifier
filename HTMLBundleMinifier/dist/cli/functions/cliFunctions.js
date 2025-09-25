"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autocompleteOption = autocompleteOption;
exports.isAnOption = isAnOption;
exports.checkForInputFile = checkForInputFile;
const colors_1 = require("../../functions/colors");
const optionKeys_1 = require("../data/optionKeys");
// Function to autocomplete an option
function autocompleteOption(option, array) {
    return array.find(opt => opt.startsWith(option)) || option;
}
// Function to check if an argument is an option
function isAnOption(arg) {
    return optionKeys_1.optionList.includes(arg);
}
// Check if the input file is provided
function checkForInputFile(args, index, type) {
    let file = args[index + 1];
    if (isAnOption(file) || !file) {
        (0, colors_1.error)(`${type} file must be specified after ${args[index]}`);
        process.exit(1);
    }
    else {
        return file;
    }
}
//# sourceMappingURL=cliFunctions.js.map