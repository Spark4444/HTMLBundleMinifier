// Regex patterns for CSS and JS links in HTML saved in regex.json
import { removeStylesAndLinksRegex, removeAllScriptsRegex } from "../regex";
import { error, success, warning } from "./colors";
import * as prettier from "prettier";

// Function to replace CSS and JS links in HTML with their content
function replaceCSSJSLinks(htmlContent: string, content: string, tag: string): string {
    if (content.trim()) {
        if (tag === "css") {
            htmlContent = htmlContent.replace(removeStylesAndLinksRegex, ""); // Remove all <link> and <style> tags


            // Insert the compiled CSS in the <head>
            const headCloseIndex = htmlContent.indexOf("</head>");
            if (headCloseIndex !== -1) {
                htmlContent = htmlContent.slice(0, headCloseIndex) + `<style>\n${content}</style>\n` + htmlContent.slice(headCloseIndex);
            } 
            else {
                // If no </head> tag found, add at the beginning of <body> or document
                warning("No </head> tag found in the HTML. Adding CSS at the beginning of <body> or document.");
                const bodyIndex = htmlContent.indexOf("<body");
                if (bodyIndex !== -1) {
                    htmlContent = htmlContent.slice(0, bodyIndex) + `<style>\n${content}</style>\n` + htmlContent.slice(bodyIndex);
                }
            }
        }

        else {
            htmlContent = htmlContent.replace(removeAllScriptsRegex, ""); // Remove all <script> tags

            // Insert the compiled JS before </body>
            const bodyCloseIndex = htmlContent.lastIndexOf("</body>");
            if (bodyCloseIndex !== -1) {
                htmlContent = htmlContent.slice(0, bodyCloseIndex) + `<script>\n${content}</script>\n` + htmlContent.slice(bodyCloseIndex);
            } 
            else {
                // If no </body> tag found, add at the end of the document
                warning("No </body> tag found in the HTML. Adding JS at the end of the document.");
                htmlContent += `<script>\n${content}</script>`;
            }
        }

    }
    
    return htmlContent;
}

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
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: {
                mangle: true,
                compress: {
                    drop_console: false,
                    drop_debugger: true,
                    pure_funcs: []
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