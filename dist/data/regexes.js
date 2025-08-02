"use strict";
// readLine.ts/findFiles
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlRegexWithoutQuotes = exports.urlRegexWithQuotes = exports.cssImportRegex = exports.removeStylesAndLinksRegex = exports.removeAllScriptsRegex = exports.inlineScriptRegex = exports.styleRegex = exports.scriptRegex = exports.linkRegex = void 0;
// Merging regex patterns for HTML minification
// <link rel="stylesheet" href="path"> 
exports.linkRegex = /<link\s+rel=["']stylesheet["']\s+href=["']([^"']+)["'][^>]*>/g;
// <script src="path">...</script>
exports.scriptRegex = /<script\s+src=["']([^"']+)["'][^>]*><\/script>/g;
// <style>...</style>
exports.styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
// <script>...</script>
exports.inlineScriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
// ReplaceCSSJSLinks.ts
// Removal regex patterns for minification, after merging
// <script src="path">...</script>
exports.removeAllScriptsRegex = /<script(?![^>]*src=["'][^"']*https?:\/\/)[^>]*>[\s\S]*?<\/script>/gi;
// <link rel="stylesheet" href="path"> or <style>...</style>
exports.removeStylesAndLinksRegex = /(<style[^>]*>[\s\S]*?<\/style>|<link\s+rel=["']stylesheet["'](?![^>]*href=["'][^"']*https?:\/\/)[^>]*>)/gi;
// replaceRelativeCSSPaths.ts
// @import "path"; or @import url("path");
exports.cssImportRegex = /@import\s+(?:url\s*\(\s*)?(['"]?)([^'")\s]+)\1\s*\)?\s*;/gi;
// Regular expressions to match url() declarations in CSS
// url("path")
exports.urlRegexWithQuotes = /url\((['"])(.*?)\1\)?/g;
// url(path)
exports.urlRegexWithoutQuotes = /url\(([^'"][^)]*)\)?/g;
// Why two regexes?
// 1. The first regex captures URLs with quotes (e.g., url("path/to/file.img"))
// 2. The second regex captures URLs without quotes (e.g., url(path/to/file.img))
// This ensures that both quoted and unquoted URLs are processed correctly since the quoted ones can cause issues if not handled properly.
// 3. For example url("path/to/file(brackets).img") 
// This would cause issues if we only used the second regex as it has special characters that need to be escaped like the brackets.
// 4. The quoted ones allow you to enter special characters without escaping them, so we need to handle both cases.
//# sourceMappingURL=regexes.js.map