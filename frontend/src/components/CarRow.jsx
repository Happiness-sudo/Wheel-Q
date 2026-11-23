import Plate from './Plate';
import { dayWord } from '../lib/dates';
import { formatKES, rentalTotal } from '../lib/money';

export default function CarRow({ car, days, onReserve }) {
  const total = rentalTotal(car.daily_rate, days);

  return (
    <li className={car.available ? 'car' : 'car car--booked'}>
      <div className="car__plate">
        <Plate reg={car.plate} />
      </div>

      <div className="car__info">
        <h3 className="car__name">{car.name}</h3>
        <ul className="specs">
          <li>{car.seats} seats</li>
          <li>{car.transmission}</li>
          <li>{car.fuel}</li>
        </ul>
      </div>

      <div className="car__price">
        <span className="car__rate">
          {formatKES(car.daily_rate)}
          <span>a day</span>
        </span>
        <span className="car__total">
          {formatKES(total)} for {days} {dayWord(days)}
        </span>
      </div>

      <div className="car__action">
        {car.available ? (
          <button type="button" className="btn btn--primary" onClick={() => onReserve(car)} aria-label={`Reserve ${car.name}`}>
            Reserve
          </button>
        ) : (
          <span className="car__booked-note">Booked for these dates</span>
        )}
      </div>
    </li>
  );
}
