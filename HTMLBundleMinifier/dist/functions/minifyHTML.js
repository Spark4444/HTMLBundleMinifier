import { error, success } from "./colors.js";
import fs from "fs";
import htmlMinifierTerser from "html-minifier-terser";
// Minify HTML files using html-minifier-terser
export default async function minifyHTML(htmlContent, outputFile, options) {
    const minify = htmlMinifierTerser.minify;
    const { minifyCSS, minifyJS, verbose, mangle, removeComments, removeConsole, whitespaces, fetchRemote, embedAssets } = options;
    // Minify each related CSS and JS content and store them inside the HTML and save it to the output file
    try {
        let minifiedHtml = await minify(htmlContent, {
            collapseWhitespace: whitespaces, // Remove unnecessary whitespace
            removeComments: removeComments, // Remove comments
            minifyCSS: minifyCSS ? true : false, // Minify CSS
            minifyJS: minifyJS ? {
                mangle: mangle, // Mangle JS variable names e.g. `let myVariable = 1;` to `let a = 1;` and etc in alphabetical order
                compress: {
                    drop_console: removeConsole, // Remove console statements
                    drop_debugger: true, // Remove debugger statements
                    pure_funcs: [] // List of functions to be removed from the code
                }
            } : false,
            processScripts: ["text/javascript"]
        });
        // Write the minified HTML to the output file
        fs.writeFileSync(outputFile, minifiedHtml, "utf8");
        verbose && success(`Minified HTML saved to ${outputFile}`);
    }
    catch (err) {
        error("Error minifying HTML:", err);
    }
}
//# sourceMappingURL=minifyHTML.js.map