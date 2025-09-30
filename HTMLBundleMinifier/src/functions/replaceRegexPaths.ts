import fs from "fs";
import path from "path";
import { warning } from "./colors.js";
import { HTMLOptions } from "../data/interfaces.js";
import fetchFile from "web-file-fetcher";
import convertFileToBase64 from "./converFileToBase64.js";
import { success } from "./colors.js";

// Function to replace paths in CSS url() declarations
export default async function replaceRegexPaths(parsedCSS: any, cssPath: string, originPath: string, htmlOptions: HTMLOptions): Promise<any> {
    const {
        verbose = true,
        fetchRemote,
        embedAssets
    } = htmlOptions;

    const promises: Promise<void>[] = [];
    
    parsedCSS.walkDecls((decl: any) => {
        const urlMatches = [...decl.value.matchAll(/url\((['"]?)(.*?)\1\)/g)];
        
        if (urlMatches.length === 0) return;
        
        const promise = (async () => {
            let newValue = decl.value;
            
            // Pre-calculate commonly used path variables for console output
            const originDirectory = path.dirname(originPath);
            const relativeCssPath = path.relative(originDirectory, cssPath);
            
            // Process each URL match in reverse order to avoid index shifting
            for (let i = urlMatches.length - 1; i >= 0; i--) {
                const match = urlMatches[i];
                const [fullMatch, quote, urlPath] = match;
                const matchIndex = match.index!;
                
                let replacement = fullMatch;
                
                // Skip absolute URLs (http/https) and data URLs
                if (urlPath.startsWith("http") && fetchRemote) {
                    try {
                        const result = await fetchFile(urlPath);
                        verbose && success(`Fetched remote URL: ${urlPath} (referenced in ${relativeCssPath})\n`);
                        replacement = `url(${quote}${result}${quote})`;
                    } catch (error) {
                        verbose && warning(`\nWarning: failed to fetch remote URL: ${urlPath} (referenced in ${relativeCssPath})\n`);
                        replacement = fullMatch;
                    }
                }
                else if (urlPath.startsWith("http") || urlPath.startsWith("data:")) {
                    replacement = fullMatch;
                }
                else {
                    // Resolve relative to the CSS file's directory, or use cssPath if it's already a directory
                    const cssDirectory = fs.statSync(cssPath).isDirectory() ? cssPath : path.dirname(cssPath);
                    const absoluteCSSPath = path.resolve(cssDirectory, urlPath);
                    const relativePath = path.relative(originDirectory, absoluteCSSPath);
                    const relativeAssetPath = path.relative(originDirectory, absoluteCSSPath);

                    if (embedAssets) {
                        const data = convertFileToBase64(absoluteCSSPath, verbose);
                        replacement = data;
                    }
                    else {
                        // Check if the file exists
                        if (!fs.existsSync(absoluteCSSPath)) {
                            verbose && warning(`Warning: The file at path "${relativeAssetPath}" does not exist (referenced in ${relativeCssPath}).\n`);
                        }

                        // Return the new url() declaration with the updated path
                        replacement = `url(${quote}${relativePath.replace(/\\/g, "/")}${quote})`;
                    }
                }
                
                // Replace the match in the string
                newValue = newValue.substring(0, matchIndex) + replacement + newValue.substring(matchIndex + fullMatch.length);
            }
            
            decl.value = newValue;
        })();
        
        promises.push(promise);
    });
    
    // Wait for all async operations to complete
    await Promise.all(promises);
    return parsedCSS;
}