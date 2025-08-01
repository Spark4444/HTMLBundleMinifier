// Extracted utility functions for @import testing via dynamic import

// Page size calculation functionality
function displayPageSize() {
    const html = document.documentElement.outerHTML;
    const sizeInBytes = new Blob([html]).size;
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    
    const originalSizeElement = document.getElementById('original-size');
    if (originalSizeElement) {
        originalSizeElement.textContent = `${sizeInKB} KB`;
        originalSizeElement.style.color = '#28a745';
    }
    
    console.log(`Page size calculated: ${sizeInKB} KB`);
    return sizeInKB;
}

// Advanced text processing functions
function advancedTextProcessor(text) {
    const operations = {
        wordCount: text.split(/\s+/).filter(word => word.length > 0).length,
        charCount: text.length,
        vowelCount: (text.match(/[aeiouAEIOU]/g) || []).length,
        consonantCount: (text.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length,
        upperCaseCount: (text.match(/[A-Z]/g) || []).length,
        lowerCaseCount: (text.match(/[a-z]/g) || []).length,
        digitCount: (text.match(/[0-9]/g) || []).length,
        specialCharCount: (text.match(/[^a-zA-Z0-9\s]/g) || []).length
    };
    
    return operations;
}

// Export functions for potential module usage
window.testUtilities = {
    displayPageSize,
    advancedTextProcessor
};

console.log('Imported utilities loaded successfully!');
