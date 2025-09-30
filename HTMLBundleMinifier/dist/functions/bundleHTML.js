import * as prettier from "prettier";
import replaceCSSJSLinks from "./replaceCSSJSLinks.js";
import { error, success } from "./colors.js";
import fs from "fs";
// Bundle HTML by replacing CSS and JS links with their content
// This function is used when the user specifies the --bundle option
export default async function bundleHTML(inputFile, outputFile, cssContent, jsContent, dom, options) {
    const { prettify, verbose, fetchRemote, embedAssets } = options;
    try {
        // Read the HTML file content
        let htmlContent = fs.readFileSync(inputFile, "utf8");
        const htmlOptions = {
            verbose: verbose,
            fetchRemote: fetchRemote,
            embedAssets: embedAssets
        };
        htmlContent = replaceCSSJSLinks(htmlContent, cssContent, dom, "css", htmlOptions);
        htmlContent = replaceCSSJSLinks(htmlContent, jsContent, dom, "js", htmlOptions);
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
        verbose && success(`Bundled HTML saved to ${outputFile}`);
    }
    catch (err) {
        error("Error bundling HTML:", err);
    }
}
//# sourceMappingURL=bundleHTML.js.map