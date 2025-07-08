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
Object.defineProperty(exports, "__esModule", { value: true });
exports.minifyHTML = minifyHTML;
exports.bundleHTML = bundleHTML;
// Regex patterns for CSS and JS links in HTML saved in regex.json
const regex_1 = require("../regex");
const colors_1 = require("./colors");
const prettier = __importStar(require("prettier"));
// Function to replace CSS and JS links in HTML with their content
function replaceCSSJSLinks(htmlContent, content, tag) {
    if (content.trim()) {
        if (tag === "css") {
            // Remove all <link> tags for stylesheets
            htmlContent = htmlContent.replace(regex_1.cssRegex, "");
            // Remove all existing <style> tags (inline CSS)
            htmlContent = htmlContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
            // Insert the compiled CSS in the <head>
            const headCloseIndex = htmlContent.indexOf("</head>");
            if (headCloseIndex !== -1) {
                htmlContent = htmlContent.slice(0, headCloseIndex) + `<style>\n${content}</style>\n` + htmlContent.slice(headCloseIndex);
            }
            else {
                // If no </head> tag found, add at the beginning of <body> or document
                (0, colors_1.warning)("No </head> tag found in the HTML. Adding CSS at the beginning of <body> or document.");
                const bodyIndex = htmlContent.indexOf("<body");
                if (bodyIndex !== -1) {
                    htmlContent = htmlContent.slice(0, bodyIndex) + `<style>\n${content}</style>\n` + htmlContent.slice(bodyIndex);
                }
            }
        }
        else {
            // Remove all <script> tags (both with src and inline)
            htmlContent = htmlContent.replace(regex_1.jsRegex, "");
            htmlContent = htmlContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
            // Insert the compiled JS before </body>
            const bodyCloseIndex = htmlContent.lastIndexOf("</body>");
            if (bodyCloseIndex !== -1) {
                htmlContent = htmlContent.slice(0, bodyCloseIndex) + `<script>\n${content}</script>\n` + htmlContent.slice(bodyCloseIndex);
            }
            else {
                // If no </body> tag found, add at the end of the document
                (0, colors_1.warning)("No </body> tag found in the HTML. Adding JS at the end of the document.");
                htmlContent += `<script>\n${content}</script>`;
            }
        }
    }
    return htmlContent;
}
// Minify HTML files using html-minifier-terser
async function minifyHTML(htmlContent, outputFile, cssContent, jsContent, minifyCSS = true, minifyJS = true, verbose) {
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
        // If the user specified to not minify CSS or JS, replace the links after minification
        if (!minifyCSS) {
            minifiedHtml = replaceCSSJSLinks(minifiedHtml, cssContent, "css");
        }
        if (!minifyJS) {
            minifiedHtml = replaceCSSJSLinks(minifiedHtml, jsContent, "js");
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
        htmlContent = replaceCSSJSLinks(htmlContent, cssContent, "css");
        htmlContent = replaceCSSJSLinks(htmlContent, jsContent, "js");
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