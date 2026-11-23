import Plate from './Plate';
import { dayWord, formatDay } from '../lib/dates';
import { formatKES } from '../lib/money';

// Shared by the reserve dialog (before sending), the confirmation, and the find-booking page.
export default function BookingSummary({ details }) {
  return (
    <dl className="summary">
      <dt>Car</dt>
      <dd>
        {details.car_name}
        <span className="summary__plate">
          <Plate reg={details.plate} />
        </span>
      </dd>
      <dt>Pick-up</dt>
      <dd>{formatDay(details.start)}</dd>
      <dt>Return</dt>
      <dd>{formatDay(details.end)}</dd>
      <dt>Total</dt>
      <dd>
        {formatKES(details.total)} for {details.days} {dayWord(details.days)}
      </dd>
    </dl>
  );
}
