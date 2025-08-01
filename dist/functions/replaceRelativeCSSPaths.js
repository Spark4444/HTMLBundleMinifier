"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceRelativeCSSPaths = replaceRelativeCSSPaths;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const colors_1 = require("./colors");
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
        const importedContent = fs_1.default.readFileSync(fullPath, "utf8");
        // Return the content of the imported CSS file
        return importedContent;
    });
}
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
// Find all the url() in the CSS file and replace them with relative paths to the HTML file
function replaceRelativeCSSPaths(htmlPath, cssPath, cssContent, verbose) {
    // Regular expressions to match url() declarations in CSS
    // url("path")
    const urlRegexWithQuotes = /url\((['"])(.*?)\1\)?/g;
    // url(path)
    const urlRegexWithoutQuotes = /url\(([^'"][^)]*)\)?/g;
    // @import "path"; or @import url("path");
    const cssImportRegex = /@import\s+(?:url\s*\(\s*)?(['"]?)([^'")\s]+)\1\s*\)?\s*;/gi;
    // Why two regexes?
    // 1. The first regex captures URLs with quotes (e.g., url("path/to/file.img"))
    // 2. The second regex captures URLs without quotes (e.g., url(path/to/file.img))
    // This ensures that both quoted and unquoted URLs are processed correctly since the quoted ones can cause issues if not handled properly.
    // 3. For example url("path/to/file(brackets).img") 
    // This would cause issues if we only used the second regex as it has special characters that need to be escaped like the brackets.
    // 4. The quoted ones allow you to enter special characters without escaping them, so we need to handle both cases.
    // First replace @imports before other url() replacements
    let result = replaceCSSImports(cssPath, cssContent, cssImportRegex, verbose);
    // First replace quoted URLs
    result = result.replace(urlRegexWithQuotes, (match, quote, urlPath) => {
        return replaceRegexPaths(match, urlPath, cssPath, htmlPath, quote);
    });
    // Then replace unquoted URLs
    result = result.replace(urlRegexWithoutQuotes, (match, urlPath) => {
        return replaceRegexPaths(match, urlPath, cssPath, htmlPath);
    });
    return result;
}
//# sourceMappingURL=replaceRelativeCSSPaths.js.map