"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const colors_1 = require("./colors");
// Function to merge the content of multiple files into a single string
// For the js and css files
function mergeFiles(fileList) {
    let mergedContent = "";
    for (const file of fileList) {
        try {
            const content = fs_1.default.readFileSync(file, "utf8");
            mergedContent += content + "\n"; // Add a newline for separation
        }
        catch (err) {
            (0, colors_1.error)(`Error reading file ${file}:`, err);
        }
    }
    return mergedContent;
}
exports.default = mergeFiles;
//# sourceMappingURL=mergeFiles.js.map