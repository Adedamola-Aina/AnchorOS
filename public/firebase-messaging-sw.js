importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// --- DYNAMIC CONFIGURATION ---
const hostname = self.location.hostname;

const configs = {
    // Production
    default: {
        apiKey: "AIzaSyBiJ9rSE11D29A-356F9KtzvnTV6Ajs_mQ",
        authDomain: "anchor-os.firebaseapp.com",
        projectId: "anchor-os",
        storageBucket: "anchor-os.firebasestorage.app",
        messagingSenderId: "501329205014",
        appId: "1:501329205014:web:1092c50e54faa5216ea237",
        measurementId: "G-LBNK80WWNS"
    },
    // Staging
    staging: {
        apiKey: "AIzaSyDoQevJKyequof4p1XdIXCPz3hE3QaKSUc",
        authDomain: "anchor-os-staging.firebaseapp.com",
        projectId: "anchor-os-staging",
        storageBucket: "anchor-os-staging.firebasestorage.app",
        messagingSenderId: "251281982839",
        appId: "1:251281982839:web:bae102a18f2d209432cd72"
    },
    // Development
    dev: {
        apiKey: "AIzaSyAcRCcHADYhsh1YLo_qZs4sXLgLEEJd5PA",
        authDomain: "anchor-os-dev-1c6ec.firebaseapp.com",
        projectId: "anchor-os-dev-1c6ec",
        storageBucket: "anchor-os-dev-1c6ec.firebasestorage.app",
        messagingSenderId: "151437822604",
        appId: "1:151437822604:web:fdd06a38842d7992d109a9"
    }
};

let activeConfig = configs.default;

if (hostname.includes('staging')) {
    activeConfig = configs.staging;
    console.log('[SW] Using STAGING config');
} else if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    activeConfig = configs.dev;
    console.log('[SW] Using DEV config');
} else {
    console.log('[SW] Using PROD config');
}

firebase.initializeApp(activeConfig);

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
