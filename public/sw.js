// A basic service worker for PWA functionality

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // You can pre-cache assets here if needed
  event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  // Clean up old caches here
  event.waitUntil(self.clients.claim()); // Become available to all pages
});

self.addEventListener('fetch', (event) => {
  // This basic service worker doesn't intercept fetch requests.
  // It's just here to make the app installable.
  // A more complex implementation could handle offline caching.
});
