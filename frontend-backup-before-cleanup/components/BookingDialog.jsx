import { useEffect, useRef, useState } from 'react';
import TextField from './TextField';
import BookingSummary from './BookingSummary';
import BookingConfirmation from './BookingConfirmation';
import { createBooking } from '../api';
import { rentalTotal } from '../lib/money';
import { normalizePhone, validateBooking } from '../lib/validate';

export default function BookingDialog({ car, start, end,  days, onClose, onBooked }) {
  const dialogRef = useRef(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  function closeDialog() {
    dialogRef.current?.close();
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) closeDialog();
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const found = validateBooking(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    setServerError('');
    try {
      const { data, sample } = await createBooking({
        car_id: car.id,
        start,
        end,
        name: form.name.trim(),
        phone: normalizePhone(form.phone),
        email: form.email.trim(),
        notes: form.notes.trim(),
      });
      setResult({ booking: data, sample });
      onBooked?.();
    } catch (error) {
      if (error.status === 409) {
        setServerError('Someone just reserved this car for those dates. Close this window and choose another car.');
      } else if (!error.status) {
        setServerError('Couldn’t reach the server. Check your connection and try again.');
      } else {
        setServerError(error.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const preview = {
    car_name: car.name,
    plate: car.plate,
    start,
    end,
    days,
    total: rentalTotal(car.daily_rate, days),
  };

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby="dialog-title"
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      {result ? (
        <BookingConfirmation booking={result.booking} sample={result.sample} onDone={closeDialog} />
      ) : (
        <form className="dialog__body" onSubmit={handleSubmit} noValidate>
          <h2 className="dialog__title" id="dialog-title">
            Reserve {car.name}
          </h2>

          <BookingSummary details={preview} />

          <TextField
            id="name"
            name="name"
            label="Full name"
            autoComplete="name"
            value={form.name}
            onChange={updateField}
            error={errors.name}
            autoFocus
          />
          <TextField
            id="phone"
            name="phone"
            label="Phone number"
            hint="A Kenyan mobile number, like 0712 345 678."
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={updateField}
            error={errors.phone}
          />
          <TextField
            id="email"
            name="email"
            label="Email address"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={updateField}
            error={errors.email}
          />
          <TextField
            id="notes"
            name="notes"
            label="Notes (optional)"
            hint="Pick-up time, or anything we should know."
            multiline
            rows={3}
            value={form.notes}
            onChange={updateField}
          />

          {serverError && (
            <p className="notice notice--error" role="alert">
              {serverError}
            </p>
          )}

          <div className="dialog__actions">
            <button type="button" className="btn btn--quiet" onClick={closeDialog}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? 'Reserving…' : 'Reserve car'}
            </button>
          </div>
        </form>
      )}
    </dialog>
  );
}
