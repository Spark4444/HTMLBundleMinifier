declare let readline: any;
declare function askQuestion(query: string): Promise<string>;
declare function promptForMinificationOption(varaible: boolean, fileType: string): Promise<boolean>;
declare function findFiles(regex: RegExp, content: string, type: string, inputFile: string): Promise<string[]>;
export { readline, askQuestion, promptForMinificationOption, findFiles };
//# sourceMappingURL=readLine.d.ts.map