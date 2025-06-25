// This is a basic service worker file.
// It's required for the app to be installable as a PWA.
// You can add more functionality here later, like caching strategies for offline support.

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // event.waitUntil(
  //   caches.open(CACHE_NAME).then((cache) => {
  //     console.log('Service Worker: Caching app shell');
  //     return cache.addAll(urlsToCache);
  //   })
  // );
});

self.addEventListener('fetch', (event) => {
  // console.log('Service Worker: Fetching', event.request.url);
  // event.respondWith(
  //   caches.match(event.request).then((response) => {
  //     return response || fetch(event.request);
  //   })
  // );
});
