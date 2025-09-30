# HTML Elements for Base64 Conversion

This document lists all HTML elements and their attributes that should be converted to base64 data URIs when using the `embedAssets` option.

## Image Elements

### `<img>` - Image Element
- **`src`** - Primary image source
- **`srcset`** - Responsive image sources (comma-separated list)
- **`data-src`** - Lazy loading image source (common in lazy loading libraries)
- **`data-srcset`** - Lazy loading responsive sources

```html
<!-- Basic image -->
<img src="./images/logo.png" alt="Company Logo">

<!-- Responsive image with srcset -->
<img src="./images/photo.jpg" 
     srcset="./images/photo-small.jpg 480w, 
             ./images/photo-medium.jpg 768w, 
             ./images/photo-large.jpg 1200w"
     alt="Responsive Photo">

<!-- Lazy loading image -->
<img data-src="./images/lazy-image.jpg" 
     data-srcset="./images/lazy-small.jpg 480w, ./images/lazy-large.jpg 1200w"
     alt="Lazy Loaded Image" class="lazy">
```

### `<picture>` with `<source>` - Responsive Images
- **`<source srcset>`** - Multiple image sources for different conditions
- **`<source src>`** - Fallback image source

```html
<!-- Art direction with different images for different screen sizes -->
<picture>
    <source media="(min-width: 1200px)" srcset="./images/hero-desktop.jpg">
    <source media="(min-width: 768px)" srcset="./images/hero-tablet.jpg">
    <source media="(min-width: 480px)" srcset="./images/hero-mobile.jpg">
    <img src="./images/hero-fallback.jpg" alt="Hero Image">
</picture>

<!-- Modern format support with fallbacks -->
<picture>
    <source srcset="./images/photo.avif" type="image/avif">
    <source srcset="./images/photo.webp" type="image/webp">
    <img src="./images/photo.jpg" alt="Modern Format Photo">
</picture>
```

## Audio/Video Elements

### `<video>` - Video Element
- **`src`** - Video source URL
- **`poster`** - Video thumbnail/poster image
- **`data-src`** - Lazy loading video source

```html
<!-- Basic video with poster -->
<video src="./videos/intro.mp4" poster="./images/video-thumbnail.jpg" controls>
    Your browser doesn't support video.
</video>

<!-- Video with multiple sources -->
<video poster="./images/poster.jpg" controls preload="metadata">
    <source src="./videos/movie.mp4" type="video/mp4">
    <source src="./videos/movie.webm" type="video/webm">
    <source src="./videos/movie.ogg" type="video/ogg">
</video>

<!-- Lazy loading video -->
<video data-src="./videos/lazy-video.mp4" 
       data-poster="./images/lazy-poster.jpg" 
       controls class="lazy-video">
</video>
```

### `<audio>` - Audio Element
- **`src`** - Audio source URL
- **`data-src`** - Lazy loading audio source

```html
<!-- Basic audio -->
<audio src="./audio/background-music.mp3" controls></audio>

<!-- Audio with multiple sources -->
<audio controls preload="none">
    <source src="./audio/podcast.mp3" type="audio/mpeg">
    <source src="./audio/podcast.ogg" type="audio/ogg">
    <source src="./audio/podcast.wav" type="audio/wav">
</audio>

<!-- Lazy loading audio -->
<audio data-src="./audio/lazy-audio.mp3" controls class="lazy-audio"></audio>
```

### `<source>` - Media Source (inside `<video>` or `<audio>`)
- **`src`** - Media file URL
- **`srcset`** - Multiple media sources

```html
<!-- Already shown in video/audio examples above -->
<!-- Source elements are always inside video/audio containers -->
<video controls>
    <source src="./videos/high-quality.mp4" type="video/mp4" media="(min-width: 1200px)">
    <source src="./videos/medium-quality.mp4" type="video/mp4" media="(min-width: 768px)">
    <source src="./videos/low-quality.mp4" type="video/mp4">
</video>
```

### `<track>` - Text Track (subtitles, captions)
- **`src`** - Track file URL (.vtt, .srt files)

```html
<video src="./videos/movie.mp4" controls>
    <track src="./subtitles/english.vtt" kind="subtitles" srclang="en" label="English" default>
    <track src="./subtitles/spanish.vtt" kind="subtitles" srclang="es" label="Spanish">
    <track src="./subtitles/captions.vtt" kind="captions" srclang="en" label="English Captions">
    <track src="./chapters/chapters.vtt" kind="chapters" srclang="en" label="Chapters">
</video>
```

## Font Elements

### `<link>` - Font Preloading
- **`href`** - Font file URL (when `rel="preload"` and `as="font"`)

```html
<!-- Preload local fonts for performance -->
<link rel="preload" href="./fonts/OpenSans-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="./fonts/OpenSans-Bold.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="./fonts/custom-icons.woff" as="font" type="font/woff" crossorigin>

<!-- CSS font-face declarations (processed separately in CSS) -->
<style>
@font-face {
    font-family: 'OpenSans';
    src: url('./fonts/OpenSans-Regular.woff2') format('woff2'),
         url('./fonts/OpenSans-Regular.woff') format('woff');
}
</style>
```

