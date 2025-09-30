import { error, success} from "./colors.js";
import replaceCSSJSLinks from "./replaceCSSJSLinks.js";
import { MinifierOptions, HTMLOptions } from "../data/interfaces.js";
import fs from "fs";
import htmlMinifierTerser from "html-minifier-terser";
import { JSDOM } from "jsdom";

// Minify HTML files using html-minifier-terser
export default async function minifyHTML(htmlContent: string, outputFile: string, cssContent: string, jsContent: string, dom: JSDOM, options: MinifierOptions): Promise<void> {
    const minify = htmlMinifierTerser.minify;
    const { 
        minifyCSS,
        minifyJS,
        verbose,
        mangle,
        removeComments,
        removeConsole,
        whitespaces,
        fetchRemote,
        embedAssets
    } = options;

    // Minify each related CSS and JS content and store them inside the HTML and save it to the output file
    try {
        // Remove all existing CSS and JS tags (both linked and inline)
        const htmlOptions: HTMLOptions = {
            verbose: verbose,
            fetchRemote: fetchRemote,
            embedAssets: embedAssets
        };


        // Replace CSS and JS links with their content
        htmlContent = replaceCSSJSLinks(htmlContent, cssContent, dom, "css", htmlOptions);
        
        htmlContent = replaceCSSJSLinks(htmlContent, jsContent, dom, "js", htmlOptions);

        let minifiedHtml = await minify(htmlContent, {
            collapseWhitespace: whitespaces, // Remove unnecessary whitespace
            removeComments: removeComments, // Remove comments
            minifyCSS: minifyCSS ? true : false, // Minify CSS
            minifyJS: minifyJS ? {
                mangle: mangle, // Mangle JS variable names e.g. `let myVariable = 1;` to `let a = 1;` and etc in alphabetical order
                compress: { // Compress JS code
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