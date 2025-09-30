import replaceRegexPaths from "./replaceRegexPaths.js";
import replaceCSSImports from "./replaceCSSImports.js";
import postcss from "postcss";
import { error as consoleError } from "./colors.js";
import { HTMLOptions } from "../data/interfaces.js";

// Function to merge all imports and replace relative paths in CSS content
export async function replaceRelativeCSSPathsAndImports(htmlPath: string, cssPath: string, cssContent: string, htmlOptions: HTMLOptions): Promise<string> {
    try {
        const parsedCSS = postcss.parse(cssContent);

        // First replace @imports before other url() replacements
        let result = await replaceCSSImports(parsedCSS, cssPath, htmlOptions);

        // Then relate all url() paths
        result = await replaceRegexPaths(result, cssPath, htmlPath, htmlOptions);

        return result.toString();
    } catch (error) {
        consoleError(`Error processing CSS: ${error}`);
        return cssContent;
    }
}