"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.minifyHTML = minifyHTML;
exports.bundleHTML = bundleHTML;
// Regex patterns for CSS and JS links in HTML saved in regex.json
const colors_1 = require("./colors");
const prettier = __importStar(require("prettier"));
const replaceCSSJSLinks_1 = __importDefault(require("./replaceCSSJSLinks"));
// Minify HTML files using html-minifier-terser
async function minifyHTML(htmlContent, outputFile, cssContent, jsContent, minifyCSS = true, minifyJS = true, verbose) {
    const fs = require("fs");
    const minify = require("html-minifier-terser").minify;
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
            collapseWhitespace: true, // Remove unnecessary whitespace
            removeComments: true, // Remove comments
            minifyCSS: true, // Minify CSS
            minifyJS: {
                mangle: true, // Mangle JS variable names e.g. `let myVariable = 1;` to `let a = 1;` and etc in alphabetical order
                compress: {
                    drop_console: false, // Do not drop console statements
                    drop_debugger: true, // Drop debugger statements
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
// Bundle HTML by replacing CSS and JS links with their content
// This function is used when the user specifies the --bundle option
async function bundleHTML(inputFile, outputFile, cssContent, jsContent, verbose) {
    const fs = require("fs");
    try {
        // Read the HTML file content
        let htmlContent = fs.readFileSync(inputFile, "utf8");
        htmlContent = (0, replaceCSSJSLinks_1.default)(htmlContent, cssContent, "css");
        htmlContent = (0, replaceCSSJSLinks_1.default)(htmlContent, jsContent, "js");
        const prettifiedHtml = await prettier.format(htmlContent, {
            parser: "html",
            printWidth: 120, // Longer line length for HTML
            tabWidth: 4, // 4 spaces per tab level
            useTabs: false, // Use spaces instead of tabs (more standard)
            htmlWhitespaceSensitivity: "ignore", // Better formatting for HTML
            bracketSameLine: false, // Put > on new line for multi-line tags
            singleQuote: false, // Use double quotes for HTML attributes
            endOfLine: "lf" // Consistent line endings
        });
        // Write the bundled HTML to the output file
        fs.writeFileSync(outputFile, prettifiedHtml, "utf8");
        verbose && (0, colors_1.success)(`Bundled HTML saved to ${outputFile}`);
    }
    catch (err) {
        (0, colors_1.error)("Error bundling HTML:", err);
    }
}
//# sourceMappingURL=minifyHTML.js.map