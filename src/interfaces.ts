export interface Options {
    minifyCSS?: boolean;
    minifyJS?: boolean;
    prompts?: boolean;
    verbose?: boolean;
    bundle?: boolean;
    welcomeMessage?: boolean;
    mangle?: boolean;
    removeComments?: boolean;
    removeConsole?: boolean;
    prettify?: boolean;
    whitespaces?: boolean;
}

export interface MinifierOptions {
    minifyCSS?: boolean;
    minifyJS?: boolean;
    verbose?: boolean;
    mangle?: boolean;
    removeComments?: boolean;
    removeConsole?: boolean;
    whitespaces?: boolean;
}

export interface BundlerOptions {
    prettify?: boolean;
    verbose?: boolean;
}

export interface FileItem {
    type: "inline" | "path";
    content: string;
}