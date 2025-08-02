"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = replaceCSSImports;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const colors_1 = require("../colors");
// Function to replace @import with css content from the acual file
function replaceCSSImports(cssPath, cssContent, regex, verbose) {
    return cssContent.replace(regex, (match, quote, importPath) => {
        quote = quote || ""; // Default to empty string if no quote is provided
        // Skip absolute URLs (http/https) and data URLs
        if (importPath.startsWith("http") || importPath.startsWith("data:")) {
            return match;
        }
        // Resolve the full path to the imported CSS file
        const fullPath = path_1.default.resolve(path_1.default.dirname(cssPath), importPath);
        // Check if the file exists
        if (!fs_1.default.existsSync(fullPath)) {
            (0, colors_1.warning)(`\nWarning: @imported file does not exist: ${fullPath} (referenced in ${cssPath})`);
            return match; // Return the original match if the file doesn't exist
        }
        else {
            verbose && (0, colors_1.success)(`\nFound @import: ${fullPath}`);
        }
        // Read the content of the imported CSS file
        let importedContent = fs_1.default.readFileSync(fullPath, "utf8");
        // Recursively replace @import in the imported CSS content
        // Before doing that, we need to check if the importedContent has any @import statements
        if (regex.test(importedContent)) {
            importedContent = replaceCSSImports(fullPath, importedContent, regex, verbose);
        }
        // Return the content of the imported CSS file
        return importedContent;
    });
}
//# sourceMappingURL=replaceCSSImports.js.map