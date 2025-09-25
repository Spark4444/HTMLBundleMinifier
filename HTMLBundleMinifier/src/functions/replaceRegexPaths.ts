import fs from "fs";
import path from "path";
import { warning } from "./colors.js";

// Function to replace paths in CSS url() declarations
export default function replaceRegexPaths(parsedCSS: any, cssPath: string, originPath: string, verbose: boolean): any {
    parsedCSS.walkDecls((decl: any) => {
        decl.value = decl.value.replace(/url\((['"]?)(.*?)\1\)/g, (match: string, quote: string, urlPath: string) => {
            // Skip absolute URLs (http/https) and data URLs
            if (urlPath.startsWith("http") || urlPath.startsWith("data:")) {
                return match;
            }
            else {
                // Resolve relative to the CSS file's directory, or use cssPath if it's already a directory
                const cssDirectory = fs.statSync(cssPath).isDirectory() ? cssPath : path.dirname(cssPath);
                const absoluteCSSPath = path.resolve(cssDirectory, urlPath);
                const originDirectory = path.dirname(originPath);
                const relativePath = path.relative(originDirectory, absoluteCSSPath);

                // Check if the file exists
                if (!fs.existsSync(absoluteCSSPath)) {
                    verbose && warning(`Warning: The file at path "${path.relative(originDirectory, absoluteCSSPath)}" does not exist (referenced in ${path.relative(originDirectory, cssPath)}).\n`);
                }

                // Return the new url() declaration with the updated path
                return `url(${quote}${relativePath.replace(/\\/g, "/")}${quote})`;
            }
        });
    });
    return parsedCSS;
}