# HTML Bundle Minifier CLI Test Documentation

## Overview
This document provides comprehensive testing coverage for both the programmatic API (`test.js`) and CLI interface (`cli-test.js`) of the HTML Bundle Minifier.

## Test Files Structure

### 1. API Tests (`test.js`)
Tests the main function directly with different parameter combinations.

### 2. CLI Tests (`cli-test.js`) 
Tests the command-line interface with various argument combinations and interactive scenarios.

## Generated Test Files

### API Test Files (prefix: `test-`)
- `test-full.min.html` - Full minification (CSS + JS)
- `test-css-only.min.html` - CSS minified, JS bundled
- `test-js-only.min.html` - JS minified, CSS bundled  
- `test-bundle-only.min.html` - Both bundled, no minification
- `test-html-only.min.html` - HTML only, no CSS/JS processing

### CLI Test Files (prefix: `cli-`)
- `cli-full.min.html` - Default CLI behavior (CSS + JS minified)
- `cli-no-css.min.html` - `--no-css` flag
- `cli-no-js.min.html` - `--no-js` flag
- `cli-no-css-no-js.min.html` - Both `--no-css` and `--no-js`
- `cli-bundle.min.html` - `--bundle` flag
- `cli-no-verbose.min.html` - `--no-verbose` flag
- `cli-short-flags.min.html` - Short flags `-c -j -V`
- `cli-bundle-quiet.min.html` - `--bundle --no-verbose`
- `cli-full-prompt.min.html` - `--full-prompt` mode

## CLI Test Coverage

### ✅ Automated Tests Completed

#### Help & Version Commands
- `--help` / `-h` - Display help message
- `--version` / `-v` - Show version number

#### File Generation Tests  
- Basic minification with input/output specified
- `--no-css` / `-c` - Disable CSS minification
- `--no-js` / `-j` - Disable JS minification
- `--bundle` / `-b` - Bundle without minification
- `--no-verbose` / `-V` - Disable verbose logging
- Combined flags testing
- Short vs long flag variations

#### Error Handling Tests
- Invalid option detection
- Missing input file value
- Missing output file value
- Proper exit codes and error messages

### 📝 Interactive Tests Available

#### Manual Verification Required
These tests require user interaction and can be run individually:

1. **No Arguments Test**
   ```bash
   node dist/bin/cli.js
   ```
   - Prompts for input file
   - Prompts for output file  
   - Prompts for minification options

2. **Partial Arguments Test**
   ```bash
   node dist/bin/cli.js -i test/index.html
   ```
   - Uses provided input
   - Prompts for output file

3. **Full Prompt Mode Test**
   ```bash
   node dist/bin/cli.js -i test/index.html -o output.html --full-prompt
   ```
   - Uses provided input/output
   - Prompts for minification preferences

## CLI Arguments Reference

### Input/Output Options
- `--input <file>` / `-i <file>` - Specify input HTML file
- `--output <file>` / `-o <file>` - Specify output HTML file

### Minification Options
- `--no-css` / `-c` - Skip CSS minification  
- `--no-js` / `-j` - Skip JS minification
- `--bundle` / `-b` - Bundle files without minification

### Behavior Options  
- `--no-verbose` / `-V` - Disable detailed logging
- `--full-prompt` / `-f` - Enable interactive minification prompts
- `--help` / `-h` - Show help message
- `--version` / `-v` - Show version number

## Test Execution Commands

### Run All Tests
```bash
npm test                    # Runs both test.js and cli-test.js
```

### Run Individual Tests
```bash
node test/test.js          # API function tests
node test/cli-test.js      # CLI interface tests
```

### Manual CLI Testing Examples
```bash
# Basic usage
node dist/bin/cli.js -i test/index.html -o output.html

# Advanced options
node dist/bin/cli.js -i test/index.html -o output.html --no-css --bundle

# Interactive mode
node dist/bin/cli.js --full-prompt
```

## File Comparison Guide

### Compare API vs CLI Output
You can compare corresponding files to verify consistency:
- `test-full.min.html` ↔ `cli-full.min.html`
- `test-css-only.min.html` ↔ `cli-no-js.min.html`  
- `test-js-only.min.html` ↔ `cli-no-css.min.html`
- `test-bundle-only.min.html` ↔ `cli-bundle.min.html`

### Verification Checklist
- [ ] File sizes are reasonable
- [ ] CSS is properly minified/bundled
- [ ] JS is properly minified/bundled  
- [ ] HTML structure is preserved
- [ ] No errors in generated files
- [ ] CLI flags produce expected results

## Test Results Summary

### ✅ All Automated Tests Passed
- Help and version commands work correctly
- File generation produces expected outputs
- Error handling displays appropriate messages
- Both long and short flags function properly
- Exit codes are correct (0 for success, 1 for errors)

### 📋 Manual Testing Notes
The interactive tests ran successfully and demonstrated:
- Proper prompting for missing arguments
- Default value handling
- User input validation
- Graceful exit handling

## Troubleshooting

### Common Issues
1. **Build Required**: Run `npm run build` before testing
2. **File Permissions**: Ensure write access to `test/output/` directory
3. **Interactive Tests**: Use Ctrl+C to skip manual tests if needed

### Expected Behavior
- All CLI tests should complete without errors
- Generated files should be valid HTML
- Error messages should be descriptive and helpful
- Interactive prompts should accept valid inputs
