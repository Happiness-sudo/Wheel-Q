import { useCallback, useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import BookingDialog from './components/BookingDialog';
import HomePage from './pages/HomePage';
import FindBookingPage from './pages/FindBookingPage';
import { listCars } from './api';
import { addDays, daysBetween, todayISO } from './lib/dates';

export default function App() {
  const [today] = useState(todayISO);
  const [view, setView] = useState('home');
  const [dates, setDates] = useState(() => ({ start: addDays(todayISO(), 1), end: addDays(todayISO(), 4) }));
  const [fleet, setFleet] = useState({ status: 'loading', cars: [], sample: false });
  const [category, setCategory] = useState('All cars');
  const [reserving, setReserving] = useState(null);

  const days = daysBetween(dates.start, dates.end);

  const latestRequest = useRef(0);

  const loadCars = useCallback(
    async ({ quiet = false } = {}) => {
      const requestId = ++latestRequest.current;
      if (!quiet) setFleet((current) => ({ ...current, status: 'loading' }));
      try {
        const { data, sample } = await listCars(dates.start, dates.end);
        if (requestId === latestRequest.current) setFleet({ status: 'ready', cars: data, sample });
      } catch {
        if (requestId === latestRequest.current) setFleet({ status: 'error', cars: [], sample: false });
      }
    },
    [dates.start, dates.end],
  );

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  function changeDates(change) {
    const next = { ...dates, ...change };
    if (next.start < today) next.start = today;
    if (daysBetween(next.start, next.end) < 1) next.end = addDays(next.start, 1);
    setDates(next);
  }

  return (
    <>
      <Header view={view} onNavigate={setView} />

      <main>
        {view === 'home' ? (
          <HomePage
            today={today}
            dates={dates}
            days={days}
            fleet={fleet}
            category={category}
            onCategory={setCategory}
            onDatesChange={changeDates}
            onReserve={setReserving}
            onRetry={() => loadCars()}
          />
        ) : (
          <FindBookingPage />
        )}
      </main>

      <Footer />

      {reserving && (
        <BookingDialog
          key={reserving.id}
          car={reserving}
          start={dates.start}
          end={dates.end}
          days={days}
          onClose={() => setReserving(null)}
          onBooked={() => loadCars({ quiet: true })}
        />
      )}
    </>
  );
}
