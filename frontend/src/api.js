
import { API_URL, ALLOW_SAMPLE_FALLBACK } from './config';
import { ApiError } from './apiError';
import * as sample from './sampleApi';

async function request(path, options = {}) {
  let response;

  const isFormData = options.body instanceof FormData;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError('Could not reach the server.', 0);
  }

  let body = null;

  try {
    body = await response.json();
  } catch {
    // Some error responses have no JSON body.
  }

  if (!response.ok) {
    throw new ApiError(body?.error || 'Something went wrong.', response.status);
  }

  return body;
}

// Public booking functions retain their existing sample fallback.
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
  const params = new URLSearchParams({ start, end });

  return withSampleFallback(
    () => request(`/api/cars?${params}`),
    () => sample.listCars(start, end),
  );
}

export function createBooking(payload) {
  return withSampleFallback(
    () => request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    () => sample.createBooking(payload),
  );
}

export function findBooking(reference, phone) {
  const query = `phone=${encodeURIComponent(phone)}`;

  return withSampleFallback(
    () => request(
      `/api/bookings/${encodeURIComponent(reference)}?${query}`
    ),
    () => sample.findBooking(reference, phone),
  );
}

// Admin fleet management: these always use the real backend.
export function adminListCars() {
  return request('/api/cars');
}

function vehiclePayload(payload) {
  if (payload instanceof FormData) {
    return { body: payload };
  }

  if (payload.image instanceof File) {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'image') {
        formData.append('image', value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    return { body: formData };
  }

  return {
    body: JSON.stringify(payload),
  };
}

export function adminCreateCar(payload) {
  const { body } = vehiclePayload(payload);

  return request('/api/cars', {
    method: 'POST',
    body,
  });
}

export function adminUpdateCar(id, payload) {
  const { body } = vehiclePayload(payload);

  return request(`/api/cars/${id}`, {
    method: 'PUT',
    body,
  });
}

export function adminDeleteCar(id) {
  return request(`/api/cars/${id}`, {
    method: 'DELETE',
  });
}
