const main = require("../dist/index.js");
const path = require("path");

// Override process.exit to prevent early termination during tests
const originalExit = process.exit;
let exitCount = 0;

// Test all possible minification variants
async function testAllVariants() {
    const inputFile = path.join(__dirname, "index.html");
    const outputDir = path.join(__dirname, "output");
    
    console.log("Starting comprehensive minification tests...\n");
    
    // Override process.exit temporarily
    process.exit = () => {
        exitCount++;
        console.log(`Exit call intercepted (${exitCount})\n`);
    };
    
    try {
        // Test 1: Full minification (CSS + JS minified)
        console.log("🔄 Testing: Full minification (CSS + JS)");
        const outputFull = path.join(outputDir, "test-full.min.html");
        await main(inputFile, outputFull, true, true, true, false, false, true);
        
        // Test 2: CSS only minification
        console.log("🔄 Testing: CSS only minification");
        const outputCSSOnly = path.join(outputDir, "test-css-only.min.html");
        await main(inputFile, outputCSSOnly, true, false, true, false, false, true);
        
        // Test 3: JS only minification
        console.log("🔄 Testing: JS only minification");
        const outputJSOnly = path.join(outputDir, "test-js-only.min.html");
        await main(inputFile, outputJSOnly, false, true, true, false, false, true);
        
        // Test 4: No minification (bundle only)
        console.log("🔄 Testing: Bundle only (no minification)");
        const outputBundle = path.join(outputDir, "test-bundle-only.min.html");
        await main(inputFile, outputBundle, false, false, true, false, true, true);
        
        // Test 5: No CSS, no JS (HTML only)
        console.log("🔄 Testing: HTML only (no CSS, no JS)");
        const outputHTMLOnly = path.join(outputDir, "test-html-only.min.html");
        await main(inputFile, outputHTMLOnly, false, false, true, false, false, true);
        
    } 
    finally {
        // Restore original process.exit
        process.exit = originalExit;
    }
    
    console.log("\n✅ All test variants completed!");
    console.log("📁 Check the output folder for results:");
    console.log("  - test-full.min.html (CSS + JS minified)");
    console.log("  - test-css-only.min.html (CSS minified, JS bundled)");
    console.log("  - test-js-only.min.html (JS minified, CSS bundled)");
    console.log("  - test-bundle-only.min.html (both bundled, no minification)");
    console.log("  - test-html-only.min.html (HTML only, no CSS/JS processing)");
}

// Run the tests
testAllVariants().catch(console.error);