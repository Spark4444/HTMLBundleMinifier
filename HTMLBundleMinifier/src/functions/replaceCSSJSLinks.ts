import { warning } from "./colors.js";
import { JSDOM } from "jsdom";
import { HTMLOptions } from "./../data/interfaces";

// Function to replace CSS and JS links in HTML with their content using JSDOM
function replaceCSSJSLinks(dom: JSDOM, content: string, tag: string, htmlOptions: HTMLOptions): JSDOM {
    if (content.trim()) {
        const { fetchRemote } = htmlOptions;

        const document = dom.window.document;

        if (tag === "css") {
            // Remove all local CSS link tags and style tags (keep external ones)
            const linkElements = document.querySelectorAll("link[rel=\"stylesheet\"]");
            linkElements.forEach(link => {
                const href = link.getAttribute("href");
                // Remove only local links or remote links if fetchRemote is true
                if (href && !href.match(/^https?:\/\//) || (href && fetchRemote)) {
                    link.remove();
                }
            });

            const styleElements = document.querySelectorAll("style");
            styleElements.forEach(style => {
                style.remove();
            });

            // Insert the compiled CSS in the <head>
            const head = document.querySelector("head");
            if (head) {
                const styleElement = document.createElement("style");
                styleElement.textContent = `\n${content}`;
                head.appendChild(styleElement);
            } else {
                // If no <head> tag found, add at the beginning of <body> or document
                warning("No <head> tag found in the HTML. Adding CSS at the beginning of <body> or document.");
                const body = document.querySelector("body");
                if (body) {
                    const styleElement = document.createElement("style");
                    styleElement.textContent = `\n${content}`;
                    body.insertBefore(styleElement, body.firstChild);
                } else {
                    // Add to document element if no body
                    const styleElement = document.createElement("style");
                    styleElement.textContent = `\n${content}`;
                    document.documentElement.appendChild(styleElement);
                }
            }
        } else {
            // Remove all local script tags (keep external ones)
            const scriptElements = document.querySelectorAll("script");
            scriptElements.forEach(script => {
                const src = script.getAttribute("src");
                if (!src || !src.match(/^https?:\/\//) || (src && fetchRemote)) {
                    script.remove();
                }
            });

            // Insert the compiled JS before </body>
            const body = document.querySelector("body");
            if (body) {
                const scriptElement = document.createElement("script");
                scriptElement.textContent = `\n${content}`;
                body.appendChild(scriptElement);
            } else {
                // If no <body> tag found, add at the end of the document
                warning("No <body> tag found in the HTML. Adding JS at the end of the document.");
                const scriptElement = document.createElement("script");
                scriptElement.textContent = `\n${content}`;
                document.documentElement.appendChild(scriptElement);
            }
        }

        // Return the modified HTML
        return dom;
    }
    else {
        return dom;
    }
}

export default replaceCSSJSLinks;