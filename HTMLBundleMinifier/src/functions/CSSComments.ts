import { cssCommentRegex } from "../data/regexes.js";
import { CSSComments } from "../data/interfaces.js";

// Function to remove and store CSS comments with placeholders
export function removeCSSComments(cssContent: string, comments?: string[], commentPlaceholders?: string[]): CSSComments {
    // Store comments before processing
    comments = comments || [];
    commentPlaceholders = commentPlaceholders || [];

    // Remove comments and store them with unique placeholders
    cssContent = cssContent.replace(cssCommentRegex, (match) => {
        const placeholder = `__CSS_COMMENT_PLACEHOLDER_${comments.length}__`;
        comments.push(match);
        commentPlaceholders.push(placeholder);
        return placeholder;
    });

    return {
        cssContent,
        comments,
        commentPlaceholders
    };
}

// Function to restore CSS comments from placeholders
export function restoreCSSComments(cssContent: string, comments: string[], commentPlaceholders: string[]): string {
    // Restore comments
    commentPlaceholders.forEach((placeholder, index) => {
        cssContent = cssContent.replace(placeholder, comments[index]);
    });

    return cssContent;
}