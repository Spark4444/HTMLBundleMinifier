// readLine.ts/findFiles
// Merging regex patterns for HTML minification
// <link rel="stylesheet" href="path"> 
export const linkRegex = /<link\s+rel=["']stylesheet["']\s+href=["']([^"']+)["'][^>]*>/g;
// <script src="path">...</script>
export const scriptRegex = /<script\s+src=["']([^"']+)["'][^>]*><\/script>/g;
// <style>...</style>
export const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
// <script>...</script>
export const inlineScriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
// ReplaceCSSJSLinks.ts
// Removal regex patterns for minification, after merging
// <script src="path">...</script>
export const removeAllScriptsRegex = /<script(?![^>]*src=["'][^"']*https?:\/\/)[^>]*>[\s\S]*?<\/script>/gi;
// <link rel="stylesheet" href="path"> or <style>...</style>
export const removeStylesAndLinksRegex = /(<style[^>]*>[\s\S]*?<\/style>|<link\s+rel=["']stylesheet["'](?![^>]*href=["'][^"']*https?:\/\/)[^>]*>)/gi;
//# sourceMappingURL=regexes.js.map