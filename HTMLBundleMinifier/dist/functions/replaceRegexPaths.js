import fs from "fs";
import path from "path";
import { warning } from "./colors.js";
// Function to replace paths in CSS url() declarations
export default function replaceRegexPaths(match, urlPath, cssPath, htmlPath, quote) {
    quote = quote || ""; // Default to empty string if no quote is provided
    // Skip absolute URLs (http/https) and data URLs and the missing @imported CSS files
    if (urlPath.startsWith("http") || urlPath.startsWith("data:") || urlPath.endsWith(".css")) {
        return match;
    }
    // Add the cssPath to the urlPath to resolve the full path
    const matchPath = path.join(path.dirname(cssPath), urlPath);
    // Then calculate the relative path from the HTML to the file location
    const relativePath = path.relative(path.dirname(htmlPath), matchPath);
    // Check if the referenced file exists
    if (!fs.existsSync(matchPath)) {
        const relativeFilePath = path.relative(path.dirname(match), match);
        warning(`\nWarning: Referenced file does not exist: ${relativePath} (referenced in ${path.relative(path.dirname(htmlPath), cssPath)})\n`);
        return match; // Return the original match if the file doesn't exist
    }
    // Return the updated url() with the new relative path (no quotes for unquoted URLs)
    return `url(${quote}${relativePath}${quote})`;
}
//# sourceMappingURL=replaceRegexPaths.js.map