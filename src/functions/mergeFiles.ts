import fs from "fs";
import { error } from "./colors";

interface FileItem {
    type: "inline" | "path";
    content: string;
}

// Function to merge the content of multiple files into a single string
// For the js and css files and inline scripts/styles
function mergeFiles(fileList: FileItem[]): string {
    let mergedContent = "";
    fileList.forEach((item) => {
        if (item.type === "inline") {
            mergedContent += item.content + "\n"; // Add a newline for separation
        }
        else if (item.type === "path") {
            const filePath = item.content;
            try {
                const content = fs.readFileSync(filePath, "utf8");
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