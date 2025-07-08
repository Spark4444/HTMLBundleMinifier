# HTML Bundle Minifier

A powerful and simple HTML bundle minifier that combines and minifies HTML, CSS, and JavaScript files into a single optimized HTML file.

## Features

- **HTML Minification**: Removes unnecessary whitespace, comments, and optimizes HTML structure
- **CSS Bundling & Minification**: Automatically finds and merges external CSS files into inline styles
- **JavaScript Bundling & Minification**: Combines and minifies external JavaScript files into inline scripts
- **Flexible Options**: Choose to minify CSS, JavaScript, or both
- **Command Line Interface**: Easy-to-use CLI with various options
- **Interactive Mode**: Prompts for input when no arguments are provided
- **TypeScript Support**: Built with TypeScript for better type safety and development experience
- **File Auto-detection**: Automatically detects linked CSS and JS files in your HTML

## Installation

### Global Installation (Recommended)

```bash
npm install -g html-bundle-minifier
```

### Local Installation

```bash
npm install html-bundle-minifier
```

## Usage

### Command Line Interface

#### Basic Usage

```bash
# Interactive mode (prompts for input)
html-bundle-minifier

# Specify input and output files via command line arguments
html-bundle-minifier -i input.html -o output.min.html

# Using options
html-bundle-minifier -i input.html -o output.min.html --no-css --no-js
```

#### CLI Options

| Option | Short | Description |
|--------|-------|-------------|
| `--help` | `-h` | Show help message |
| `--version` | `-v` | Show version information |
| `--no-css` | `-c` | Skip CSS minification |
| `--no-js` | `-j` | Skip JavaScript minification |
| `--input` | `-i` | Specify input file |
| `--output` | `-o` | Specify output file |
| `--verbose` | `-v` | Enable verbose output |
| `--bundle` | `-b` | Bundle CSS and JS into the HTML 
| `--full-prompt` | `-f` | Enable full prompt mode (prompts for exiting and minifying option configuration) |

#### CLI Examples

```bash
# Minify HTML with CSS and JS (default)
html-bundle-minifier -i index.html -o bundle.min.html

# Minify HTML only (skip CSS and JS)
html-bundle-minifier -i index.html -o bundle.min.html --no-css --no-js

# Minify HTML and CSS only (skip JS)
html-bundle-minifier -i index.html -o bundle.min.html --no-js

# Minify HTML and JS only (skip CSS)
html-bundle-minifier index.html bundle.min.html --no-css

# Using short options
html-bundle-minifier -i index.html -o bundle.min.html -c -j

# Get help
html-bundle-minifier --help

# Check version
html-bundle-minifier --version

# Bundle HTML with CSS and JS (skip minification)
html-bundle-minifier -i index.html -o bundle.min.html --bundle

# Show verbose output
html-bundle-minifier -i index.html -o bundle.min.html --verbose
```

### Programmatic Usage

```javascript
const main = require('html-bundle-minifier');

// Basic usage
await main('input.html', 'output.min.html');

// With options
await main('input.html', 'output.min.html', true, true);
// Arguments:
// 1. Input file
// 2. Output file
// 3. Minify CSS (default: true)
// 4. Minify JS (default: true)
// 5. Verbose output (default: true)
// 6. Bundle CSS and JS into HTML (default: false)
```

## Examples

### Example 1: Basic HTML with CSS and JS

**Input HTML (`index.html`):**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>This is a sample paragraph.</p>
    <script src="main.js"></script>
</body>
</html>
```

**Command:**
```bash
html-bundle-minifier -i index.html -o bundle.min.html
```

**Output (`bundle.min.html`):**
```html
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>My Website</title><style>body{margin:0;padding:20px;font-family:Arial,sans-serif}h1{color:#333}</style></head><body><h1>Welcome to My Website</h1><p>This is a sample paragraph.</p><script>console.log("Hello World");document.addEventListener("DOMContentLoaded",function(){console.log("DOM loaded")});</script></body></html>
```

### Example 2: HTML-only Minification

**Command:**
```bash
html-bundle-minifier -i index.html -o bundle.min.html --no-css --no-js
```

This will minify only the HTML content without processing CSS or JavaScript files.

### Example 3: Interactive Mode

```bash
html-bundle-minifier
```

**Interactive prompts:**
```
Welcome to the HTML Bundle Minifier!
This tool will minify your HTML files along with their related CSS and JS files.
You can exit at any time by typing 'exit'.

Enter the path to the HTML file: index.html

Enter the path to save the minified HTML file (leave empty for default 'filename.min.html'): 
No output file specified. Using default: index.min.html

Do you want to minify CSS files? (yes/no, default is yes): yes
CSS will be minified.

Do you want to minify JS files? (yes/no, default is yes): yes
JavaScript will be minified.

Found CSS file: ...
...
Found JS file: ...
...

Minified HTML saved to index.min.html
Minification complete!

Do you want to exit? (yes/no, default is no): no
Exiting...
```

## How It Works

1. **Parse HTML**: Reads the input HTML file and analyzes its structure
2. **Detect External Files**: Automatically finds linked CSS files (`<link rel="stylesheet">`) and JavaScript files (`<script src="">`)
3. **Compile CSS/JS**: Reads extrnal CSS/JS files, compiles them into single style/script tags and inlines them
4. **(Optional) Minify CSS/JS**: if enabled, both CSS/JS which were compiled before will be minified together with HTML otherwise they will be inlined as is after HTML minification
4. **Minify HTML**: Removes unnecessary whitespace, comments, and optimizes the HTML as well as inlined CSS/JS
5. **Output**: Saves the final minified and bundled HTML file into the specified output file

## File Structure

```
html-bundle-minifier/
├── src/
│   ├── index.ts             # Main application logic
│   ├── regex.ts             # Regular expressions for file detection
│   ├── bin/
│   │   └── cli.ts           # CLI
│   └── functions/
│       ├── colors.ts        # Console colors utils 
│       ├── mergeFiles.ts    # File merging utils
│       ├── minifyHTML.ts    # HTML minification logic
│       └── readLine.ts      # User input handling
├── test/                    # Test files and examples
├── package-lock.json        
├── package.json             
├── README.md
└── tsconfig.json            
```

## Requirements

- Node.js 12.0 or higher
- npm or yarn

## Dependencies

- `html-minifier-terser`: For HTML minification
- `typescript`: For TypeScript support
- `@types/node`: TypeScript definitions for Node.js

## Development

### Build

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/Spark4444/HTMLBundleMinifier/issues) on GitHub.

## Current state of the project
finished