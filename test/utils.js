// Utility functions for the test page

// Animate numbers function
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const difference = end - start;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        
        const current = Math.floor(start + (difference * easeOutCubic));
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Calculate and display page size information
function displayPageSize() {
    // Get the HTML content size
    const htmlContent = document.documentElement.outerHTML;
    const originalSize = new Blob([htmlContent]).size;
    
    const originalSizeElement = document.getElementById('original-size');
    if (originalSizeElement) {
        originalSizeElement.textContent = formatBytes(originalSize);
    }
    
    // Simulate minified size calculation (this would be actual after minification)
    estimateMinifiedSize(originalSize);
}

// Format bytes to human readable format
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Estimate minified size (for demonstration purposes)
function estimateMinifiedSize(originalSize) {
    // Simulate compression ratio (typically 20-40% reduction)
    const compressionRatio = 0.65; // 35% reduction
    const estimatedMinifiedSize = Math.floor(originalSize * compressionRatio);
    
    setTimeout(() => {
        const minifiedSizeElement = document.getElementById('minified-size');
        const compressionRatioElement = document.getElementById('compression-ratio');
        
        if (minifiedSizeElement) {
            minifiedSizeElement.textContent = formatBytes(estimatedMinifiedSize) + ' (estimated)';
        }
        
        if (compressionRatioElement) {
            const savings = ((originalSize - estimatedMinifiedSize) / originalSize * 100).toFixed(1);
            compressionRatioElement.textContent = `${savings}% reduction (estimated)`;
        }
    }, 2000);
}

// Add smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Add highlight effect
                targetElement.style.background = 'rgba(52, 152, 219, 0.1)';
                setTimeout(() => {
                    targetElement.style.background = '';
                }, 2000);
            }
        });
    });
});

// Performance monitoring
function logPerformanceMetrics() {
    if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
        
        const domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
        console.log(`DOM Content Loaded: ${domContentLoaded}ms`);
    }
}

// Call performance logging after page load
window.addEventListener('load', function() {
    setTimeout(logPerformanceMetrics, 100);
});

// Add some interactive features
function addInteractivity() {
    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.borderLeftWidth = '8px';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderLeftWidth = '4px';
        });
    });
    
    // Add click effect to buttons
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Initialize interactivity when DOM is ready
document.addEventListener('DOMContentLoaded', addInteractivity);

// Export functions for potential use in other scripts
window.TestPageUtils = {
    animateNumber,
    formatBytes,
    displayPageSize,
    logPerformanceMetrics
};
