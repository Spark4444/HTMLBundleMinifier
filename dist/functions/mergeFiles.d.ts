interface FileItem {
    type: "inline" | "path";
    content: string;
}
declare function mergeFiles(fileList: FileItem[]): string;
export default mergeFiles;
//# sourceMappingURL=mergeFiles.d.ts.map