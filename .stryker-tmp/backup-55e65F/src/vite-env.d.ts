/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_ENV: 'development' | 'staging' | 'production';
    readonly VITE_FIREBASE_PROJECT_ID: string;
    readonly VITE_FIREBASE_API_KEY_DEV: string;
    readonly VITE_FIREBASE_API_KEY_STAGING: string;
    readonly VITE_FIREBASE_VAPID_KEY: string;
    readonly VITE_FORMSPREE_ID?: string;
    readonly VITE_SENTRY_DSN?: string;
    readonly VITE_FLAG_DISABLE_ALL?: string;
    readonly VITE_FLAG_FABRIC_SUGGESTIONS?: string;
    readonly VITE_FLAG_FABRIC_SUGGESTIONS_ROLLOUT?: string;
    [key: string]: string | undefined;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
