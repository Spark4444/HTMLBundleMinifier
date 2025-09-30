import fs from "fs";
import path from "path";
import postcss from "postcss";
import { warning, success } from "./colors.js";
import replaceRegexPaths from "./replaceRegexPaths.js";
import { HTMLOptions } from "../data/interfaces.js";
import fetchFile from "web-file-fetcher";

// Function to replace @import with css content from the actual file
export default async function replaceCSSImports(parsedCSS: any, cssPath: string, htmlOptions: HTMLOptions): Promise<any> {
    const {
        verbose, 
        fetchRemote
    } = htmlOptions;

    const promises: Promise<void>[] = [];

    parsedCSS.walkAtRules("import", (atRule: any) => {
        const promise = (async () => {
            let importPath = atRule.params.replace(/^(url\()?['"]?/, '').replace(/['"]?\)?;?$/, '');

            const fullImportPath = path.resolve(path.dirname(cssPath), importPath);
            
            // Pre-calculate commonly used path variables for console output
            const cssBasePath = path.dirname(cssPath);
            const relativeCssPath = path.relative(cssBasePath, cssPath);
            const relativeImportPath = path.relative(cssBasePath, fullImportPath);

            if (!importPath.startsWith("http") && !importPath.startsWith("data:")) {
                if (importPath.endsWith(".css") && fs.existsSync(fullImportPath)) { 
                    // Parse and inline the imported CSS content
                    const importedCSS = fs.readFileSync(fullImportPath, "utf8");
                    let importedParsedCSS = postcss.parse(importedCSS);

                    // Replace relative paths in the imported CSS content to match the origin CSS file 
                    // Ignore any errors since it will get double-processed later
                    importedParsedCSS = await replaceRegexPaths(importedParsedCSS, fullImportPath, cssPath, htmlOptions);

                    verbose && success(`Found @import: ${relativeImportPath} in ${relativeCssPath}.\n`);

                    atRule.replaceWith(importedParsedCSS);
                }
                else {
                    verbose && warning(`\nWarning: referenced @import file does not exist or is not a local CSS file: ${importPath} (referenced in ${relativeCssPath})\n`);
                }
            }
            else if (importPath.startsWith("http") && fetchRemote) {
                if (importPath.endsWith(".css")) {
                    try {
                        const result = await fetchFile(importPath);
                        verbose && success(`Fetched remote @import: ${importPath} (referenced in ${relativeCssPath})\n`);
                        atRule.replaceWith(result);
                    } catch (error) {
                        verbose && warning(`\nWarning: failed to fetch remote @import file: ${importPath} (referenced in ${relativeCssPath})\n`);
                    }
                }
            }
        })();
        
        promises.push(promise);
    });
    
    // Wait for all async operations to complete
    await Promise.all(promises);
    return parsedCSS;
}