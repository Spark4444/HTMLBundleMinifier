const colors = {
    error: "\x1b[31m",
    warning: "\x1b[33m",
    success: "\x1b[32m",
    default: "\x1b[0m",
}

const consoleLog = console.log;
const consoleError = console.error;
const consoleWarning = console.warn;

export function log(...args: any[]): void {
    consoleLog(colors.default, ...args, colors.default);
}

export function error(...args: any[]): void {
    consoleError(colors.error, ...args, colors.default);
}

export function warning(...args: any[]): void {
    consoleWarning(colors.warning, ...args, colors.default);
}

export function success(...args: any[]): void {
    consoleLog(colors.success, ...args, colors.default);
}