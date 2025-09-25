import fs from "fs";
import { error } from "./colors.js";
import { replaceRelativeCSSPathsAndImports } from "./replaceRelativeCSSPaths.js";
// Function to merge the content of multiple files into a single string
// For the js and css files and inline scripts/styles
function mergeFiles(fileList, type, htmlPath, verbose) {
    let mergedContent = "";
    fileList.forEach((item) => {
        if (item.type === "inline") {
            if (type === "CSS") {
                // For inline CSS, use the HTML file's directory as the base path for relative URLs
                item.content = replaceRelativeCSSPathsAndImports(htmlPath, htmlPath, item.content, verbose);
            }
            mergedContent += item.content + "\n"; // Add a newline for separation
        }
        else if (item.type === "path") {
            const filePath = item.content;
            try {
                let content = fs.readFileSync(filePath, "utf8");
                // If it's a CSS file, replace relative paths to the HTML file
                if (type === "CSS") {
                    content = replaceRelativeCSSPathsAndImports(htmlPath, filePath, content, verbose);
                }
                mergedContent += content + "\n"; // Add a newline for separation
            }
            catch (err) {
                error(`Error reading file ${filePath}:`, err);
            }
        }
    });
    return mergedContent;
}
export default mergeFiles;
//# sourceMappingURL=mergeFiles.js.map