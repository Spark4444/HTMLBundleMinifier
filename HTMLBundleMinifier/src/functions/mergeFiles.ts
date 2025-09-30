import fs from "fs";
import { error } from "./colors.js";
import { FileItem, HTMLOptions } from "../data/interfaces.js";
import { replaceRelativeCSSPathsAndImports } from "./replaceRelativeCSSPaths.js";

// Function to merge the content of multiple files into a single string
// For the js and css files and inline scripts/styles
async function mergeFiles(fileList: FileItem[], type: string, htmlPath: string, htmlOptions: HTMLOptions): Promise<string> {
    let mergedContent = "";
    for (const item of fileList) {
        if (item.type === "inline") {
            if (type === "CSS") {
                // For inline CSS, use the HTML file's directory as the base path for relative URLs
                item.content = await replaceRelativeCSSPathsAndImports(htmlPath, htmlPath, item.content, htmlOptions);
            }
            mergedContent += item.content + "\n"; // Add a newline for separation
        }
        else if (item.type === "path") {
            const filePath = item.content;
            try {
                let content = fs.readFileSync(filePath, "utf8");
                // If it's a CSS file, replace relative paths to the HTML file
                if (type === "CSS") {
                    content = await replaceRelativeCSSPathsAndImports(htmlPath, filePath, content, htmlOptions);
                }
                mergedContent += content + "\n"; // Add a newline for separation
            }
            catch (err) {
                error(`Error reading file ${filePath}:`, err);
            }
        }
    }
    return mergedContent;
}

export default mergeFiles;