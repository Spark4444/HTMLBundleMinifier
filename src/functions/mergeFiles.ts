const fs = require("fs");

// Function to merge the content of multiple files into a single string
// For the js and css files
function mergeFiles(fileList: string[]): string {
    let mergedContent = "";
    for (const file of fileList) {
        try {
            const content = fs.readFileSync(file, "utf8");
            mergedContent += content + "\n"; // Add a newline for separation
        } catch (error) {
            console.error(`Error reading file ${file}:`, error);
        }
    }
    return mergedContent;
}

export default mergeFiles;