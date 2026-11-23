import SearchPlate from '../components/SearchPlate';
import FleetList from '../components/FleetList';

export default function HomePage({ today, dates, days, fleet, category, onCategory, onDatesChange, onReserve, onRetry }) {
  return (
    <>
      <section className="hero">
        <div className="wrap hero__inner">
          <h1 className="hero__title">Hire a car in Ruiru</h1>
          <p className="hero__lead">Choose your dates to see which cars are free.</p>
          <SearchPlate
            start={dates.start}
            end={dates.end}
            days={days}
            minDate={today}
            onChange={onDatesChange}
          />
        </div>
        <div className="road" aria-hidden="true" />
      </section>

      <FleetList
        fleet={fleet}
        start={dates.start}
        end={dates.end}
        days={days}
        category={category}
        onCategory={onCategory}
        onReserve={onReserve}
        onRetry={onRetry}
      />
    </>
  );
}
