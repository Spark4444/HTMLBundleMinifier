import fetchFile from "web-file-fetcher";
const link = "https://pdfobject.com/pdf/sample.pdf";
let result;
try {
result = await fetchFile(link);
} catch (error) {
console.error("Error fetching file:", error);
}

console.log(result);