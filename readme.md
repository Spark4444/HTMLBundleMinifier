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
- **Verbose Logging**: Detailed output during the minification process
- **Bundling Options**: Bundles CSS and JS files without minification and uses prettier to format the final HTML
- **File Auto-detection**: Automatically detects linked CSS and JS files in your HTML and inline styles/scripts
- **Config File Support**: Ability to specify a config file for default options
- **Automatic autocomplete for options**: Provides suggestions for invalid options and arguments
- **@import Support**: Supports CSS `@import` statements to include additional stylesheets

## Does this tool support import from js?
No, it would be too complex to implement, compared to @import in CSS, which is much simpler and more straightforward.

### Why?
1. JavaScript imports can be dynamic and complex, making it difficult to determine dependencies and order of execution.
2. I would need to find all the imports and their respective variables/functions etc and then move them into the js file, which would require a lot of parsing and analysis. There are also recursive imports, which would make it even more complex.

### What should I do instead?
You should use the `<script>` tag to include all your javascript files in order in your HTML file, and then use this tool to minify the HTML, CSS, and JS files together.

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
| `--config` | `-g` | Specify a config file |
| `--input` | `-i` | Specify input file |
| `--output` | `-o` | Specify output file |
| `--verbose` | `-V` | Enable verbose output |
| `--bundle` | `-b` | Bundle CSS and JS into the HTML |
| `--no-css` | `-c` | Skip CSS minification |
| `--no-js` | `-j` | Skip JavaScript minification |
| `--full-prompt` | `-f` | Enable full prompt mode (prompts for exiting and minifying option configuration) |
| `--no-mangle-js` | `-m` | Do not mangle JavaScript code |
| `--keep-comments` | `-C` | Keep comments in the minified HTML |
| `--keep-console` | `-l` | Keep console statements in the minified JavaScript |
| `--no-pretty-html` | `-p` | Skip HTML prettification |
| `--no-collapse-whitespace` | `-w` | Skip whitespace removal |

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

#### Config File structure reference

```json
{
    "verbose": boolean,
    "bundle": boolean,
    "minifyCSS": boolean,
    "minifyJS": boolean,
    "prompts": boolean,
    "mangle": boolean,
    "removeComments": boolean,
    "removeConsole": boolean,
    "prettify": boolean,
    "whitespaces": boolean,
    "welcomeMessage": boolean
}
```
<br>

- **verbose**: whether to enable verbose output, default is true
- **bundle**: whether to bundle CSS and JS files into the HTML, default is false
- **minifyCSS**: whether to minify CSS files, default is true
- **minifyJS**: whether to minify JS files, default is true
- **prompts**: whether to enable interactive prompts, default is true/false
- **mangle**: whether to mangle JS code, default is true
- **removeComments**: whether to remove comments from the HTML, default is true
- **removeConsole**: whether to remove console statements from the JS, default is true
- **prettify**: whether to prettify the HTML after bundling, default is true
- **whitespaces**: whether to remove unnecessary whitespaces from the HTML, default is true
- **welcomeMessage**: whether to show welcome message, default is true/false
<br>

All the fields are optional, if not specified the default values will be used.

### Programmatic Usage

```javascript
const main = require('html-bundle-minifier');

// Basic usage
await main('input.html', 'output.min.html');

// With options
await main('input.html', 'output.min.html', {
    minifyCSS: true,
    minifyJS: true
});

// All options need to be specified in an object after the input and output file paths the same way as in config file

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
4. **Process CSS url() Links**: Any CSS `url()` links are modified to be relative to the output HTML file if they aren't and http/s or data links
5. **(Optional) Minify CSS/JS**: if enabled, both CSS/JS which were compiled before will be minified together with HTML otherwise they will be inlined as is after HTML minification
6. **Minify HTML**: Removes unnecessary whitespace, comments, and optimizes the HTML as well as inlined CSS/JS
7. **Output**: Saves the final minified and bundled HTML file into the specified output file

## File Structure

```
html-bundle-minifier/
├── src/
│   ├── index.ts             # Main application logic
│   ├── bin/
│   │   ├── cli.ts           # CLI functionality
│   │   ├── data/
│   │   │   └── optionKeys.ts # CLI option keys definitions
│   │   └── functions/
│   │       └── cliFunctions.ts # CLI utility functions
│   ├── data/
│   │   ├── interfaces.ts    # TypeScript interfaces for options structures
│   │   └── regex.ts         # Regular expressions for file detection
│   └── functions/
│       ├── colors.ts        # Console colors utils 
│       ├── mergeFiles.ts    # File merging utils
│       ├── minifyHTML.ts    # HTML minification logic
│       ├── readLine.ts      # User input handling
│       └── replaceCSSJSLinks.ts # CSS/JS link replacement utilities
├── test/                    # Test files and examples
│   ├── config.json          # Test configuration file
│   ├── index.html           # Test HTML file
│   ├── index.min.html       # Minified test output
│   ├── missing.html         # Test file for missing resources
│   ├── missing.min.html     # Minified output for missing resources test
│   ├── warning.txt          # Test warnings file
│   ├── css/
│   │   ├── additional-styles.css # Additional CSS styles for testing
│   │   └── styles.css       # Main CSS styles for testing
│   ├── fonts/
│   │   └── BitcountPropSingle-VariableFont_CRSV,ELSH,ELXP,slnt,wght.ttf # Test font file
│   └── js/
│       ├── main.js          # Main JavaScript file for testing
│       └── utils.js         # Utility JavaScript functions for testing
├── dist/                    # Compiled TypeScript output (generated)
├── .gitignore               # Git ignore rules
├── license.txt              # Project license
├── package-lock.json        # NPM lock file
├── package.json             # NPM package configuration
├── README.md                # Project documentation
├── TODO.md                  # Project todo list
└── tsconfig.json            # TypeScript configuration
```

## Requirements

- Node.js 12.0 or higher
- npm or yarn

## Dependencies

- `html-minifier-terser`: For HTML minification
- `prettier`: For prettifying html after bundling
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

### Start
```bash
npm run start
```

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/Spark4444/HTMLBundleMinifier/issues) on GitHub.

## Current state of the project
finished