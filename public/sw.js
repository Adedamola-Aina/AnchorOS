// NOTE: This file is a plain service worker served from /public — it is not
// part of any TypeScript compilation, so no suppression directive is needed.
const CACHE_NAME = 'anchor-os-v1.21.0-rc.24';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/favicon.svg',
    '/manifest.webmanifest'
];

// Import Firebase Messaging scripts (Compat version is required for SW)
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize Firebase in SW (Dynamic Config)
// Staging and Production only. Local development runs against the Firebase
// Emulator Suite, where FCM background messaging is not available.
const firebaseConfig = {
    // Staging (anchor-os-staging.web.app)
    staging: {
        apiKey: "AIzaSyDoQevJKyequof4p1XdIXCPz3hE3QaKSUc",
        authDomain: "anchor-os-staging.firebaseapp.com",
        projectId: "anchor-os-staging",
        storageBucket: "anchor-os-staging.firebasestorage.app",
        messagingSenderId: "251281982839",
        appId: "1:251281982839:web:bae102a18f2d209432cd72",
        measurementId: "G-MEASUREMENT_ID"
    },
    // Production (anchor-os.web.app, anchor-os.firebaseapp.com)
    production: {
        apiKey: "AIzaSyBiJ9rSE11D29A-356F9KtzvnTV6Ajs_mQ",
        authDomain: "anchor-os.firebaseapp.com",
        projectId: "anchor-os",
        storageBucket: "anchor-os.firebasestorage.app",
        messagingSenderId: "501329205014",
        appId: "1:501329205014:web:1092c50e54faa5216ea237",
        measurementId: "G-LBNK80WWNS"
    }
};

// Determine environment based on hostname. Default to production for safety.
const hostname = self.location.hostname;
const isLocalDev = hostname === 'localhost' || hostname === '127.0.0.1';

if (isLocalDev) {
    console.log('[sw.js] Local development (Firebase Emulator Suite) — background messaging disabled.');
} else {
    let env = 'production';
    if (hostname === 'anchor-os-staging.web.app' || hostname === 'anchor-os-staging.firebaseapp.com') {
        env = 'staging';
    }

    // RA-08 (#153): environment name is not logged in production.
    firebase.initializeApp(firebaseConfig[env]);

    const messaging = firebase.messaging();

    // Handle background messages
    // RA-08 (#153): do not log message payloads in production.
    messaging.onBackgroundMessage((payload) => {

        // Customize notification here
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
            body: payload.notification.body,
            icon: '/favicon.svg',
            badge: '/favicon.svg'
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
    });
}

// RA-08 (#153): only same-origin, successful, non-opaque responses are
// cacheable. Writing an opaque/cross-origin response into the cache can throw
// inside cache.put and break the fetch handler, and it stores third-party
// content this app does not control.
function isCacheableResponse(request, response) {
    try {
        const url = new URL(request.url);
        return response.ok
            && url.origin === self.location.origin
            && (response.type === 'basic' || response.type === 'default');
    } catch {
        return false;
    }
}

// Install: Cache core assets. RA-08 (#153): tolerate a missing individual asset
// so one renamed file cannot block activation/updates for every client.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
            Promise.allSettled(
                ASSETS_TO_CACHE.map((asset) =>
                    cache.add(asset).catch((error) => {
                        console.warn('[sw.js] Failed to precache', asset, error);
                    })
                )
            )
        )
    );
    self.skipWaiting();
});

// Activate: Cleanup old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Background Sync: Process offline transaction queue when connectivity returns
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-transactions') {
        event.waitUntil(
            self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                    client.postMessage({ type: 'PROCESS_OFFLINE_QUEUE' });
                });
            })
        );
    }
    if (event.tag === 'sync-task-toggles') {
        event.waitUntil(
            self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                    client.postMessage({ type: 'PROCESS_TASK_OFFLINE_QUEUE' });
                });
            })
        );
    }
});

// Fetch: Network-first for HTML/JS, Stale-While-Revalidate for static assets
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    // Skip non-GET requests, non-http requests (extensions), and Firestore/Firebase Auth calls
    if (
        event.request.method !== 'GET' ||
        (url.protocol !== 'http:' && url.protocol !== 'https:') ||
        url.hostname === 'firestore.googleapis.com' ||
        url.hostname === 'identitytoolkit.googleapis.com'
    ) {
        return;
    }

    // Network-first for navigation (HTML) and JS bundles — prevents serving stale app shell
    const isNavigation = event.request.mode === 'navigate';
    const isJsAsset = url.pathname.endsWith('.js') && url.origin === self.location.origin;

    if (isNavigation || isJsAsset) {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    // RA-08 (#153): only cache a successful same-origin response, and
                    // never let a cache failure reject the fetch handler.
                    if (isCacheableResponse(event.request, networkResponse)) {
                        const clone = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => cache.put(event.request, clone))
                            .catch((error) => console.warn('[sw.js] cache.put failed', error));
                    }
                    return networkResponse;
                })
                .catch(async () => {
                    const cached = await caches.match(event.request);
                    if (cached) return cached;
                    if (isNavigation) {
                        const shell = await caches.match('/index.html');
                        if (shell) return shell;
                    }
                    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
                })
        );
        return;
    }

    // Stale-while-revalidate for other static assets (images, CSS, fonts)
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    // RA-08 (#153): guard cross-origin/opaque writes; a cache failure
                    // must never reject this handler.
                    if (isCacheableResponse(event.request, networkResponse)) {
                        try {
                            cache.put(event.request, networkResponse.clone());
                        } catch (error) {
                            console.warn('[sw.js] cache.put failed', error);
                        }
                    }
                    return networkResponse;
                }).catch(() => {
                    return cachedResponse || new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
                });

                return cachedResponse || fetchPromise;
            });
        })
    );
});
