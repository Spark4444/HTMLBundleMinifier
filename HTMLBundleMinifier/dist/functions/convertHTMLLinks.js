import htmlTags from "../data/htmlTags.js";
import fetchFile from "web-file-fetcher";
import convertFileToBase64 from "./converFileToBase64.js";
import { warning, success } from "./colors.js";
import { parseSRCSET, stringifySRCSET } from "./parseSRCSET.js";
import { isPathAbsolute } from 'convert-path-to-absolute';
import path from "path";
// Helper function to convert a single attribute value
async function convertAttribute(value, htmlPath, htmlOptions, tag, attr) {
    const { fetchRemote, embedAssets, verbose = false } = htmlOptions;
    if (fetchRemote && value.startsWith("http")) {
        try {
            const fetched = await fetchFile(value);
            verbose && success(`Fetched and embedded remote URL: ${value} (referenced in <${tag} ${attr}>)\n`);
            return fetched;
        }
        catch (error) {
            verbose && warning(`\nWarning: failed to fetch remote URL: ${value} (referenced in <${tag} ${attr}>)\n`);
        }
    }
    else if (embedAssets && !value.startsWith("data:")) {
        // convertFileToBase64 already handles try catch on its own
        const absolutePath = isPathAbsolute(value) ? value : path.resolve(path.dirname(htmlPath), value);
        const base64 = convertFileToBase64(absolutePath, verbose, `Embedded asset: ${value} (referenced in <${tag} ${attr}>)\n`, `Failed to embed asset ${value} (referenced in <${tag} ${attr}>)\n`);
        return base64;
    }
    return value;
}
//  Function to convert all HTML element attribute.links from paths to data from http and local files
export default async function convertHTMLLinks(dom, htmlPath, htmlOptions) {
    const document = dom.window.document;
    const { fetchRemote, embedAssets, verbose = false } = htmlOptions;
    //  Format:
    // htmllTags = {
    //     "img": ["src", "srcset"],
    //     ...
    // }
    for (const [tag, attributes] of Object.entries(htmlTags)) {
        const elements = document.querySelectorAll(tag);
        for (const element of elements) {
            for (const attr of attributes) {
                const value = element.getAttribute(attr);
                //  Everything except srcset should behave the same
                if (value && value !== "srcset") {
                    const converted = await convertAttribute(value, htmlPath, htmlOptions, tag, attr);
                    element.setAttribute(attr, converted);
                }
                // Treat srcset attribute differently
                else if (attr === "srcset" && value) {
                    let parsed = parseSRCSET(value, verbose);
                    for (const item of parsed) {
                        const converted = await convertAttribute(item[0], htmlPath, htmlOptions, tag, attr);
                        item[0] = converted;
                    }
                    element.setAttribute(attr, stringifySRCSET(parsed));
                }
            }
        }
    }
    return dom;
}
//# sourceMappingURL=convertHTMLLinks.js.map