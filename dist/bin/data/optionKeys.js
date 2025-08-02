"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainOptions = exports.CLIOptions = void 0;
// [full version, short version] pairs of command line options
exports.CLIOptions = [
    ["--help", "-h"],
    ["--version", "-v"],
    ["--config", "-g"],
    ["--input", "-i"],
    ["--output", "-o"],
    ["--no-verbose", "-V"],
    ["--bundle", "-b"],
    ["--no-css", "-c"],
    ["--no-js", "-j"],
    ["--full-prompt", "-f"],
    ["--no-mangle-js", "-m"],
    ["--keep-comments", "-C"],
    ["--keep-console", "-l"],
    ["--no-pretty-html", "-p"],
    ["--no-collapse-whitespace", "-w"],
    ["--fetch-remote", "-F"],
    ["--embed-assets", "-E"]
];
exports.mainOptions = [
    "verbose",
    "bundle",
    "minifyCSS",
    "minifyJS",
    "prompts",
    "mangle",
    "removeComments",
    "removeConsole",
    "prettify",
    "whitespaces",
    "welcomeMessage",
    "fetchRemote",
    "embedAssets"
];
//# sourceMappingURL=optionKeys.js.map