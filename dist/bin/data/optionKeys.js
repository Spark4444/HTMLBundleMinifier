"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainOptions = exports.CLIOptions = void 0;
// [full version, short version] pairs of command line options
exports.CLIOptions = [
    ["--bundle", "-b"],
    ["--config", "-g"],
    ["--full-prompt", "-f"],
    ["--help", "-h"],
    ["--input", "-i"],
    ["--keep-comments", "-C"],
    ["--keep-console", "-l"],
    ["--no-collapse-whitespace", "-w"],
    ["--no-css", "-c"],
    ["--no-js", "-j"],
    ["--no-mangle-js", "-m"],
    ["--no-pretty-html", "-p"],
    ["--no-verbose", "-V"],
    ["--output", "-o"],
    ["--version", "-v"]
];
exports.mainOptions = [
    "bundle",
    "mangle",
    "minifyCSS",
    "minifyJS",
    "prettify",
    "prompts",
    "removeComments",
    "removeConsole",
    "verbose",
    "welcomeMessage",
    "whitespaces"
];
//# sourceMappingURL=optionKeys.js.map