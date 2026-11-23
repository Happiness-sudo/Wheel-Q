import Plate from './Plate';
import BookingSummary from './BookingSummary';

export default function BookingConfirmation({ booking, sample, onDone }) {
  return (
    <div className="dialog__body">
      <h2 className="dialog__title" id="dialog-title">
        Car reserved
      </h2>

      <div className="reference">
        <p>Your booking reference</p>
        <Plate reg={booking.reference} />
      </div>

      <BookingSummary details={booking} />

      <p className="dialog__note">
        Keep this reference. To find your booking later, you need it and the phone number you booked with.
      </p>

      {sample && (
        <p className="notice">This was a sample booking. The booking server is not connected, so nothing was saved.</p>
      )}

      <div className="dialog__actions">
        <button type="button" className="btn btn--primary" onClick={onDone}>
          Done
        </button>
      </div>
    </div>
  );
}
