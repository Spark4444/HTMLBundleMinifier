import replaceRegexPaths from "./replaceRegexPaths.js";
import replaceCSSImports from "./replaceCSSImports.js";
import postcss from "postcss";
// Function to mergex all imports and replace relative paths in CSS content
export function replaceRelativeCSSPathsAndImports(htmlPath, cssPath, cssContent, verbose) {
    const parsedCSS = postcss.parse(cssContent);
    // First replace @imports before other url() replacements
    let result = replaceCSSImports(parsedCSS, cssPath, verbose);
    // Then relate all url() paths
    result = replaceRegexPaths(result, cssPath, htmlPath, verbose);
    return result.toString();
}
//# sourceMappingURL=replaceRelativeCSSPaths.js.map