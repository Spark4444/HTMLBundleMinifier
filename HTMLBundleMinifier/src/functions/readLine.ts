import readline from "readline";
import fs from "fs";
import path from "path";
import { log, warning, success } from "./colors.js";
import { FileItem, HTMLOptions } from "../data/interfaces.js";
import { JSDOM } from "jsdom";
import fetchFile from "web-file-fetcher";

export const rs = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Function to ask questions in the console via readline
export function askQuestion(query: string): Promise<string> {
    log("\n");
    return new Promise(resolve => {
        rs.question(query, (answer: string) => {
            let trimmedAnswer: string = answer.trim().toLowerCase();
            if (trimmedAnswer.toLowerCase() === "exit") {
                log("Exiting...");
                rs.close();
                process.exit(0);
            }
            resolve(trimmedAnswer);
        });
    });
}

// Function to prompt for minification options
export async function promptForMinificationOption(variable: boolean, fileType: string, verbose: boolean): Promise<boolean> {
    let prompt: string = await askQuestion(`Do you want to minify ${fileType} files? (y/n, default is y): `);
    if (prompt === "n" || prompt === "no") {
        verbose && success(`Skipping ${fileType} minification.`);
        variable = false;
    }
    else {
        verbose && success(`${fileType} will be minified.`);
        variable = true;
    }
    return variable;
}

// Function to find CSS and JS files in the HTML content using JSDOM
export async function findFiles(content: string, type: string, inputFile: string, dom: JSDOM, htmlOptions: HTMLOptions): Promise<FileItem[]> {
    const { verbose, fetchRemote } = htmlOptions;
    let result: FileItem[] = [];
    const document = dom.window.document;

    if (type === "CSS") {
        // Find external CSS files via <link> tags
        const linkElements = document.querySelectorAll("link[rel=\"stylesheet\"]");
        for (const link of linkElements) {
            const href = link.getAttribute("href");
            if (href && !href.startsWith("http")) { // Skip external links
                verbose && success(`Found ${type} file: ${href} \n`);
                const filePath = path.resolve(path.dirname(inputFile), href);
                
                // Check if the file exists
                if (fs.existsSync(filePath)) {
                    result.push({
                        type: "path",
                        content: filePath
                    });
                } else {
                    // If the file does not exist, warn the user and continue
                    warning(`\nWarning: File ${filePath} does not exist.\n`);
                }
            }
            else if (fetchRemote && href?.startsWith("http")) {
                try {
                    const fetchedResult = await fetchFile(href);
                    if (fetchedResult) {
                        verbose && success(`Found ${type} file (fetched): ${href} \n`);
                        result.push({
                            type: "inline",
                            content: fetchedResult
                        });
                    }
                } catch (error) {
                    warning(`\nWarning: Failed to fetch ${href}.\n`);
                }
            }
        }

        // Find inline CSS content via <style> tags
        const styleElements = document.querySelectorAll("style");
        styleElements.forEach((style) => {
            const inlineContent = style.textContent || "";
            if (inlineContent.trim()) {
                verbose && success(`Found inline ${type} content. \n`);
                result.push({
                    type: "inline",
                    content: inlineContent
                });
            }
        });

    } else if (type === "JS") {
        // Find external JS files via <script> tags with src attribute
        const scriptElements = document.querySelectorAll("script[src]");
        for (const script of scriptElements) {
            const src = script.getAttribute("src");
            if (src && !src.startsWith("http")) { // Skip external links
                verbose && success(`Found ${type} file: ${src} \n`);
                const filePath = path.resolve(path.dirname(inputFile), src);
                
                // Check if the file exists
                if (fs.existsSync(filePath)) {
                    result.push({
                        type: "path",
                        content: filePath
                    });
                } else {
                    // If the file does not exist, warn the user and continue
                    warning(`\nWarning: File ${filePath} does not exist.\n`);
                }
            }
            else if (fetchRemote && src?.startsWith("http")) {
                try {
                    const fetchedResult = await fetchFile(src);
                    if (fetchedResult) {
                        verbose && success(`Found ${type} file (fetched): ${src} \n`);
                        result.push({
                            type: "inline",
                            content: fetchedResult
                        });
                    }
                } catch (error) {
                    warning(`\nWarning: Failed to fetch ${src}.\n`);
                }
            }
        }

        // Find inline JS content via <script> tags without src attribute
        const inlineScriptElements = document.querySelectorAll("script:not([src])");
        inlineScriptElements.forEach((script) => {
            const inlineContent = script.textContent || "";
            if (inlineContent.trim()) {
                verbose && success(`Found inline ${type} content. \n`);
                result.push({
                    type: "inline",
                    content: inlineContent
                });
            }
        });
    }

    return Promise.resolve(result);
}