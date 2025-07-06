// Main JavaScript functionality for the test page

document.addEventListener('DOMContentLoaded', function() {
    console.log('HTML Bundle Minifier Test Page loaded successfully!');
    
    // Initialize all functionality
    initializeTextProcessor();
    initializeColorChanger();
    initializeElementCounter();
    displayPageSize();
});

// Text processing functionality
function initializeTextProcessor() {
    const textInput = document.getElementById('text-input');
    const processBtn = document.getElementById('process-btn');
    const output = document.getElementById('output');
    
    if (processBtn && textInput && output) {
        processBtn.addEventListener('click', function() {
            const inputText = textInput.value.trim();
            
            if (inputText === '') {
                output.textContent = 'Please enter some text to process!';
                output.style.color = '#dc3545';
                return;
            }
            
            // Process the text (reverse, uppercase, add timestamp)
            const processedText = processText(inputText);
            output.innerHTML = processedText;
            output.style.color = '#155724';
            
            // Add some visual feedback
            output.style.transform = 'scale(1.02)';
            setTimeout(() => {
                output.style.transform = 'scale(1)';
            }, 200);
        });
        
        // Process text on Enter key
        textInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                processBtn.click();
            }
        });
    }
}

// Text processing function with multiple transformations
function processText(text) {
    const timestamp = new Date().toLocaleTimeString();
    
    // Multiple processing steps
    const reversed = text.split('').reverse().join('');
    const uppercase = text.toUpperCase();
    const wordCount = text.split(' ').length;
    const charCount = text.length;
    
    return `
        <strong>Original:</strong> ${text}<br>
        <strong>Reversed:</strong> ${reversed}<br>
        <strong>Uppercase:</strong> ${uppercase}<br>
        <strong>Word Count:</strong> ${wordCount}<br>
        <strong>Character Count:</strong> ${charCount}<br>
        <strong>Processed at:</strong> ${timestamp}
    `;
}

// Color changing functionality
function initializeColorChanger() {
    const colorBox = document.getElementById('color-box');
    const redBtn = document.getElementById('red-btn');
    const greenBtn = document.getElementById('green-btn');
    const blueBtn = document.getElementById('blue-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    if (colorBox) {
        if (redBtn) {
            redBtn.addEventListener('click', () => changeColor(colorBox, '#e74c3c', 'red'));
        }
        
        if (greenBtn) {
            greenBtn.addEventListener('click', () => changeColor(colorBox, '#27ae60', 'green'));
        }
        
        if (blueBtn) {
            blueBtn.addEventListener('click', () => changeColor(colorBox, '#3498db', 'blue'));
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => resetColor(colorBox));
        }
    }
}

function changeColor(element, color, colorName) {
    element.style.backgroundColor = color;
    element.style.color = 'white';
    element.style.borderColor = color;
    element.textContent = `Background is now ${colorName}!`;
    
    // Add a little animation
    element.style.transform = 'rotate(360deg) scale(1.1)';
    setTimeout(() => {
        element.style.transform = 'rotate(0deg) scale(1)';
    }, 500);
}

function resetColor(element) {
    element.style.backgroundColor = '#ecf0f1';
    element.style.color = '#2c3e50';
    element.style.borderColor = '#bdc3c7';
    element.textContent = 'This box will change colors';
    
    // Reset animation
    element.style.transform = 'scale(0.9)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 200);
}

// Element counter functionality
function initializeElementCounter() {
    const elementCountSpan = document.getElementById('element-count');
    
    if (elementCountSpan) {
        const totalElements = document.querySelectorAll('*').length;
        elementCountSpan.textContent = totalElements;
        
        // Animate the number
        animateNumber(elementCountSpan, 0, totalElements, 1000);
    }
}
