import { stringToDataURI } from "web-file-fetcher";
import fs from "fs";
import { warning, success } from "./colors.js";

// Function to convert a file to a Base64 data URI
// Warning: it increases the file size by 33%;
export default function convertFileToBase64(filePath: string, verbose: boolean): string {
    if (!fs.existsSync(filePath)) {
        verbose && warning(`\nWarning: File ${filePath} does not exist.\n`);
        // Return the file path back
        return filePath;
    }

    const fileContent = fs.readFileSync(filePath);
    verbose && success(`Embedded asset: ${filePath}\n`);
    return stringToDataURI(fileContent, filePath);
}