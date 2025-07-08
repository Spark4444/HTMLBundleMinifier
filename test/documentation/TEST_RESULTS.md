# HTML Bundle Minifier Test Results

## Test Overview
This document summarizes the comprehensive testing of the HTML Bundle Minifier with different argument combinations.

## Test Variants Generated

### 1. Full Minification (`test-full.min.html`)
- **Arguments**: `main(inputFile, outputFile, true, true, true, false, false, true)`
- **Description**: CSS and JS files are both minified and inlined
- **Parameters**:
  - minifyCSS: `true`
  - minifyJS: `true`
  - noPrompts: `true`
  - verbose: `false`
  - bundle: `false`

### 2. CSS Only Minification (`test-css-only.min.html`)
- **Arguments**: `main(inputFile, outputFile, true, false, true, false, false, true)`
- **Description**: CSS files are minified and inlined, JS files are bundled but not minified
- **Parameters**:
  - minifyCSS: `true`
  - minifyJS: `false`
  - noPrompts: `true`
  - verbose: `false`
  - bundle: `false`

### 3. JS Only Minification (`test-js-only.min.html`)
- **Arguments**: `main(inputFile, outputFile, false, true, true, false, false, true)`
- **Description**: JS files are minified and inlined, CSS files are bundled but not minified
- **Parameters**:
  - minifyCSS: `false`
  - minifyJS: `true`
  - noPrompts: `true`
  - verbose: `false`
  - bundle: `false`

### 4. Bundle Only (`test-bundle-only.min.html`)
- **Arguments**: `main(inputFile, outputFile, false, false, true, false, true, true)`
- **Description**: CSS and JS files are bundled and inlined but not minified
- **Parameters**:
  - minifyCSS: `false`
  - minifyJS: `false`
  - noPrompts: `true`
  - verbose: `false`
  - bundle: `true`

### 5. HTML Only (`test-html-only.min.html`)
- **Arguments**: `main(inputFile, outputFile, false, false, true, false, false, true)`
- **Description**: Only HTML is processed, CSS and JS files are not processed
- **Parameters**:
  - minifyCSS: `false`
  - minifyJS: `false`
  - noPrompts: `true`
  - verbose: `false`
  - bundle: `false`

## Function Parameters Explanation

```typescript
async function main(
    inputFile?: string,           // Path to input HTML file
    outputFile?: string,          // Path to output HTML file
    minifyCSS: boolean = true,    // Whether to minify CSS files
    minifyJS: boolean = true,     // Whether to minify JS files
    noPrompts: boolean = false,   // Skip interactive prompts
    verbose: boolean = true,      // Show detailed logging
    bundle: boolean = false,      // Bundle without minification
    welcomeMessage: boolean = true // Show welcome message
): Promise<void>
```

## Test Configuration Used
- **Input File**: `test/index.html`
- **Output Directory**: `test/output/`
- **Prompts**: Disabled (`noPrompts: true`)
- **Verbose Logging**: Disabled (`verbose: false`)
- **Welcome Message**: Enabled for first call only

## Generated Files
All test files have been successfully generated in the `test/output/` directory:
- ✅ `test-full.min.html`
- ✅ `test-css-only.min.html` 
- ✅ `test-js-only.min.html`
- ✅ `test-bundle-only.min.html`
- ✅ `test-html-only.min.html`

## Note
The test script intercepted `process.exit()` calls to prevent early termination and allow all test variants to complete successfully.
