import { warning } from "./colors.js";

// Function to parse srcset attribute in ["URL", "descriptor"] format
export function parseSRCSET(srcset: string, verbose: boolean): string[][] {
    const result = srcset.split(",").map(entry => entry.trim().split(" "));
    result.forEach(entry => {
        if (entry.length > 2) {
            verbose && warning(`Warning: Invalid srcset entry "${entry.join(" ")}". Each entry should contain only a URL and an optional descriptor.`);
        }
    });

    return result;
}

//  Function to stringify parsed srcset back to string format
export function stringifySRCSET(parsed: string[][]): string {
    return parsed.map(entry => entry.join(" ")).join(", ");
}