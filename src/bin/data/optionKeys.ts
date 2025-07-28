export const optionList: string[] = [
    "--help", 
    "--version",
    "--config",
    "--no-css",
    "--no-js",
    "--input",
    "--output",
    "--no-verbose",
    "--bundle",
    "--full-prompt",
    "--no-mangle-js",
    "--keep-comments",
    "--keep-console",
    "--no-pretty-html",
    "--no-collapse-whitespace",
    // Small versions of the options
    "-h", // --help
    "-v", // --version
    "-g", // --config
    "-c", // --no-css
    "-j", // --no-js
    "-i", // --input
    "-o", // --output
    "-V", // --no-verbose
    "-b", // --bundle
    "-f", // --full-prompt
    "-m", // --no-mangle-js
    "-C", // --keep-comments
    "-l", // --keep-console
    "-p", // --no-pretty-html
    "-w"  // --no-collapse-whitespace
];

export const optionsKeys = [
    "minifyCSS",
    "minifyJS",
    "prompts",
    "verbose",
    "bundle",
    "mangle",
    "removeComments",
    "removeConsole",
    "prettify",
    "whitespaces"
];