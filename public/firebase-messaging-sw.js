importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// --- DYNAMIC CONFIGURATION ---
// Firebase config is injected at build time into __firebase-config.js
// by the Vite generateFirebaseSwConfig plugin.
// At dev time the file is generated on server start.
importScripts('__firebase-config.js');

// self.__FIREBASE_CONFIG is set by __firebase-config.js
const activeConfig = self.__FIREBASE_CONFIG;

if (!activeConfig || !activeConfig.apiKey) {
    console.error('[SW] Missing Firebase config — push notifications disabled');
} else {
    firebase.initializeApp(activeConfig);

    const messaging = firebase.messaging();

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    if (payload.notification) {
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
            body: payload.notification.body,
            icon: '/favicon.svg',
            badge: '/favicon.svg',
            // Mobile Specifics
            vibrate: [200, 100, 200],
            actions: payload.data?.actions ? JSON.parse(payload.data.actions) : []
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
    }
});
}
