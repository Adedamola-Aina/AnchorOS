import axios from 'axios';

/**
 * Axios instance with base URL derived from the current page path.
 * When accessed at /dashboard (via Tailscale proxy), API calls go to /dashboard/api/...
 * When accessed at / (direct localhost:3001), API calls go to /api/...
 */
const pathPrefix = window.location.pathname.startsWith('/dashboard') ? '/dashboard' : '';

const api = axios.create({ baseURL: pathPrefix });

export default api;
