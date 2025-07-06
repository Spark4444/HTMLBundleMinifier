// Regex patterns for CSS and JS links in HTML saved in regex.json
const { cssRegex, jsRegex } = require("./regex.js");

// Minify HTML files using html-minifier-terser
async function minifyHTML(htmlContent, cssContent, jsContent, outputFile) {

    const fs = require("fs");
    const minify = require("html-minifier-terser").minify;

    // Minify each related CSS and JS content and store them inside the HTML and save it to the output file
    try {
        // Replace CSS and JS links in the HTML
        htmlContent = htmlContent.replace(cssRegex, `<style>${cssContent}</style>`);
        htmlContent = htmlContent.replace(jsRegex, `<script>${jsContent}</script>`);

        let minifiedHtml = await minify(htmlContent, {
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: {
                mangle: {
                    toplevel: true,
                    properties: {
                        regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*$/
                    }
                },
                compress: {
                    drop_console: false,
                    drop_debugger: true,
                    pure_funcs: []
                }
            },
            processScripts: ["text/javascript"]
        });

        // Write the minified HTML to the output file
        console.log(outputFile);
        fs.writeFileSync(outputFile, minifiedHtml, "utf8");
        console.log(`Minified HTML saved to ${outputFile}`);
    } 
    catch (error) {
        console.error("Error minifying HTML:", error);
    }
}

module.exports = minifyHTML;