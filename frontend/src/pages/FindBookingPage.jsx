import { useState } from 'react';
import TextField from '../components/TextField';
import BookingSummary from '../components/BookingSummary';
import Plate from '../components/Plate';
import { findBooking } from '../api';
import { normalizePhone } from '../lib/validate';

export default function FindBookingPage() {
  const [form, setForm] = useState({ reference: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState({ status: 'idle', booking: null, sample: false, message: '' });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const found = {};
    const phone = normalizePhone(form.phone);
    if (!form.reference.trim()) found.reference = 'Enter your booking reference.';
    if (!phone) found.phone = 'Enter the phone number you booked with, like 0712 345 678.';
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setResult({ status: 'loading', booking: null, sample: false, message: '' });
    try {
      const { data, sample } = await findBooking(form.reference.trim().toUpperCase(), phone);
      setResult({ status: 'found', booking: data, sample, message: '' });
    } catch (error) {
      const message =
        error.status === 404
          ? 'No booking matches that reference and phone number. Check both and try again.'
          : 'Couldn’t reach the server. Check your connection and try again.';
      setResult({ status: 'error', booking: null, sample: false, message });
    }
  }

  return (
    <section className="page">
      <div className="wrap">
        <h1 className="page__title">Find my booking</h1>
        <p className="page__lead">Enter the reference from your confirmation and the phone number you booked with.</p>

        <form className="find-form" onSubmit={handleSubmit} noValidate>
          <TextField
            id="reference"
            name="reference"
            label="Booking reference"
            hint="It looks like WQ-4F7K."
            autoComplete="off"
            value={form.reference}
            onChange={updateField}
            error={errors.reference}
          />
          <TextField
            id="find-phone"
            name="phone"
            label="Phone number"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={updateField}
            error={errors.phone}
          />
          <div>
            <button type="submit" className="btn btn--primary" disabled={result.status === 'loading'}>
              {result.status === 'loading' ? 'Finding…' : 'Find booking'}
            </button>
          </div>
        </form>

        <div className="find-result" role="status">
          {result.status === 'error' && <p className="notice notice--error">{result.message}</p>}
          {result.status === 'found' && (
            <>
              <div className="reference">
                <p>Booking reference</p>
                <Plate reg={result.booking.reference} />
              </div>
              <BookingSummary details={result.booking} />
              {result.sample && <p className="notice">This is a sample booking made in this browser tab.</p>}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
