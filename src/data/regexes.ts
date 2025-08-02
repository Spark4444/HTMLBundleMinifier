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


// replaceRelativeCSSPaths.ts

// @import "path"; or @import url("path");
export const cssImportRegex = /@import\s+(?:url\s*\(\s*)?(['"]?)([^'")\s]+)\1\s*\)?\s*;/gi;

// Regular expressions to match url() declarations in CSS
// url("path")
export const urlRegexWithQuotes = /url\((['"])(.*?)\1\)?/g;
// url(path)
export const urlRegexWithoutQuotes = /url\(([^'"][^)]*)\)?/g;
// Why two regexes?
// 1. The first regex captures URLs with quotes (e.g., url("path/to/file.img"))
// 2. The second regex captures URLs without quotes (e.g., url(path/to/file.img))
// This ensures that both quoted and unquoted URLs are processed correctly since the quoted ones can cause issues if not handled properly.
// 3. For example url("path/to/file(brackets).img") 
// This would cause issues if we only used the second regex as it has special characters that need to be escaped like the brackets.
// 4. The quoted ones allow you to enter special characters without escaping them, so we need to handle both cases.