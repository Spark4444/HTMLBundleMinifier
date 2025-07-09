import readline from "readline";
declare const rs: readline.Interface;
declare function askQuestion(query: string): Promise<string>;
declare function promptForMinificationOption(varaible: boolean, fileType: string, verbose: boolean): Promise<boolean>;
declare function findFiles(regex: RegExp, content: string, type: string, inputFile: string, verbose: boolean, noPrompts: boolean): Promise<string[]>;
export { rs, askQuestion, promptForMinificationOption, findFiles };
//# sourceMappingURL=readLine.d.ts.map