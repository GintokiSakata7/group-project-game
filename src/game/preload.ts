/**
 * Preload all character portraits and critical game assets
 * so they are immediately available from the browser cache without any visual delay.
 */

export const PRELOAD_IMAGE_URLS = [
  '/assets/characters/kunal.webp',
  '/assets/characters/aarav.webp',
  '/assets/characters/varun.webp',
  '/assets/characters/meera.webp',
  '/assets/characters/nikhil.webp',
  '/assets/characters/prakash.webp',
  '/assets/title-art.webp',
  '/assets/office-scene.webp',
];

export const imageLoadedCache = new Set<string>();

export function preloadAllGameAssets() {
  if (typeof window === 'undefined') return;

  PRELOAD_IMAGE_URLS.forEach((url) => {
    const img = new Image();
    img.decoding = 'async';

    img.onload = () => {
      imageLoadedCache.add(url);
    };

    img.onerror = () => {
      // Allow fallback handling
    };

    img.src = url;

    // In case the image was already cached by <link rel="preload">
    if (img.complete && img.naturalWidth > 0) {
      imageLoadedCache.add(url);
    }
  });
}

