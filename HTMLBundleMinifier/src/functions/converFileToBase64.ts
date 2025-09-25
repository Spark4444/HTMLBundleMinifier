import { stringToDataURI } from "web-file-fetcher";
import fs from "fs";
import { error } from "./colors.js";

// Function to convert a file to a Base64 data URI
// Warning: it increases the file size by 33%
export function convertFileToBase64(filePath: string): string {
    if (!fs.existsSync(filePath)) {
        error(`File not found: ${filePath}`);
        // Return the file path back
        return filePath;
    }

    const fileContent = fs.readFileSync(filePath);
    return stringToDataURI(fileContent, filePath);
}