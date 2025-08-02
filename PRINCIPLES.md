1. **Bundling**: Bundling only includes CSS/JS/HTML files that are local, also @import in CSS counts.
2. **Minification**: Minification is applied as the last step.
3. **Embedding**: Embedding only counts for local files that are not CSS/JS/HTML files, such as images, fonts, etc in url() <img> etc.
4. **Remote Fetching**: Remote fetching is only applied to http/https links, and it is not applied to local files.
5. **Interfaces**: All shareable information like regex/interfaces should be stored in src/data/ folder.
6. **CLI**: CLI logic is completely separate from the main logic in index.ts.
7. **Log**: Use colors module for logging to show user what is happening e.g. error, warning, error, log etc.
8. **Functions**: Don't keep all functions in one file if they are big, split them into separate files in src/functions/ folder.
Also if embedding is disabled then remote fetching shouldn't work on files that are not CSS/JS/HTML files.

Since embedding works by converting files to base64, it is not applied to CSS/JS/HTML files, only to other assets like images, fonts, etc.