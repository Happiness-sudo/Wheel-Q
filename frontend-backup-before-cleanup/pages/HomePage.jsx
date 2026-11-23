import { ArrowDown, ArrowRight, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import SearchPlate from '../components/SearchPlate';
import FleetList from '../components/FleetList';

export default function HomePage({
  today, dates, days, fleet, category,
  onCategory, onDatesChange, onReserve, onRetry
}) {
  return (
    <>
      <section className="hero">
        <div className="hero-image" aria-hidden="true" />

        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-line" />
            PREMIUM CAR HIRE · RUIRU, KENYA
          </div>

          <h1 className="hero-title">
            THE ROAD
            <br />
            <span>IS YOURS.</span>
          </h1>

          <p className="hero-description">
            More than just a ride. Discover the freedom of driving
            something exceptional. Your next journey starts here.
          </p>

          <div className="hero-actions">
            <a href="#fleet" className="gold-button">
              Explore our fleet <ArrowUpRight size={18}/>
            </a>
            <span className="hero-caption">YOUR JOURNEY. YOUR RULES.</span>
          </div>
        </div>

        <div className="hero-bottom">
          <div className="hero-location">
            <span className="location-dot" />
            RUIRU, KIAMBU COUNTY
          </div>
          <div className="hero-scroll">
            SCROLL TO EXPLORE <ArrowDown size={15}/>
          </div>
          <div className="hero-index">01 / 03</div>
        </div>

        <div className="hero-side-label">WHEEL-Q AUTOMOTIVE EXPERIENCE</div>
      </section>

      <section className="booking-section">
        <div className="section-kicker">
          <span>01</span> PLAN YOUR JOURNEY
        </div>

        <div className="booking-heading">
          <div>
            <h2>Where to next?</h2>
            <p>Choose your dates. We'll help you find the right drive.</p>
          </div>
          <div className="booking-assurance">
            <ShieldCheck size={18}/>
            <span>Simple. Secure. Reliable.</span>
          </div>
        </div>

        <SearchPlate
          start={dates.start}
          end={dates.end}
          days={days}
          minDate={today}
          onChange={onDatesChange}
        />
      </section>

      <section className="brand-strip">
        <span>THE RIGHT CAR FOR EVERY JOURNEY</span>
        <span className="strip-star">✳</span>
        <span>COMFORT WITHOUT COMPROMISE</span>
        <span className="strip-star">✳</span>
        <span>MADE FOR THE OPEN ROAD</span>
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

      <section className="experience-section">
        <div className="experience-image" />
        <div className="experience-copy">
          <div className="section-kicker"><span>02</span> THE WHEEL-Q DIFFERENCE</div>
          <Sparkles className="experience-icon" size={28}/>
          <h2>Every journey deserves a better drive.</h2>
          <p>
            From everyday city drives to memorable road trips,
            we make finding your next car simple and enjoyable.
            Choose your vehicle and let the journey begin.
          </p>
          <a href="#fleet" className="text-link">
            Find your next drive <ArrowRight size={18}/>
          </a>
        </div>
      </section>
    </>
  );
}
