"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = replaceRegexPaths;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const colors_1 = require("./colors");
// Function to replace paths in CSS url() declarations
function replaceRegexPaths(match, urlPath, cssPath, htmlPath, quote) {
    quote = quote || ""; // Default to empty string if no quote is provided
    // Skip absolute URLs (http/https) and data URLs and the missing @imported CSS files
    if (urlPath.startsWith("http") || urlPath.startsWith("data:") || urlPath.endsWith(".css")) {
        return match;
    }
    // Add the cssPath to the urlPath to resolve the full path
    const matchPath = path_1.default.join(path_1.default.dirname(cssPath), urlPath);
    // Then calculate the relative path from the HTML to the file location
    const relativePath = path_1.default.relative(path_1.default.dirname(htmlPath), matchPath);
    // Check if the referenced file exists
    if (!fs_1.default.existsSync(matchPath)) {
        const relativeFilePath = path_1.default.relative(path_1.default.dirname(match), match);
        (0, colors_1.warning)(`\nWarning: Referenced file does not exist: ${relativePath} (referenced in ${relativeFilePath})`);
        return match; // Return the original match if the file doesn't exist
    }
    // Return the updated url() with the new relative path (no quotes for unquoted URLs)
    return `url(${quote}${relativePath}${quote})`;
}
//# sourceMappingURL=replaceRegexPaths.js.map