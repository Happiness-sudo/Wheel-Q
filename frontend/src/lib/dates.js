// Dates are passed around as plain "YYYY-MM-DD" strings. Parsing them by hand keeps
// everything in the visitor's local time, so nothing shifts by a day because of UTC.

const pad = (n) => String(n).padStart(2, '0');

export function toISO(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromISO(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function todayISO() {
  return toISO(new Date());
}

export function addDays(iso, count) {
  const date = fromISO(iso);
  date.setDate(date.getDate() + count);
  return toISO(date);
}

// Rental days = return date minus pick-up date. 24 Nov to 27 Nov is 3 days.
export function daysBetween(startISO, endISO) {
  return Math.round((fromISO(endISO) - fromISO(startISO)) / 86400000);
}

// A booking ends on its return date, so another booking may start that same day.
// This is why the comparison is "<" and not "<=".
export function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

export function formatDay(iso) {
  return fromISO(iso).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function formatShort(iso) {
  return fromISO(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function formatRange(startISO, endISO) {
  return `${formatShort(startISO)} to ${formatShort(endISO)}`;
}

export function dayWord(count) {
  return count === 1 ? 'day' : 'days';
}
