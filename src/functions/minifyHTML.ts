// Regex patterns for CSS and JS links in HTML saved in regex.json
import { error, success} from "./colors";
import * as prettier from "prettier";
import replaceCSSJSLinks from "./replaceCSSJSLinks";

// Minify HTML files using html-minifier-terser
export async function minifyHTML(htmlContent: string, outputFile: string, cssContent: string, jsContent: string, minifyCSS: boolean = true, minifyJS: boolean = true, verbose: boolean): Promise<void> {
    const fs = require("fs");
    const minify = require("html-minifier-terser").minify;

    // Minify each related CSS and JS content and store them inside the HTML and save it to the output file
    try {
        // Remove all existing CSS and JS tags (both linked and inline)
        if (minifyCSS) {
            htmlContent = replaceCSSJSLinks(htmlContent, cssContent, "css");
        }
        
        if (minifyJS) {
            htmlContent = replaceCSSJSLinks(htmlContent, jsContent, "js");
        }

        let minifiedHtml = await minify(htmlContent, {
            collapseWhitespace: true, // Remove unnecessary whitespace
            removeComments: true, // Remove comments
            minifyCSS: true, // Minify CSS
            minifyJS: {
                mangle: true, // Mangle JS variable names e.g. `let myVariable = 1;` to `let a = 1;` and etc in alphabetical order
                compress: { // Compress JS code
                    drop_console: false, // Do not drop console statements
                    drop_debugger: true, // Drop debugger statements
                    pure_funcs: [] // List of functions to be removed from the code
                }
            },
            processScripts: ["text/javascript"]
        });

        // If the user specified to not minify CSS or JS, replace the links after minification
        if (!minifyCSS) {
            minifiedHtml = replaceCSSJSLinks(minifiedHtml, cssContent, "css");
        }
        if (!minifyJS) {
            minifiedHtml = replaceCSSJSLinks(minifiedHtml, jsContent, "js");
        }

        // Write the minified HTML to the output file
        fs.writeFileSync(outputFile, minifiedHtml, "utf8");
        verbose && success(`Minified HTML saved to ${outputFile}`);
    } 
    catch (err) {
        error("Error minifying HTML:", err);
    }
}

// Bundle HTML by replacing CSS and JS links with their content
// This function is used when the user specifies the --bundle option
export async function bundleHTML(inputFile: string, outputFile: string, cssContent: string, jsContent: string, verbose: boolean): Promise<void> {
    const fs = require("fs");

    try {
        // Read the HTML file content
        let htmlContent = fs.readFileSync(inputFile, "utf8");

        htmlContent = replaceCSSJSLinks(htmlContent, cssContent, "css");
        htmlContent = replaceCSSJSLinks(htmlContent, jsContent, "js");

        const prettifiedHtml = await prettier.format(htmlContent, {
            parser: "html",
            printWidth: 120,           // Longer line length for HTML
            tabWidth: 4,               // 4 spaces per tab level
            useTabs: false,            // Use spaces instead of tabs (more standard)
            htmlWhitespaceSensitivity: "ignore", // Better formatting for HTML
            bracketSameLine: false,    // Put > on new line for multi-line tags
            singleQuote: false,        // Use double quotes for HTML attributes
            endOfLine: "lf"            // Consistent line endings
        });

        // Write the bundled HTML to the output file
        fs.writeFileSync(outputFile, prettifiedHtml, "utf8");
        verbose && success(`Bundled HTML saved to ${outputFile}`);
    } 
    catch (err) {
        error("Error bundling HTML:", err);
    }
}