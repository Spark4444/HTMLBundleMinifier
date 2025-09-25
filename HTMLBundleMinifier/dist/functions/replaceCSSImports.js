import fs from "fs";
import path from "path";
import { warning, success } from "./colors.js";
// Function to replace @import with css content from the acual file
export default function replaceCSSImports(cssPath, cssContent, regex, verbose) {
    return cssContent.replace(regex, (match, quote, importPath) => {
        quote = quote || ""; // Default to empty string if no quote is provided
        // Skip absolute URLs (http/https) and data URLs
        if (importPath.startsWith("http") || importPath.startsWith("data:")) {
            return match;
        }
        // Resolve the full path to the imported CSS file
        const fullPath = path.resolve(path.dirname(cssPath), importPath);
        // Check if the file exists
        if (!fs.existsSync(fullPath)) {
            warning(`\nWarning: @imported file does not exist: ${fullPath} (referenced in ${cssPath})`);
            return match; // Return the original match if the file doesn't exist
        }
        else {
            verbose && success(`\nFound @import: ${path.relative(path.dirname(cssPath), fullPath)} (referenced in ${path.relative(path.dirname(cssPath), cssPath)})`);
        }
        // Read the content of the imported CSS file
        let importedContent = fs.readFileSync(fullPath, "utf8");
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