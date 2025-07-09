"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const colors_1 = require("./colors");
// Function to merge the content of multiple files into a single string
// For the js and css files and inline scripts/styles
function mergeFiles(fileList) {
    let mergedContent = "";
    fileList.forEach((item) => {
        if (item.type === "inline") {
            mergedContent += item.content + "\n"; // Add a newline for separation
        }
        else if (item.type === "path") {
            const filePath = item.content;
            try {
                const content = fs_1.default.readFileSync(filePath, "utf8");
                mergedContent += content + "\n"; // Add a newline for separation
            }
            catch (err) {
                (0, colors_1.error)(`Error reading file ${filePath}:`, err);
            }
        }
    });
    return mergedContent;
}
exports.default = mergeFiles;
//# sourceMappingURL=mergeFiles.js.map