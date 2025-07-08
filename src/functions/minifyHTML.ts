// Regex patterns for CSS and JS links in HTML saved in regex.json
import { cssRegex, jsRegex } from "../regex";
import { error, success } from "./colors";

// Minify HTML files using html-minifier-terser
export async function minifyHTML(htmlContent: string, outputFile: string, cssContent: string, jsContent: string, minifyCSS: boolean = true, minifyJS: boolean = true, verbose: boolean): Promise<void> {

    const fs = require("fs");
    const minify = require("html-minifier-terser").minify;

    // Minify each related CSS and JS content and store them inside the HTML and save it to the output file
    try {
        // Replace CSS and JS links in the HTML if it's not false e.g. if the user specified the option to not minify CSS or JS
        if (minifyCSS) {
            htmlContent = htmlContent.replace(cssRegex, `<style>${cssContent}</style>`);
        }
        
        if (minifyJS) {
            htmlContent = htmlContent.replace(jsRegex, `<script>${jsContent}</script>`);
        }

        let minifiedHtml = await minify(htmlContent, {
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: {
                mangle: {
                    toplevel: true,
                    properties: {
                        regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*$/
                    }
                },
                compress: {
                    drop_console: false,
                    drop_debugger: true,
                    pure_funcs: []
                }
            },
            processScripts: ["text/javascript"]
        });

        // If the user specified to not minify CSS or JS, remove the links from the HTML without minifying them
        if (!minifyCSS) {
            minifiedHtml = minifiedHtml.replace(cssRegex, `<style>${cssContent}</style>`);
        }
        if (!minifyJS) {
            minifiedHtml = minifiedHtml.replace(jsRegex, `<script>${jsContent}</script>`);
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

        // Replace CSS and JS links in the HTML with the bundled content
        htmlContent = htmlContent.replace(cssRegex, `<style>${cssContent}</style>`);
        htmlContent = htmlContent.replace(jsRegex, `<script>${jsContent}</script>`);

        // Write the bundled HTML to the output file
        fs.writeFileSync(outputFile, htmlContent, "utf8");
        verbose && success(`Bundled HTML saved to ${outputFile}`);
    } 
    catch (err) {
        error("Error bundling HTML:", err);
    }
}