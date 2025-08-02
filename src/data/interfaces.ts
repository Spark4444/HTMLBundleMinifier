export interface Options {
    verbose?: boolean;
    bundle?: boolean;
    minifyCSS?: boolean;
    minifyJS?: boolean;
    prompts?: boolean;
    mangle?: boolean;
    removeComments?: boolean;
    removeConsole?: boolean;
    prettify?: boolean;
    whitespaces?: boolean;
    welcomeMessage?: boolean;
    fetchRemote?: boolean;
    embedAssets?: boolean;
}

export interface MinifierOptions {
    verbose?: boolean;
    minifyCSS?: boolean;
    minifyJS?: boolean;
    mangle?: boolean;
    removeComments?: boolean;
    removeConsole?: boolean;
    whitespaces?: boolean;
}

export interface BundlerOptions {
    verbose?: boolean;
    prettify?: boolean;
}

export interface FileItem {
    type: "inline" | "path";
    content: string;
}