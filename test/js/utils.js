// Utility functions for testing
const utils = {
    // Test function with asset references
    loadAsset: function(path) {
        console.log(`Loading asset: ${path}`);
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = path;
        });
    },
    
    // Function that references multiple asset types
    preloadAssets: async function() {
        const assets = [
            './img/pictureOfMyLessPaul.jpg',
            'https://via.placeholder.com/300x200/4CAF50/ffffff?text=Remote+Image',
            './fonts/BitcountPropSingle-VariableFont_CRSV,ELSH,ELXP,slnt,wght.ttf'
        ];
        
        for (const asset of assets) {
            try {
                await this.loadAsset(asset);
                console.log(`Loaded: ${asset}`);
            } catch (error) {
                console.error(`Failed to load: ${asset}`, error);
            }
        }
    }
};

// Make utils available globally
window.utils = utils;
