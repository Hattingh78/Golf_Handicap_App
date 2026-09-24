// Golf Handicap Tracker - Service Worker
const CACHE_NAME = 'golf-hcp-v3';

// Install: activate immediately, no pre-caching
self.addEventListener('install', event => {
    self.skipWaiting();
});

// Activate: clean up any old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request).then(cached => {
            return cached || fetch(event.request).then(response => {
                return response;
            }).catch(() => caches.match('./index.html'));
        })
    );
});