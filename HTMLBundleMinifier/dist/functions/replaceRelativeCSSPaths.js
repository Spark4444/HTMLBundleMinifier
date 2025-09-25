import replaceRegexPaths from "./replaceRegexPaths.js";
import replaceCSSImports from "./replaceCSSImports.js";
import postcss from "postcss";
import { error as consoleError } from "./colors.js";
// Function to mergex all imports and replace relative paths in CSS content
export function replaceRelativeCSSPathsAndImports(htmlPath, cssPath, cssContent, verbose) {
    try {
        const parsedCSS = postcss.parse(cssContent);
        // First replace @imports before other url() replacements
        let result = replaceCSSImports(parsedCSS, cssPath, verbose);
        // Then relate all url() paths
        result = replaceRegexPaths(result, cssPath, htmlPath, verbose);
        return result.toString();
    }
    catch (error) {
        consoleError(`Error processing CSS: ${error}`);
        return cssContent;
    }
}
//# sourceMappingURL=replaceRelativeCSSPaths.js.map