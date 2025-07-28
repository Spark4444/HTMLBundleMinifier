import { MinifierOptions, BundlerOptions } from "../interfaces";
export declare function minifyHTML(htmlContent: string, outputFile: string, cssContent: string, jsContent: string, options: MinifierOptions): Promise<void>;
export declare function bundleHTML(inputFile: string, outputFile: string, cssContent: string, jsContent: string, options: BundlerOptions): Promise<void>;
//# sourceMappingURL=minifyHTML.d.ts.map