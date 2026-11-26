// All environment settings are read here, so the rest of the app never touches import.meta.
const env = import.meta.env;

export const API_URL = (env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
export const CONTACT_PHONE = env.VITE_CONTACT_PHONE || '';
export const WHATSAPP_NUMBER = env.VITE_WHATSAPP_NUMBER || '';

// While you run `npm run dev` and the backend is not running yet, the app falls back to
// sample cars so you can still see and click through the design. This is switched off
// in a production build, so a real customer can never get a fake confirmation.
export const ALLOW_SAMPLE_FALLBACK = env.DEV === true;
