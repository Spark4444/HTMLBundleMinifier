// Automatic tester for HTMLBundleMinifier
// It will create 3 different minified HTML files:
// 1. Minified with both CSS and JS minification
// 2. Minified without CSS minification
// 3. Minified without JS minification
const { main } = require("../dist/index.js");
const path = require("path");
const pathToCurrentFoler = path.resolve(__dirname, "..");
const pathToOutputFolder = path.join(pathToCurrentFoler, "test", "output");
const pathToHTMLFile = path.join(pathToCurrentFoler, "test", "index.html");
const pathToMinifiedHTMLFile = path.join(pathToOutputFolder, "index.min.html");
const pathToMinifiedWithoutCSSMin = path.join(pathToOutputFolder, "index.min.without-css.html");
const pathToMinifiedWithoutJSMin = path.join(pathToOutputFolder, "index.min.without-js.html");
const pathToMinifiedWithoutCSSAndJSMin = path.join(pathToOutputFolder, "index.min.without-css-and-js.html");

// Arguments explained:
// 1. Path to the HTML file to be minified
// 2. Path to the output file where the minified HTML will be saved
// 3. Whether to minify CSS (true/false)
// 4. Whether to minify JS (true/false)
// 5. Show prompts for disabling CSS/JS minification (true/false)

async function runTests() {
    try {
        await main(pathToHTMLFile, pathToMinifiedHTMLFile, true, true, true);
        await main(pathToHTMLFile, pathToMinifiedWithoutCSSMin, false, true, true);
        await main(pathToHTMLFile, pathToMinifiedWithoutJSMin, true, false, true);
        await main(pathToHTMLFile, pathToMinifiedWithoutCSSAndJSMin, false, false, true);
        console.log("All tests completed successfully!");
        process.exit(0);
    }
    catch (error) {
        console.error("An error occurred during the tests:", error);
        process.exit(1);
    }
}

runTests();