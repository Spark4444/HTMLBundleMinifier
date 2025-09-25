const colors = {
    error: "\x1b[31m",
    warning: "\x1b[33m",
    success: "\x1b[32m",
    default: "\x1b[0m",
};
const consoleLog = console.log;
const consoleError = console.error;
const consoleWarning = console.warn;
export function log(...args) {
    consoleLog(colors.default, ...args, colors.default);
}
export function error(...args) {
    consoleError(colors.error, ...args, colors.default);
}
export function warning(...args) {
    consoleWarning(colors.warning, ...args, colors.default);
}
export function success(...args) {
    consoleLog(colors.success, ...args, colors.default);
}
//# sourceMappingURL=colors.js.map