## Document Elements

### `<link>` - External Resources
- **`href`** - Resource URL for:
  - `rel="icon"` - Favicons (.ico, .png, .svg)
  - `rel="apple-touch-icon"` - Apple touch icons
  - `rel="mask-icon"` - Safari pinned tab icons
  - `rel="shortcut icon"` - Legacy favicons
  - `rel="preload"` - Preloaded resources (images, fonts, etc.)
  - `rel="prefetch"` - Prefetched resources

```html
<!-- Favicons and icons -->
<link rel="icon" href="./favicon.ico" type="image/x-icon">
<link rel="icon" href="./icons/favicon-32x32.png" sizes="32x32" type="image/png">
<link rel="icon" href="./icons/favicon-16x16.png" sizes="16x16" type="image/png">
<link rel="apple-touch-icon" href="./icons/apple-touch-icon.png" sizes="180x180">
<link rel="mask-icon" href="./icons/safari-pinned-tab.svg" color="#5bbad5">

<!-- Resource preloading -->
<link rel="preload" href="./images/hero-image.jpg" as="image">
<link rel="preload" href="./videos/intro.mp4" as="video">
<link rel="prefetch" href="./images/next-page-image.jpg">
```

### `<object>` - Embedded Objects
- **`data`** - Object data URL (PDFs, Flash, etc.)
- **`codebase`** - Base URL for relative URLs in object

```html
<!-- PDF document -->
<object data="./documents/manual.pdf" type="application/pdf" width="100%" height="600">
    <p>Your browser doesn't support PDFs. <a href="./documents/manual.pdf">Download the PDF</a></p>
</object>

<!-- Flash content (legacy) -->
<object data="./flash/animation.swf" type="application/x-shockwave-flash" width="400" height="300">
    <param name="movie" value="./flash/animation.swf">
    <param name="quality" value="high">
</object>

<!-- Image as object -->
<object data="./images/diagram.svg" type="image/svg+xml" width="300" height="200">
    <img src="./images/diagram-fallback.png" alt="Diagram">
</object>
```

### `<embed>` - Embedded Content
- **`src`** - Embedded content URL

```html
<!-- PDF embed -->
<embed src="./documents/report.pdf" type="application/pdf" width="100%" height="500">

<!-- SVG embed -->
<embed src="./graphics/logo.svg" type="image/svg+xml" width="200" height="100">

<!-- Audio embed -->
<embed src="./audio/notification.mp3" type="audio/mpeg" autostart="false" width="300" height="50">
```

## Form Elements

### `<input>` - Form Inputs
- **`src`** - Image source (when `type="image"`)

```html
<!-- Image input button -->
<form>
    <input type="image" src="./images/submit-button.png" alt="Submit Form" width="120" height="40">
    <input type="image" src="./images/reset-button.png" alt="Reset Form" width="120" height="40">
</form>

<!-- File input (src attribute not applicable) -->
<input type="file" accept="image/*">
```

## SVG Elements

### `<svg>` - Scalable Vector Graphics
- **`<image href>`** - Referenced images within SVG
- **`<image xlink:href>`** - Legacy referenced images within SVG
- **`<use href>`** - Referenced SVG symbols
- **`<use xlink:href>`** - Legacy referenced SVG symbols

```html
<!-- SVG with embedded images -->
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <!-- Modern href attribute -->
    <image href="./images/background.jpg" x="0" y="0" width="400" height="300"/>
    <image href="./images/overlay.png" x="50" y="50" width="100" height="100"/>
    
    <!-- Legacy xlink:href (still used in some browsers) -->
    <image xlink:href="./images/legacy-image.png" x="200" y="150" width="150" height="100"/>
</svg>

<!-- SVG symbols and reuse -->
<svg style="display: none;">
    <defs>
        <symbol id="icon-home" viewBox="0 0 24 24">
            <image href="./icons/home.png" width="24" height="24"/>
        </symbol>
    </defs>
</svg>

<!-- Using SVG symbols -->
<svg width="24" height="24">
    <use href="#icon-home"/>
</svg>

<!-- External SVG symbol reference -->
<svg width="32" height="32">
    <use href="./graphics/icons.svg#star-icon"/>
    <use xlink:href="./graphics/legacy-icons.svg#old-icon"/>
</svg>

<!-- SVG with pattern fills using images -->
<svg width="200" height="200">
    <defs>
        <pattern id="imgPattern" patternUnits="userSpaceOnUse" width="100" height="100">
            <image href="./textures/wood.jpg" x="0" y="0" width="100" height="100"/>
        </pattern>
    </defs>
    <rect width="200" height="200" fill="url(#imgPattern)"/>
</svg>
```