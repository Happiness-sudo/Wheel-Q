
const env = import.meta.env;

export const API_URL = (env.VITE_API_URL || 'http://127.0.0.1:5000').replace(/\/$/, '');
export const CONTACT_PHONE = env.VITE_CONTACT_PHONE || '';
export const WHATSAPP_NUMBER = env.VITE_WHATSAPP_NUMBER || '';

export const ALLOW_SAMPLE_FALLBACK = env.DEV === true;
