#!/usr/bin/env node

const path = require("path");

// Import the main function from the index.js file
const { main } = require(path.join(__dirname, "..", "src", "index.js"));

const args = process.argv.slice(2);
const options = {
    inputFile: args[0] || undefined,
    outputFile: args[1] || undefined
}

// Start the CLI application
main().catch(error => {
    console.error("An error occurred:", error);
    process.exit(1);
});