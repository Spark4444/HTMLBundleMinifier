import { stringToDataURI } from "web-file-fetcher";
import fs from "fs";
import { warning, success } from "./colors.js";
// Function to convert a file to a Base64 data URI
// Warning: it increases the file size by 33%;
export default function convertFileToBase64(filePath, verbose, successMessage = `Embedded asset: ${filePath}\n`, errorMessage = `Failed to embed asset ${filePath}\n`) {
    try {
        if (!fs.existsSync(filePath)) {
            verbose && warning(errorMessage);
            // Return the file path back
            return filePath;
        }
        const fileContent = fs.readFileSync(filePath);
        verbose && success(successMessage);
        return stringToDataURI(fileContent, filePath);
    }
    catch (err) {
        verbose && warning(errorMessage);
        return filePath;
    }
}
//# sourceMappingURL=converFileToBase64.js.map