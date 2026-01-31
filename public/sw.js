const CACHE_NAME = 'anchor-os-v1.5.7';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/favicon.svg',
    '/manifest.webmanifest'
];

// Import Firebase Messaging scripts (Compat version is required for SW)
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize Firebase in SW (using Production config as default)
firebase.initializeApp({
    apiKey: "AIzaSyBiJ9rSE11D29A-356F9KtzvnTV6Ajs_mQ",
    authDomain: "anchor-os.firebaseapp.com",
    projectId: "anchor-os",
    storageBucket: "anchor-os.firebasestorage.app",
    messagingSenderId: "501329205014",
    appId: "1:501329205014:web:1092c50e54faa5216ea237",
    measurementId: "G-LBNK80WWNS"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/favicon.svg',
        badge: '/favicon.svg'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Install: Cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
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

// Fetch: Stale-While-Revalidate strategy
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests and Firestore/Firebase Auth calls
    if (event.request.method !== 'GET' || event.request.url.includes('firestore.googleapis.com') || event.request.url.includes('identitytoolkit.googleapis.com')) {
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                }).catch(() => {
                    // Fail silently or handle offline fallback if needed
                });

                return cachedResponse || fetchPromise;
            });
        })
    );
});
