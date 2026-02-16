// @ts-nocheck
import axios from 'axios';

/**
 * Set global axios base URL derived from the current page path.
 * When accessed at /dashboard (via Tailscale proxy), API calls go to /dashboard/api/...
 * When accessed at / (direct localhost:3001), API calls go to /api/...
 * This is set globally so ALL components benefit, even those using raw axios.
 */
const pathPrefix = window.location.pathname.startsWith('/dashboard') ? '/dashboard' : '';
axios.defaults.baseURL = pathPrefix;

const api = axios.create({ baseURL: pathPrefix });

export default api;
