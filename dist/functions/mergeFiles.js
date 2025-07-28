"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const colors_1 = require("./colors");
const path_1 = __importDefault(require("path"));
// Function to replace paths in CSS url() declarations
function replaceRegexPaths(match, urlPath, cssPath, htmlPath, quote) {
    quote = quote || ""; // Default to empty string if no quote is provided
    // Skip absolute URLs (http/https) and data URLs
    if (urlPath.startsWith("http") || urlPath.startsWith("data:")) {
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
    }
    // Return the updated url() with the new relative path (no quotes for unquoted URLs)
    return `url(${quote}${relativePath}${quote})`;
}
// Find all the url() in the CSS file and replace them with relative paths to the HTML file
function replaceRelativeCSSPaths(htmlPath, cssPath, cssContent) {
    // Regular expressions to match url() declarations in CSS
    const urlRegexWithQuotes = /url\((['"])(.*?)\1\)?/g;
    const urlRegexWithoutQuotes = /url\(([^'"][^)]*)\)?/g;
    // Why two regexes?
    // 1. The first regex captures URLs with quotes (e.g., url("path/to/file.img"))
    // 2. The second regex captures URLs without quotes (e.g., url(path/to/file.img))
    // This ensures that both quoted and unquoted URLs are processed correctly since the quoted ones can cause issues if not handled properly.
    // 3. For example url("path/to/file(brackets).img") 
    // This would cause issues if we only used the second regex as it has special characters that need to be escaped like the brackets.
    // 4. The quoted ones allow you to enter special characters without escaping them, so we need to handle both cases.
    // First replace quoted URLs
    let result = cssContent.replace(urlRegexWithQuotes, (match, quote, urlPath) => {
        return replaceRegexPaths(match, urlPath, cssPath, htmlPath, quote);
    });
    // Then replace unquoted URLs
    return result.replace(urlRegexWithoutQuotes, (match, urlPath) => {
        return replaceRegexPaths(match, urlPath, cssPath, htmlPath);
    });
}
// Function to merge the content of multiple files into a single string
// For the js and css files and inline scripts/styles
function mergeFiles(fileList, type, htmlPath) {
    let mergedContent = "";
    fileList.forEach((item) => {
        if (item.type === "inline") {
            if (type === "CSS") {
                item.content = replaceRelativeCSSPaths(htmlPath, htmlPath, item.content);
            }
            mergedContent += item.content + "\n"; // Add a newline for separation
        }
        else if (item.type === "path") {
            const filePath = item.content;
            try {
                let content = fs_1.default.readFileSync(filePath, "utf8");
                // If it's a CSS file, replace relative paths to the HTML file
                if (type === "CSS") {
                    content = replaceRelativeCSSPaths(htmlPath, filePath, content);
                }
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