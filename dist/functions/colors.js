"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = log;
exports.error = error;
exports.warning = warning;
exports.success = success;
const colors = {
    error: "\x1b[31m",
    warning: "\x1b[33m",
    success: "\x1b[32m",
    default: "\x1b[0m",
};
const consoleLog = console.log;
const consoleError = console.error;
const consoleWarning = console.warn;
function log(...args) {
    consoleLog(colors.default, ...args, colors.default);
}
function error(...args) {
    consoleError(colors.error, ...args, colors.default);
}
function warning(...args) {
    consoleWarning(colors.warning, ...args, colors.default);
}
function success(...args) {
    consoleLog(colors.success, ...args, colors.default);
}
//# sourceMappingURL=colors.js.map