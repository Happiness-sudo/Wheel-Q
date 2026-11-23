// status 0 means the request never reached the server (backend off, no internet).
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}
