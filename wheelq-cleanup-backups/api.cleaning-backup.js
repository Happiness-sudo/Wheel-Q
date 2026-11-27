import { API_URL } from './config';
import { ApiError } from './apiError';

let csrfToken = '';

async function request(path, options = {}) {
  let response;

  const isFormData = options.body instanceof FormData;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
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

  }

  if (!response.ok) {
    throw new ApiError(
      body?.error || 'Something went wrong.',
      response.status
    );
  }

  return body;
}

export async function adminGetCsrf() {
  const result = await request('/api/admin/csrf');
  csrfToken = result.csrf_token;
  return result;
}

export async function adminLogin(email, password) {
  if (!csrfToken) await adminGetCsrf();

  const result = await request('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  csrfToken = result.csrf_token;
  return result;
}

export function adminCheckSession() {
  return request('/api/admin/me');
}

export function adminLogout() {
  return request('/api/admin/logout', {
    method: 'POST',
  }).finally(() => {
    csrfToken = '';
  });
}

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
export function adminListBookings() {
  return request('/api/admin/bookings');
}

export function adminUpdateBooking(id, status) {
  return request(`/api/admin/bookings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
