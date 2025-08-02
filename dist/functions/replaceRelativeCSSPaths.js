"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceRelativeCSSPaths = replaceRelativeCSSPaths;
const replaceRegexPaths_1 = __importDefault(require("./replaceRegexPaths"));
const replaceCSSImports_1 = __importDefault(require("./replaceCSSImports"));
const regexes_1 = require("../data/regexes");
// Find all the url() in the CSS file and replace them with relative paths to the HTML file
function replaceRelativeCSSPaths(htmlPath, cssPath, cssContent, verbose) {
    // First replace @imports before other url() replacements
    let result = (0, replaceCSSImports_1.default)(cssPath, cssContent, regexes_1.cssImportRegex, verbose);
    // First replace quoted URLs
    result = result.replace(regexes_1.urlRegexWithQuotes, (match, quote, urlPath) => {
        return (0, replaceRegexPaths_1.default)(match, urlPath, cssPath, htmlPath, quote);
    });
    // Then replace unquoted URLs
    result = result.replace(regexes_1.urlRegexWithoutQuotes, (match, urlPath) => {
        return (0, replaceRegexPaths_1.default)(match, urlPath, cssPath, htmlPath);
    });
    return result;
}
//# sourceMappingURL=replaceRelativeCSSPaths.js.map