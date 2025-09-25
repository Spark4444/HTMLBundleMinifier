"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeStylesAndLinksRegex = exports.removeAllScriptsRegex = exports.inlineScriptRegex = exports.styleRegex = exports.scriptRegex = exports.linkRegex = void 0;
// Merging regex patterns for HTML minification
exports.linkRegex = /<link\s+rel=["']stylesheet["']\s+href=["']([^"']+)["'][^>]*>/g;
exports.scriptRegex = /<script\s+src=["']([^"']+)["'][^>]*><\/script>/g;
exports.styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
exports.inlineScriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
// Removal regex patterns for minification, after merging
exports.removeAllScriptsRegex = /<script(?![^>]*src=["'][^"']*https?:\/\/)[^>]*>[\s\S]*?<\/script>/gi;
exports.removeStylesAndLinksRegex = /(<style[^>]*>[\s\S]*?<\/style>|<link\s+rel=["']stylesheet["'](?![^>]*href=["'][^"']*https?:\/\/)[^>]*>)/gi;
//# sourceMappingURL=regex.js.map