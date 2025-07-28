import fs from "fs";
import { error, warning } from "./colors";
import { FileItem } from "../data/interfaces";
import path from "path";

// Find all the url() in the CSS file and replace them with relative paths to the HTML file
function replaceRelativeCSSPaths(htmlPath: string, cssPath: string, cssContent: string): string {
    // Regular expressions to match url() declarations in CSS
    const urlRegexWithQuotes = /url\((['"])(.*?)\1\);?/g;
    const urlRegexWithoutQuotes = /url\(([^'"][^)]*)\);?/g;

    // First replace quoted URLs
    let result = cssContent.replace(urlRegexWithQuotes, (match, quote, urlPath) => {
        // Skip absolute URLs (http/https) and data URLs
        if (urlPath.startsWith("http") || urlPath.startsWith("data:")) {
            return match;
        }
        
        // Check if the original match had a semicolon
        const hasSemicolon = match.endsWith(';');
        
        // Add the cssPath to the urlPath to resolve the full path
        const matchPath = path.join(path.dirname(cssPath), urlPath);
        
        // Then calculate the relative path from the HTML to the file location
        const relativePath = path.relative(path.dirname(htmlPath), matchPath);

        // Check if the referenced file exists
        if (!fs.existsSync(matchPath)) {
            const cssRelativePath = path.relative(path.dirname(htmlPath), cssPath);
            warning(`\nWarning: Referenced file does not exist: ${relativePath} (referenced in ${cssRelativePath})`);
        }

        // Return the updated url() with the new relative path with quotes added
        return `url(${quote}${relativePath}${quote})${hasSemicolon ? ';' : ''}`;
    });

    // Then replace unquoted URLs
    return result.replace(urlRegexWithoutQuotes, (match, urlPath) => {
        // Skip absolute URLs (http/https) and data URLs
        if (urlPath.startsWith("http") || urlPath.startsWith("data:")) {
            return match;
        }
        
        // Check if the original match had a semicolon
        const hasSemicolon = match.endsWith(';');
        
        // Trim whitespace from unquoted URLs
        urlPath = urlPath.trim();
        
        // Add the cssPath to the urlPath to resolve the full path
        const matchPath = path.join(path.dirname(cssPath), urlPath);
        
        // Then calculate the relative path from the HTML to the file location
        const relativePath = path.relative(path.dirname(htmlPath), matchPath);

        // Check if the referenced file exists
        if (!fs.existsSync(matchPath)) {
            const cssRelativePath = path.relative(path.dirname(htmlPath), cssPath);
            warning(`\nWarning: Referenced file does not exist: ${relativePath} (referenced in ${cssRelativePath})`);
        }

        // Return the updated url() with the new relative path (no quotes for unquoted URLs)
        return `url(${relativePath})${hasSemicolon ? ';' : ''}`;
    });

    
}

// Function to merge the content of multiple files into a single string
// For the js and css files and inline scripts/styles
function mergeFiles(fileList: FileItem[], type: string, htmlPath: string): string {
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
                let content = fs.readFileSync(filePath, "utf8");
                // If it's a CSS file, replace relative paths to the HTML file
                if (type === "CSS") {
                    content = replaceRelativeCSSPaths(htmlPath, filePath, content);
                }
                mergedContent += content + "\n"; // Add a newline for separation
            }
            catch (err) {
                error(`Error reading file ${filePath}:`, err);
            }
        }
    });
    return mergedContent;
}

export default mergeFiles;