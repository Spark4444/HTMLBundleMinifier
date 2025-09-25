// Main JavaScript file with various asset references
console.log('Main JS loaded');

// Function to load remote script
function loadRemoteScript() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js';
    document.head.appendChild(script);
}

// Function to dynamically create image elements
function createDynamicImage() {
    const img = document.createElement('img');
    img.src = './img/pictureOfMyLessPaul.jpg';
    img.alt = 'Dynamically loaded local image';
    img.style.maxWidth = '100%';
    document.body.appendChild(img);
}

// Function to test various media loading
function testMediaLoading() {
    // Test audio loading
    const audio = new Audio('./audio/test.mp3');
    
    // Test video source
    const video = document.querySelector('#test-video');
    if (video) {
        video.src = './video/test.mp4';
    }
    
    // Test CSS background change
    document.body.style.backgroundImage = "url('./img/pictureOfMyLessPaul.jpg')";
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    loadRemoteScript();
    testMediaLoading();
});

// Export for testing
window.testFunctions = {
    loadRemoteScript,
    createDynamicImage,
    testMediaLoading
};
