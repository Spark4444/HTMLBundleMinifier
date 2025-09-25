import { removeStylesAndLinksRegex, removeAllScriptsRegex } from "../data/regexes.js";
import { warning } from "./colors.js";
// Function to replace CSS and JS links in HTML with their content
function replaceCSSJSLinks(htmlContent, content, tag) {
    if (content.trim()) {
        if (tag === "css") {
            htmlContent = htmlContent.replace(removeStylesAndLinksRegex, ""); // Remove all <link> and <style> tags
            // Insert the compiled CSS in the <head>
            const headCloseIndex = htmlContent.indexOf("</head>");
            if (headCloseIndex !== -1) {
                htmlContent = htmlContent.slice(0, headCloseIndex) + `<style>\n${content}</style>\n` + htmlContent.slice(headCloseIndex);
            }
            else {
                // If no </head> tag found, add at the beginning of <body> or document
                warning("No </head> tag found in the HTML. Adding CSS at the beginning of <body> or document.");
                const bodyIndex = htmlContent.indexOf("<body");
                if (bodyIndex !== -1) {
                    htmlContent = htmlContent.slice(0, bodyIndex) + `<style>\n${content}</style>\n` + htmlContent.slice(bodyIndex);
                }
            }
        }
        else {
            htmlContent = htmlContent.replace(removeAllScriptsRegex, ""); // Remove all <script> tags
            // Insert the compiled JS before </body>
            const bodyCloseIndex = htmlContent.lastIndexOf("</body>");
            if (bodyCloseIndex !== -1) {
                htmlContent = htmlContent.slice(0, bodyCloseIndex) + `<script>\n${content}</script>\n` + htmlContent.slice(bodyCloseIndex);
            }
            else {
                // If no </body> tag found, add at the end of the document
                warning("No </body> tag found in the HTML. Adding JS at the end of the document.");
                htmlContent += `<script>\n${content}</script>`;
            }
        }
    }
    return htmlContent;
}
export default replaceCSSJSLinks;
//# sourceMappingURL=replaceCSSJSLinks.js.map