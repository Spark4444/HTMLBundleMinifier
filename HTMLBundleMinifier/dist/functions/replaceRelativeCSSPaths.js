import replaceRegexPaths from "./replaceRegexPaths.js";
import replaceCSSImports from "./replaceCSSImports.js";
import { urlRegexWithQuotes, urlRegexWithoutQuotes, cssImportRegex } from "../data/regexes.js";
import { removeCSSComments, restoreCSSComments } from "./CSSComments.js";
// Find all the url() in the CSS file and replace them with relative paths to the HTML file
export function replaceRelativeCSSPaths(htmlPath, cssPath, cssContent, verbose) {
    // Remove comments first to avoid messing with @import and url() regexes
    const { cssContent: updatedCSSContent, comments, commentPlaceholders } = removeCSSComments(cssContent);
    // First replace @imports before other url() replacements
    let result = replaceCSSImports(cssPath, updatedCSSContent, cssImportRegex, verbose);
    // Remove the comments after replacing imports
    const { cssContent: finalCSSContent, comments: finalComments, commentPlaceholders: finalCommentPlaceholders } = removeCSSComments(result, comments, commentPlaceholders);
    result = finalCSSContent;
    // First replace quoted URLs
    result = result.replace(urlRegexWithQuotes, (match, quote, urlPath) => {
        return replaceRegexPaths(match, urlPath, cssPath, htmlPath, quote);
    });
    // Then replace unquoted URLs
    result = result.replace(urlRegexWithoutQuotes, (match, urlPath) => {
        return replaceRegexPaths(match, urlPath, cssPath, htmlPath);
    });
    // Restore comments
    result = restoreCSSComments(result, comments, commentPlaceholders);
    return result;
}
//# sourceMappingURL=replaceRelativeCSSPaths.js.map