import CarRow from './CarRow';
import { dayWord, formatRange } from '../lib/dates';

const ALL = 'All cars';

function SkeletonRows() {
  return (
    <ul className="fleet__list" aria-hidden="true">
      {[1, 2, 3].map((n) => (
        <li className="car car--skeleton" key={n}>
          <div className="car__plate">
            <span className="skeleton skeleton--plate" />
          </div>
          <div className="car__info">
            <span className="skeleton skeleton--name" />
            <span className="skeleton skeleton--specs" />
          </div>
          <div className="car__price">
            <span className="skeleton skeleton--price" />
          </div>
          <div className="car__action" />
        </li>
      ))}
    </ul>
  );
}

function statusText(fleet, freeCount, days) {
  if (fleet.status === 'loading') return 'Checking which cars are free…';
  if (fleet.status === 'error') return '';
  if (freeCount === 0) return 'No cars are free for these dates.';
  const verb = freeCount === 1 ? 'car is' : 'cars are';
  return `${freeCount} ${verb} free for ${days} ${dayWord(days)}.`;
}

export default function FleetList({ fleet, start, end, days, category, onCategory, onReserve, onRetry }) {
  const categories = [ALL, ...new Set(fleet.cars.map((car) => car.category))];
  const active = categories.includes(category) ? category : ALL;

  const visible = fleet.cars
    .filter((car) => active === ALL || car.category === active)
    .sort((a, b) => Number(b.available) - Number(a.available) || a.daily_rate - b.daily_rate);

  const freeCount = visible.filter((car) => car.available).length;

  return (
    <section className="fleet" id="fleet" aria-labelledby="fleet-title">
      <div className="wrap">
        <div className="fleet__head">
          <div>
            <h2 className="fleet__title" id="fleet-title">
              Cars for {formatRange(start, end)}
            </h2>
            <p className="fleet__status" role="status">
              {statusText(fleet, freeCount, days)}
            </p>
          </div>

          {fleet.cars.length > 0 && (
            <div className="filters" role="group" aria-label="Car type">
              {categories.map((name) => (
                <button
                  type="button"
                  key={name}
                  className="filter"
                  aria-pressed={name === active}
                  onClick={() => onCategory(name)}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {fleet.sample && fleet.status === 'ready' && (
          <p className="notice">
            Showing sample cars. The booking server is not connected, so nothing you do here is saved.
          </p>
        )}

        {fleet.status === 'loading' && fleet.cars.length === 0 && <SkeletonRows />}

        {fleet.status === 'error' && (
          <div className="notice notice--error" role="alert">
            <p>Couldn’t load the cars. Check your connection and try again.</p>
            <button type="button" className="btn btn--quiet" onClick={onRetry}>
              Try again
            </button>
          </div>
        )}

        {fleet.status === 'ready' && visible.length === 0 && (
          <p className="empty">No cars of this type. Choose another type above.</p>
        )}

        {visible.length > 0 && (
          <ul className="fleet__list">
            {visible.map((car) => (
              <CarRow key={car.id} car={car} days={days} onReserve={onReserve} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
