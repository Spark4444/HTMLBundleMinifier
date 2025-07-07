"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Regex patterns for CSS and JS links in HTML saved in regex.json
const regex_1 = require("../regex");
// Minify HTML files using html-minifier-terser
async function minifyHTML(htmlContent, outputFile, cssContent, jsContent, minifyCSS = true, minifyJS = true) {
    const fs = require("fs");
    const minify = require("html-minifier-terser").minify;
    // Minify each related CSS and JS content and store them inside the HTML and save it to the output file
    try {
        // Replace CSS and JS links in the HTML if it's not false e.g. if the user specified the option to not minify CSS or JS
        if (minifyCSS) {
            htmlContent = htmlContent.replace(regex_1.cssRegex, `<style>${cssContent}</style>`);
        }
        if (minifyJS) {
            htmlContent = htmlContent.replace(regex_1.jsRegex, `<script>${jsContent}</script>`);
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
            minifiedHtml = minifiedHtml.replace(regex_1.cssRegex, `<style>${cssContent}</style>`);
        }
        if (!minifyJS) {
            minifiedHtml = minifiedHtml.replace(regex_1.jsRegex, `<script>${jsContent}</script>`);
        }
        // Write the minified HTML to the output file
        fs.writeFileSync(outputFile, minifiedHtml, "utf8");
        console.log(`Minified HTML saved to ${outputFile}`);
    }
    catch (error) {
        console.error("Error minifying HTML:", error);
    }
}
exports.default = minifyHTML;
//# sourceMappingURL=minifyHTML.js.map