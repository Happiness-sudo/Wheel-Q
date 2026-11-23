import { ArrowUpRight, Users, Fuel, Settings2, CheckCircle2 } from 'lucide-react';
import { formatKES, rentalTotal } from '../lib/money';
import { dayWord } from '../lib/dates';

const fallbackImages = [
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1100&q=85',
  'https://images.unsplash.com/photo-1503376780353-7e669276c9a8?auto=format&fit=crop&w=1100&q=85',
  'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1100&q=85',
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1100&q=85',
];

export default function CarRow({ car, days, onReserve }) {
  const total = rentalTotal(car.daily_rate, days);
  const image = car.image_url || car.photo_url || car.image || fallbackImages[(Number(car.id) || 0) % fallbackImages.length];

  return (
    <article className={`vehicle-card ${car.available ? '' : 'vehicle-card--unavailable'}`}>
      <div className="vehicle-image-wrap">
        <img
          className="vehicle-image"
          src={image}
          alt={car.name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = fallbackImages[0];
          }}
        />

        <div className="vehicle-image-overlay" />

        <span className="vehicle-category">{car.category || 'PREMIUM COLLECTION'}</span>

        {car.available ? (
          <span className="availability-tag"><CheckCircle2 size={13}/> AVAILABLE</span>
        ) : (
          <span className="availability-tag unavailable-tag">UNAVAILABLE</span>
        )}

        <span className="vehicle-registration">{car.plate}</span>
      </div>

      <div className="vehicle-info">
        <div className="vehicle-title-row">
          <div>
            <span className="vehicle-overline">THE WHEEL-Q COLLECTION</span>
            <h3 className="vehicle-name">{car.name}</h3>
          </div>
          <ArrowUpRight className="vehicle-arrow" size={23}/>
        </div>

        <div className="vehicle-specs">
          <span><Users size={15}/> {car.seats} Seats</span>
          <span><Settings2 size={15}/> {car.transmission}</span>
          <span><Fuel size={15}/> {car.fuel}</span>
        </div>

        <div className="vehicle-bottom">
          <div className="vehicle-pricing">
            <span className="vehicle-price">{formatKES(car.daily_rate)}</span>
            <span className="vehicle-price-period">/ DAY</span>
            <p>{formatKES(total)} for {days} {dayWord(days)}</p>
          </div>

          <button
            className="vehicle-reserve"
            disabled={!car.available}
            onClick={() => onReserve(car)}
          >
            {car.available ? <>Reserve <ArrowUpRight size={17}/></> : 'Unavailable'}
          </button>
        </div>
      </div>
    </article>
  );
}
