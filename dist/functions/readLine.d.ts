import readline from "readline";
import { FileItem } from "../data/interfaces";
declare const rs: readline.Interface;
declare function askQuestion(query: string): Promise<string>;
declare function promptForMinificationOption(varaible: boolean, fileType: string, verbose: boolean): Promise<boolean>;
declare function findFiles(content: string, type: string, inputFile: string, verbose: boolean): Promise<FileItem[]>;
export { rs, askQuestion, promptForMinificationOption, findFiles };
//# sourceMappingURL=readLine.d.ts.map