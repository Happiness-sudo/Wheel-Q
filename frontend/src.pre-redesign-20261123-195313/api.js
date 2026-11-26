import { API_URL, ALLOW_SAMPLE_FALLBACK } from './config';
import { ApiError } from './apiError';
import * as sample from './sampleApi';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new ApiError('Could not reach the server.', 0);
  }

  let body = null;
  try {
    body = await response.json();
  } catch {
  }

  if (!response.ok) {
    throw new ApiError(body?.error || 'Something went wrong.', response.status);
  }
  return body;
}

async function withSampleFallback(callServer, callSample) {
  try {
    return { data: await callServer(), sample: false };
  } catch (error) {
    const serverIsDown = error instanceof ApiError && error.status === 0;
    if (ALLOW_SAMPLE_FALLBACK && serverIsDown) {
      return { data: await callSample(), sample: true };
    }
    throw error;
  }
}

export function listCars(start, end) {
  return withSampleFallback(
    () => request(`/api/cars?start=${start}&end=${end}`),
    () => sample.listCars(start, end),
  );
}

export function createBooking(payload) {
  return withSampleFallback(
    () => request('/api/bookings', { method: 'POST', body: JSON.stringify(payload) }),
    () => sample.createBooking(payload),
  );
}

export function findBooking(reference, phone) {
  const query = `phone=${encodeURIComponent(phone)}`;
  return withSampleFallback(
    () => request(`/api/bookings/${encodeURIComponent(reference)}?${query}`),
    () => sample.findBooking(reference, phone),
  );
}
