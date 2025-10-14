// Basic Service Worker for PWA installation
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
});

self.addEventListener('fetch', (event) => {
  // This is a placeholder. We'll add caching later.
  event.respondWith(fetch(event.request));
});
