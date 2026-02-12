const CACHE_NAME = 'anchor-os-v1.7.0';
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
// This ensures correct keys are used for Dev, Staging, and Prop
const firebaseConfig = {
    // Development (localhost, anchor.tail2fa2e.ts.net)
    development: {
        apiKey: "AIzaSyDoQevJKyequof4p1XdIXCPz3hE3QaKSUc",
        authDomain: "anchor-os-development.firebaseapp.com",
        projectId: "anchor-os-development",
        storageBucket: "anchor-os-development.firebasestorage.app",
        messagingSenderId: "251281982839",
        appId: "1:251281982839:web:5317769996520d0432cd72",
        measurementId: "G-MEASUREMENT_ID"
    },
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

// Determine environment based on hostname
const hostname = self.location.hostname;
let env = 'production'; // Default to production for safety

if (hostname === 'localhost' || hostname.endsWith('.tail2fa2e.ts.net') || hostname === 'tail2fa2e.ts.net') {
    env = 'development';
} else if (hostname === 'anchor-os-staging.web.app' || hostname === 'anchor-os-staging.firebaseapp.com') {
    env = 'staging';
}

console.log(`[sw.js] Initializing Firebase for environment: ${env}`);
firebase.initializeApp(firebaseConfig[env]);

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
    // Skip non-GET requests, non-http requests (extensions), and Firestore/Firebase Auth calls
    if (
        event.request.method !== 'GET' ||
        !event.request.url.startsWith('http') ||
        event.request.url.includes('firestore.googleapis.com') ||
        event.request.url.includes('identitytoolkit.googleapis.com')
    ) {
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
