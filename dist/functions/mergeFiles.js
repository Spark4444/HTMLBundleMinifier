"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const colors_1 = require("./colors");
const path_1 = __importDefault(require("path"));
// Find all the url() in the CSS file and replace them with relative paths to the HTML file
function replaceRelativeCSSPaths(htmlPath, cssPath, cssContent) {
    // Regular expression to match url() declarations in CSS
    const urlRegex = /url\((['"]?)([^'"*)]+)\1\)/g;
    return cssContent.replace(urlRegex, (match, quote, urlPath) => {
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
            const cssRelativePath = path_1.default.relative(path_1.default.dirname(htmlPath), cssPath);
            (0, colors_1.warning)(`\nWarning: Referenced file does not exist: ${relativePath} (referenced in ${cssRelativePath})`);
        }
        // Return the updated url() with the new relative path with quotes added
        return `url(${quote}${relativePath}${quote})`;
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