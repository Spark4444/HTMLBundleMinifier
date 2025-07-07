const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// Colors for console output
const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m"
};

function log(message, color = colors.reset) {
    console.log(color + message + colors.reset);
}

function testCLI() {
    log("🚀 Starting CLI Tests for HTML Bundle Minifier", colors.cyan);
    log("=".repeat(50), colors.blue);
    
    let passedTests = 0;
    let totalTests = 0;

    // Test 1: Help command
    function testHelp() {
        totalTests++;
        log("\n📋 Test 1: Help command", colors.yellow);
        try {
            const result = execSync(`html-bundle-minifier --help`, { encoding: "utf8" });
            if (result.includes("Usage:") && result.includes("Options:")) {
                log("✅ Help command works correctly", colors.green);
                passedTests++;
            } else {
                log("❌ Help command output is incomplete", colors.red);
            }
        } catch (error) {
            log("❌ Help command failed: " + error.message, colors.red);
        }
    }

    // Test 2: Version command
    function testVersion() {
        totalTests++;
        log("\n📋 Test 2: Version command", colors.yellow);
        try {
            const result = execSync(`html-bundle-minifier --version`, { encoding: "utf8" });
            if (result.trim().match(/^\d+\.\d+\.\d+$/)) {
                log("✅ Version command works correctly: " + result.trim(), colors.green);
                passedTests++;
            } else {
                log("❌ Version command output is invalid: " + result.trim(), colors.red);
            }
        } catch (error) {
            log("❌ Version command failed: " + error.message, colors.red);
        }
    }

    // Test 3: Short help command
    function testShortHelp() {
        totalTests++;
        log("\n📋 Test 3: Short help command (-h)", colors.yellow);
        try {
            const result = execSync(`html-bundle-minifier -h`, { encoding: "utf8" });
            if (result.includes("Usage:") && result.includes("Options:")) {
                log("✅ Short help command works correctly", colors.green);
                passedTests++;
            } else {
                log("❌ Short help command output is incomplete", colors.red);
            }
        } catch (error) {
            log("❌ Short help command failed: " + error.message, colors.red);
        }
    }

    // Test 4: Short version command
    function testShortVersion() {
        totalTests++;
        log("\n📋 Test 4: Short version command (-v)", colors.yellow);
        try {
            const result = execSync(`html-bundle-minifier -v`, { encoding: "utf8" });
            if (result.trim().match(/^\d+\.\d+\.\d+$/)) {
                log("✅ Short version command works correctly: " + result.trim(), colors.green);
                passedTests++;
            } else {
                log("❌ Short version command output is invalid: " + result.trim(), colors.red);
            }
        } catch (error) {
            log("❌ Short version command failed: " + error.message, colors.red);
        }
    }

    // Test 5: File minification with all options
    function testFileMinification() {
        totalTests++;
        log("\n📋 Test 5: File minification (full minification)", colors.yellow);
        try {
            const inputFile = path.join(__dirname, "index.html");
            const outputFile = path.join(__dirname, "output", "test-full.min.html");
            
            // Clean up previous test output
            if (fs.existsSync(outputFile)) {
                fs.unlinkSync(outputFile);
            }
            
            const result = execSync(`html-bundle-minifier -i ${inputFile} -o ${outputFile}`, { encoding: "utf8", cwd: __dirname });
            
            if (fs.existsSync(outputFile)) {
                const stats = fs.statSync(outputFile);
                log(`✅ File minification successful! Output file created (${stats.size} bytes)`, colors.green);
                passedTests++;
            } else {
                log("❌ File minification failed: Output file not created", colors.red);
            }
        } catch (error) {
            log("❌ File minification failed: " + error.message, colors.red);
        }
    }

    // Test 6: File minification without CSS
    function testFileMinificationNoCSS() {
        totalTests++;
        log("\n📋 Test 6: File minification without CSS", colors.yellow);
        try {
            const inputFile = path.join(__dirname, "index.html");
            const outputFile = path.join(__dirname, "output", "test-no-css.min.html");
            
            // Clean up previous test output
            if (fs.existsSync(outputFile)) {
                fs.unlinkSync(outputFile);
            }
            
            const result = execSync(`html-bundle-minifier -i ${inputFile} -o ${outputFile} --no-css`, { encoding: "utf8", cwd: __dirname });
            
            if (fs.existsSync(outputFile)) {
                const stats = fs.statSync(outputFile);
                log(`✅ File minification without CSS successful! Output file created (${stats.size} bytes)`, colors.green);
                passedTests++;
            } else {
                log("❌ File minification without CSS failed: Output file not created", colors.red);
            }
        } catch (error) {
            log("❌ File minification without CSS failed: " + error.message, colors.red);
        }
    }

    // Test 7: File minification without JS
    function testFileMinificationNoJS() {
        totalTests++;
        log("\n📋 Test 7: File minification without JS", colors.yellow);
        try {
            const inputFile = path.join(__dirname, "index.html");
            const outputFile = path.join(__dirname, "output", "test-no-js.min.html");
            
            // Clean up previous test output
            if (fs.existsSync(outputFile)) {
                fs.unlinkSync(outputFile);
            }
            
            const result = execSync(`html-bundle-minifier -i ${inputFile} -o ${outputFile} -j`, { encoding: "utf8", cwd: __dirname });
            
            if (fs.existsSync(outputFile)) {
                const stats = fs.statSync(outputFile);
                log(`✅ File minification without JS successful! Output file created (${stats.size} bytes)`, colors.green);
                passedTests++;
            } else {
                log("❌ File minification without JS failed: Output file not created", colors.red);
            }
        } catch (error) {
            log("❌ File minification without JS failed: " + error.message, colors.red);
        }
    }

    // Test 8: File minification without CSS and JS
    function testFileMinificationNoCSSNoJS() {
        totalTests++;
        log("\n📋 Test 8: File minification without CSS and JS", colors.yellow);
        try {
            const inputFile = path.join(__dirname, "index.html");
            const outputFile = path.join(__dirname, "output", "test-no-css-no-js.min.html");
            
            // Clean up previous test output
            if (fs.existsSync(outputFile)) {
                fs.unlinkSync(outputFile);
            }
            
            const result = execSync(`html-bundle-minifier -i ${inputFile} -o ${outputFile} -c -j`, { encoding: "utf8", cwd: __dirname });
            
            if (fs.existsSync(outputFile)) {
                const stats = fs.statSync(outputFile);
                log(`✅ File minification without CSS and JS successful! Output file created (${stats.size} bytes)`, colors.green);
                passedTests++;
            } else {
                log("❌ File minification without CSS and JS failed: Output file not created", colors.red);
            }
        } catch (error) {
            log("❌ File minification without CSS and JS failed: " + error.message, colors.red);
        }
    }

    // Test 9: Invalid option handling
    function testInvalidOption() {
        totalTests++;
        log("\n📋 Test 9: Invalid option handling", colors.yellow);
        try {
            const result = execSync(`html-bundle-minifier --invalid-option`, { encoding: "utf8" });
            log("❌ Invalid option test failed: Should have thrown an error", colors.red);
        } catch (error) {
            if (error.message.includes("Invalid option")) {
                log("✅ Invalid option handling works correctly", colors.green);
                passedTests++;
            } else {
                log("❌ Invalid option handling failed: " + error.message, colors.red);
            }
        }
    }

    // Test 10: Missing input file for -i option
    function testMissingInputFile() {
        totalTests++;
        log("\n📋 Test 10: Missing input file handling", colors.yellow);
        try {
            const result = execSync(`html-bundle-minifier -i`, { encoding: "utf8" });
            log("❌ Missing input file test failed: Should have thrown an error", colors.red);
        } catch (error) {
            if (error.message.includes("Input file must be specified")) {
                log("✅ Missing input file handling works correctly", colors.green);
                passedTests++;
            } else {
                log("❌ Missing input file handling failed: " + error.message, colors.red);
            }
        }
    }

    // Run all tests
    testHelp();
    testVersion();
    testShortHelp();
    testShortVersion();
    testFileMinification();
    testFileMinificationNoCSS();
    testFileMinificationNoJS();
    testFileMinificationNoCSSNoJS();
    testInvalidOption();
    testMissingInputFile();

    // Summary
    log("\n" + "=".repeat(50), colors.blue);
    log("📊 Test Results Summary:", colors.cyan);
    log(`✅ Passed: ${passedTests}/${totalTests}`, passedTests === totalTests ? colors.green : colors.yellow);
    log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`, totalTests - passedTests === 0 ? colors.green : colors.red);
    
    if (passedTests === totalTests) {
        log("🎉 All tests passed! Your CLI tool is working correctly.", colors.green);
    } else {
        log("⚠️  Some tests failed. Please check the output above.", colors.yellow);
    }
}

// Ensure output directory exists
const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

testCLI();