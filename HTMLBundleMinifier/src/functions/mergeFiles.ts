import fs from "fs";
import { error } from "./colors.js";
import { FileItem } from "../data/interfaces.js";
import { replaceRelativeCSSPaths } from "./replaceRelativeCSSPaths.js";

// Function to merge the content of multiple files into a single string
// For the js and css files and inline scripts/styles
function mergeFiles(fileList: FileItem[], type: string, htmlPath: string, verbose: boolean): string {
    let mergedContent = "";
    fileList.forEach((item) => {
        if (item.type === "inline") {
            if (type === "CSS") {
                item.content = replaceRelativeCSSPaths(htmlPath, htmlPath, item.content, verbose);
            }
            mergedContent += item.content + "\n"; // Add a newline for separation
        }
        else if (item.type === "path") {
            const filePath = item.content;
            try {
                let content = fs.readFileSync(filePath, "utf8");
                // If it's a CSS file, replace relative paths to the HTML file
                if (type === "CSS") {
                    content = replaceRelativeCSSPaths(htmlPath, filePath, content, verbose);
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