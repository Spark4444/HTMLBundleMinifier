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
exports.default = bundleHTML;
const prettier = __importStar(require("prettier"));
const replaceCSSJSLinks_1 = __importDefault(require("./replaceCSSJSLinks"));
const colors_1 = require("./colors");
// Bundle HTML by replacing CSS and JS links with their content
// This function is used when the user specifies the --bundle option
async function bundleHTML(inputFile, outputFile, cssContent, jsContent, options) {
    const fs = require("fs");
    const { prettify, verbose } = options;
    try {
        // Read the HTML file content
        let htmlContent = fs.readFileSync(inputFile, "utf8");
        htmlContent = (0, replaceCSSJSLinks_1.default)(htmlContent, cssContent, "css");
        htmlContent = (0, replaceCSSJSLinks_1.default)(htmlContent, jsContent, "js");
        let prettifiedHtml = htmlContent;
        // If the user specified to prettify the HTML, use prettier to format it
        if (prettify) {
            prettifiedHtml = await prettier.format(htmlContent, {
                parser: "html",
                printWidth: 120, // Longer line length for HTML
                tabWidth: 4, // 4 spaces per tab level
                useTabs: false, // Use spaces instead of tabs (more standard)
                htmlWhitespaceSensitivity: "ignore", // Better formatting for HTML
                bracketSameLine: false, // Put > on new line for multi-line tags
                singleQuote: false, // Use double quotes for HTML attributes
                endOfLine: "lf" // Consistent line endings
            });
        }
        // Write the bundled HTML to the output file
        fs.writeFileSync(outputFile, prettifiedHtml, "utf8");
        verbose && (0, colors_1.success)(`Bundled HTML saved to ${outputFile}`);
    }
    catch (err) {
        (0, colors_1.error)("Error bundling HTML:", err);
    }
}
//# sourceMappingURL=bundleHTML.js.map