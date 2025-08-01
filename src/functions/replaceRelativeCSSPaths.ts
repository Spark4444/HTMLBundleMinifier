import fs from "fs";
import path from "path";
import { warning } from "./colors";

// Function to replace paths in CSS url() declarations
function replaceRegexPaths(match: string, urlPath: string, cssPath: string, htmlPath: string, quote?: string): string {
    quote = quote || ""; // Default to empty string if no quote is provided
    // Skip absolute URLs (http/https) and data URLs
    if (urlPath.startsWith("http") || urlPath.startsWith("data:")) {
        return match;
    }

    // Add the cssPath to the urlPath to resolve the full path
    const matchPath = path.join(path.dirname(cssPath), urlPath);
    
    // Then calculate the relative path from the HTML to the file location
    const relativePath = path.relative(path.dirname(htmlPath), matchPath);

    // Check if the referenced file exists
    if (!fs.existsSync(matchPath)) {
        const relativeFilePath = path.relative(path.dirname(match), match);
        warning(`\nWarning: Referenced file does not exist: ${relativePath} (referenced in ${relativeFilePath})`);
    }

    // Return the updated url() with the new relative path (no quotes for unquoted URLs)
    return `url(${quote}${relativePath}${quote})`;
}

// Find all the url() in the CSS file and replace them with relative paths to the HTML file
export function replaceRelativeCSSPaths(htmlPath: string, cssPath: string, cssContent: string): string {
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