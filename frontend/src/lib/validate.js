export function normalizePhone(input) {
  const cleaned = String(input).replace(/[\s()-]/g, '');
  const match = cleaned.match(/^(?:\+254|254|0)([17]\d{8})$/);
  return match ? `+254${match[1]}` : null;
}

export function validateBooking(form) {
  const errors = {};
  if (form.name.trim().length < 2) {
    errors.name = 'Enter your full name.';
  }
  if (!normalizePhone(form.phone)) {
    errors.phone = 'Enter a Kenyan mobile number, like 0712 345 678.';
  }
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
    errors.email = 'Enter an email address, like name@example.com.';
  }
  return errors;
}
