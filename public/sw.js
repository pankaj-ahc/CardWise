// A basic service worker for PWA installability
self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  // You can pre-cache assets here if needed
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activating...');
});

self.addEventListener('fetch', (event) => {
  // A simple pass-through fetch handler.
  // More advanced caching strategies can be implemented here.
  event.respondWith(fetch(event.request));
});
