// Merging regex patterns for HTML minification
export const linkRegex = /<link\s+rel=["']stylesheet["']\s+href=["']([^"']+)["'][^>]*>/g;
export const scriptRegex = /<script\s+src=["']([^"']+)["'][^>]*><\/script>/g;
export const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
export const inlineScriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;

// Removal regex patterns for minification, after merging
export const removeAllScriptsRegex = /<script(?![^>]*src=["'][^"']*https?:\/\/)[^>]*>[\s\S]*?<\/script>/gi;
export const removeStylesAndLinksRegex = /(<style[^>]*>[\s\S]*?<\/style>|<link\s+rel=["']stylesheet["'](?![^>]*href=["'][^"']*https?:\/\/)[^>]*>)/gi;