import replaceRegexPaths from "./replaceRegexPaths";
import replaceCSSImports from "./replaceCSSImports";
import { urlRegexWithQuotes, urlRegexWithoutQuotes, cssImportRegex } from "../data/regexes"; 

// Find all the url() in the CSS file and replace them with relative paths to the HTML file
export function replaceRelativeCSSPaths(htmlPath: string, cssPath: string, cssContent: string, verbose: boolean): string {
    // First replace @imports before other url() replacements
    let result = replaceCSSImports(cssPath, cssContent, cssImportRegex, verbose);

    // First replace quoted URLs
    result = result.replace(urlRegexWithQuotes, (match, quote, urlPath) => {
        return replaceRegexPaths(match, urlPath, cssPath, htmlPath, quote);
    });

    // Then replace unquoted URLs
    result = result.replace(urlRegexWithoutQuotes, (match, urlPath) => {
        return replaceRegexPaths(match, urlPath, cssPath, htmlPath);
    });

    return result;
}