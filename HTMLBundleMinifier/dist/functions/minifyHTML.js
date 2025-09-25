import { error, success } from "./colors.js";
import replaceCSSJSLinks from "./replaceCSSJSLinks.js";
import fs from "fs";
import htmlMinifierTerser from "html-minifier-terser";
// Minify HTML files using html-minifier-terser
export default async function minifyHTML(htmlContent, outputFile, cssContent, jsContent, dom, options) {
    const minify = htmlMinifierTerser.minify;
    const { minifyCSS, minifyJS, verbose, mangle, removeComments, removeConsole, whitespaces } = options;
    // Minify each related CSS and JS content and store them inside the HTML and save it to the output file
    try {
        // Remove all existing CSS and JS tags (both linked and inline)
        if (minifyCSS) {
            htmlContent = replaceCSSJSLinks(htmlContent, cssContent, dom, "css");
        }
        if (minifyJS) {
            htmlContent = replaceCSSJSLinks(htmlContent, jsContent, dom, "js");
        }
        let minifiedHtml = await minify(htmlContent, {
            collapseWhitespace: whitespaces, // Remove unnecessary whitespace
            removeComments: removeComments, // Remove comments
            minifyCSS: true, // Minify CSS
            minifyJS: {
                mangle: mangle, // Mangle JS variable names e.g. `let myVariable = 1;` to `let a = 1;` and etc in alphabetical order
                compress: {
                    drop_console: removeConsole, // Remove console statements
                    drop_debugger: true, // Remove debugger statements
                    pure_funcs: [] // List of functions to be removed from the code
                }
            },
            processScripts: ["text/javascript"]
        });
        // If the user specified to not minify CSS or JS, replace the links after minification
        if (!minifyCSS) {
            minifiedHtml = replaceCSSJSLinks(minifiedHtml, cssContent, dom, "css");
        }
        if (!minifyJS) {
            minifiedHtml = replaceCSSJSLinks(minifiedHtml, jsContent, dom, "js");
        }
        // Write the minified HTML to the output file
        fs.writeFileSync(outputFile, minifiedHtml, "utf8");
        verbose && success(`Minified HTML saved to ${outputFile}`);
    }
    catch (err) {
        error("Error minifying HTML:", err);
    }
}
//# sourceMappingURL=minifyHTML.js.map