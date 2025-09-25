## Workflow

1. Prompt for options
2. Find all linked files (local and remote)
3. Fix the relative links in linked css to match html location
4. inline css/js files
5. Optional: Convert all (local/remote) files to base64 data URIs
6. Use html-minifier-terser to minify the final HTML file