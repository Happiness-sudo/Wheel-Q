import { API_URL } from './config';
import { ApiError } from './apiError';

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

// Public booking functions use the real Flask backend.
export function listCars() {
  return request('/api/cars');
}

export function createBooking(payload) {
  return request('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function findBooking(reference, phone) {
  const query = `phone=${encodeURIComponent(phone)}`;

  return request(
    `/api/bookings/${encodeURIComponent(reference)}?${query}`
  );
}

// Admin fleet management functions.
export function adminListCars() {
  return request('/api/cars');
}

function vehiclePayload(payload) {
  if (payload instanceof FormData) {
    return { body: payload };
  }

  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'image') {
      if (value instanceof File) {
        formData.append('image', value);
      }
      return;
    }

    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  return { body: formData };
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
