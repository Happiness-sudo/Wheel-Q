// A tiny pretend backend that mimics the real API's responses (see API-CONTRACT.md).
// Bookings made here live in memory only and disappear when the page reloads.
import { SAMPLE_CARS, sampleBlockedRanges } from './sampleData';
import { daysBetween, rangesOverlap } from './lib/dates';
import { normalizePhone } from './lib/validate';
import { ApiError } from './apiError';

const bookings = [];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function isFree(carId, start, end) {
  const taken = [
    ...(sampleBlockedRanges()[carId] || []),
    ...bookings.filter((b) => b.car_id === carId),
  ];
  return !taken.some((range) => rangesOverlap(start, end, range.start, range.end));
}

function makeReference() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i += 1) {
    code += letters[Math.floor(Math.random() * letters.length)];
  }
  return `WQ-${code}`;
}

function publicView({ phone, ...booking }) {
  return booking;
}

export async function listCars(start, end) {
  await wait(350);
  return SAMPLE_CARS.map((car) => ({ ...car, available: isFree(car.id, start, end) }));
}

export async function createBooking(payload) {
  await wait(500);
  const car = SAMPLE_CARS.find((c) => c.id === payload.car_id);
  if (!car) {
    throw new ApiError('That car does not exist.', 404);
  }
  if (!isFree(car.id, payload.start, payload.end)) {
    throw new ApiError('That car is no longer free for those dates.', 409);
  }
  const days = daysBetween(payload.start, payload.end);
  const booking = {
    reference: makeReference(),
    status: 'reserved',
    car_id: car.id,
    car_name: car.name,
    plate: car.plate,
    start: payload.start,
    end: payload.end,
    days,
    total: car.daily_rate * days,
    phone: payload.phone,
  };
  bookings.push(booking);
  return publicView(booking);
}

export async function findBooking(reference, phone) {
  await wait(350);
  const match = bookings.find(
    (b) => b.reference === reference.trim().toUpperCase() && b.phone === normalizePhone(phone),
  );
  if (!match) {
    throw new ApiError('No booking matches that reference and phone number.', 404);
  }
  return publicView(match);
}
