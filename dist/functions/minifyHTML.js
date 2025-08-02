"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = minifyHTML;
const colors_1 = require("./colors");
const replaceCSSJSLinks_1 = __importDefault(require("./replaceCSSJSLinks"));
// Minify HTML files using html-minifier-terser
async function minifyHTML(htmlContent, outputFile, cssContent, jsContent, options) {
    const fs = require("fs");
    const minify = require("html-minifier-terser").minify;
    const { minifyCSS, minifyJS, verbose, mangle, removeComments, removeConsole, whitespaces } = options;
    // Minify each related CSS and JS content and store them inside the HTML and save it to the output file
    try {
        // Remove all existing CSS and JS tags (both linked and inline)
        if (minifyCSS) {
            htmlContent = (0, replaceCSSJSLinks_1.default)(htmlContent, cssContent, "css");
        }
        if (minifyJS) {
            htmlContent = (0, replaceCSSJSLinks_1.default)(htmlContent, jsContent, "js");
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
            minifiedHtml = (0, replaceCSSJSLinks_1.default)(minifiedHtml, cssContent, "css");
        }
        if (!minifyJS) {
            minifiedHtml = (0, replaceCSSJSLinks_1.default)(minifiedHtml, jsContent, "js");
        }
        // Write the minified HTML to the output file
        fs.writeFileSync(outputFile, minifiedHtml, "utf8");
        verbose && (0, colors_1.success)(`Minified HTML saved to ${outputFile}`);
    }
    catch (err) {
        (0, colors_1.error)("Error minifying HTML:", err);
    }
}
//# sourceMappingURL=minifyHTML.js.map