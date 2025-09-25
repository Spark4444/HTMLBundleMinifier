import readline from "readline";
import { FileItem } from "../data/interfaces.js";
import { JSDOM } from "jsdom";
export declare const rs: readline.Interface;
export declare function askQuestion(query: string): Promise<string>;
export declare function promptForMinificationOption(variable: boolean, fileType: string, verbose: boolean): Promise<boolean>;
export declare function findFiles(content: string, type: string, inputFile: string, dom: JSDOM, verbose: boolean): Promise<FileItem[]>;
//# sourceMappingURL=readLine.d.ts.map