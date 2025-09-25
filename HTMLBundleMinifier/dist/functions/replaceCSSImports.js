import fs from "fs";
import path from "path";
import postcss from "postcss";
import { warning, success } from "./colors.js";
import replaceRegexPaths from "./replaceRegexPaths.js";
// Function to replace @import with css content from the actual file
export default function replaceCSSImports(parsedCSS, cssPath, verbose) {
    parsedCSS.walkAtRules('import', (atRule) => {
        let importPath = atRule.params.replace(/^(url\()?['"]?/, '').replace(/['"]?\)?;?$/, '');
        const fullImportPath = path.resolve(path.dirname(cssPath), importPath);
        if (!importPath.startsWith("http") && !importPath.startsWith("data:")) {
            if (importPath.endsWith(".css") && fs.existsSync(fullImportPath)) {
                // Parse and inline the imported CSS content
                const importedCSS = fs.readFileSync(fullImportPath, "utf8");
                let importedParsedCSS = postcss.parse(importedCSS);
                // Replace relative paths in the imported CSS content to match the origin CSS file 
                // Ignore any errors since it will get double-processed later
                importedParsedCSS = replaceRegexPaths(importedParsedCSS, fullImportPath, cssPath, false);
                verbose && success(`Found @import: ${path.relative(path.dirname(cssPath), fullImportPath)} in ${path.relative(path.dirname(cssPath), cssPath)}.\n`);
                atRule.replaceWith(importedParsedCSS);
            }
            else {
                verbose && warning(`\nWarning: referenced @import file does not exist or is not a local CSS file: ${importPath} (referenced in ${path.relative(path.dirname(cssPath), cssPath)})\n`);
            }
        }
        else {
            // Skip for now
        }
    });
    return parsedCSS;
}
//# sourceMappingURL=replaceCSSImports.js.map