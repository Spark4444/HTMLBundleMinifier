"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFileToBase64 = convertFileToBase64;
const web_file_fetcher_1 = require("web-file-fetcher");
const fs_1 = __importDefault(require("fs"));
const colors_1 = require("./colors");
// Function to convert a file to a Base64 data URI
// Warning: it increases the file size by 33%
function convertFileToBase64(filePath) {
    if (!fs_1.default.existsSync(filePath)) {
        (0, colors_1.error)(`File not found: ${filePath}`);
        // Return the file path back
        return filePath;
    }
    const fileContent = fs_1.default.readFileSync(filePath);
    return (0, web_file_fetcher_1.stringToDataURI)(fileContent, filePath);
}
//# sourceMappingURL=converFileToBase64.js.map