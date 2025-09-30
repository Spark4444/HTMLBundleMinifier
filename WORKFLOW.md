## HTML Bundle Minifier Workflow

The HTML Bundle Minifier follows a systematic workflow to process HTML files and their associated CSS and JavaScript dependencies. This document outlines the complete processing pipeline from input to output.

### Overview

The tool operates in two main modes:
- **Minification Mode** (default): Combines and minifies HTML, CSS, and JavaScript into a single optimized file
- **Bundle Mode**: Combines files without minification and applies prettier formatting

### 1. Input Processing & Validation

**File Path Resolution:**
- Converts relative input/output paths to absolute paths using `convert-path-to-absolute`
- Validates that input file exists and has `.html` extension
- Sets default output filename if not specified (adds `.min.html` suffix)

**Configuration Loading:**
- Parses command-line arguments and options
- Loads configuration from JSON file if specified (`-g` or `--config` option)
- Merges CLI options with config file options (CLI takes precedence)

**Interactive Mode:**
- If no CLI arguments provided, enters interactive mode with prompts
- Asks user for input/output files and minification preferences
- Provides autocomplete suggestions for invalid options

### 2. HTML Parsing & DOM Creation

**DOM Initialization:**
- Creates JSDOM instance with virtual console to suppress parsing errors
- Parses the input HTML content into a manipulable DOM structure
- Maintains document structure for accurate element manipulation

### 3. Asset Discovery & Collection

**CSS File Detection:**
```typescript
// Finds CSS from multiple sources:
- External <link rel="stylesheet"> tags
- Inline <style> tags
- @import statements in CSS files
- Remote CSS files (if fetchRemote option enabled)
```

**JavaScript File Detection:**
```typescript
// Finds JavaScript from multiple sources:
- External <script src="..."> tags  
- Inline <script> tags
- Preserves external CDN scripts (unless fetchRemote enabled)
```

**Asset Processing Rules:**
- Local files: Always processed and included
- Remote files: Only processed if `fetchRemote` option is enabled
- Inline content: Always processed
- File paths resolved relative to HTML file location

### 4. CSS Processing Pipeline

**File Merging:**
- Reads all detected CSS files and inline styles
- Processes in order of appearance in HTML
- Handles relative path resolution for background images, fonts, etc.

**Path Resolution:**
- Converts relative paths in CSS to be relative to HTML file location
- Processes `url()` statements in CSS properties
- Handles `@import` statements recursively
- Supports data URIs and absolute URLs

**Asset Embedding (Optional):**
- If `embedAssets` option enabled, converts referenced assets to base64 data URIs
- Reduces external dependencies but increases file size

### 5. JavaScript Processing Pipeline

**File Merging:**
- Concatenates all JavaScript files and inline scripts
- Maintains execution order as defined in HTML
- Preserves scope and function declarations

**Limitation Note:**
- Does not process ES6 `import`/`export` statements
- Requires traditional `<script>` tag inclusion for dependencies

### 6. Output Generation

**Minification Mode (Default):**
```typescript
// Uses html-minifier-terser with options:
- Collapses whitespace
- Removes HTML comments  
- Minifies inline CSS
- Minifies inline JavaScript with Terser
- Mangles variable names (optional)
- Removes console statements (optional)
```

**Bundle Mode (`--bundle` flag):**
```typescript
// Uses prettier for formatting:
- Combines files without minification
- Applies consistent code formatting
- Maintains readability for development
```

### 7. DOM Manipulation & Injection

**CSS Injection:**
- Removes original `<link>` and `<style>` tags
- Creates single `<style>` tag in `<head>`
- Preserves external CDN links (unless `fetchRemote` enabled)

**JavaScript Injection:**
- Removes original `<script>` tags with `src` attributes
- Removes inline `<script>` tags
- Creates single `<script>` tag before closing `</body>`
- Preserves external CDN scripts (unless `fetchRemote` enabled)

### 8. File Output & Completion

**File Writing:**
- Writes processed HTML to specified output file
- Ensures UTF-8 encoding
- Creates output directory if it doesn't exist

**Completion Handling:**
- Reports success/failure status
- Provides verbose logging if enabled
- Offers interactive mode for repeated processing

### Error Handling

**File Access Errors:**
- Validates file existence before processing
- Provides clear error messages for missing files
- Gracefully handles permission issues

**Parsing Errors:**
- Suppresses JSDOM parsing warnings for malformed HTML
- Continues processing despite minor syntax errors
- Reports critical errors that prevent processing

**Path Resolution Errors:**
- Handles missing CSS/JS dependencies gracefully
- Reports broken links in verbose mode
- Continues processing with available files

### Performance Considerations

**Memory Usage:**
- Processes files sequentially to manage memory
- Uses streaming for large files where possible
- Cleans up DOM instances after processing

**File Size Optimization:**
- Removes unnecessary whitespace and comments
- Minifies CSS and JavaScript code
- Optionally embeds assets to reduce HTTP requests

### Use Cases

**Production Deployment:**
```bash
html-bundle-minifier -i index.html -o dist/index.min.html --fetch-remote --embed-assets
```

**Development with Bundling:**
```bash
html-bundle-minifier -i index.html -o bundled.html --bundle
```

**Configuration File Usage:**
```bash
html-bundle-minifier -i index.html -g config.json
```

This workflow ensures efficient processing of HTML files and their dependencies while maintaining flexibility for different use cases and environments. 