const CACHE_NAME = 'transit-optimizer-v2';
const APP_ASSETS = [
    './',
    './index.html',
    './manifest.json'
];

// Installation cycle - Cache core framework blueprints
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(APP_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activation cycle - Purge deprecated legacy data models
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Evaluation Interceptor - Keep app operational entirely offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request).catch(() => {
                // Return index if network fails for single-page application safety
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});