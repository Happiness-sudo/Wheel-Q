import { useEffect, useState } from 'react';
import { CalendarDays, CarFront, MapPin, ShieldCheck, Headset, Car, Menu, X, ArrowRight, Search, Fuel, Users } from 'lucide-react';
import './styles.css';
import { listCars, createBooking, findBooking } from './api';
import { API_URL } from './config';

const categories = [ ['Economy','Affordable & fuel efficient'],['SUV','Power & space'],['Van','Ideal for groups'],['Luxury','Travel in style'] ];
function Header({onBook,onFind}) { const [open,setOpen]=useState(false); return <header className="header"><div className="header-inner"><a href="#home" className="logo"><span className="logo-car">Wheel<span>Q</span></span><span className="logo-tagline">Tours and Car Hire</span></a><button className="menu-toggle" onClick={()=>setOpen(!open)} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button><nav className={open?'navigation nav-open':'navigation'}><a href="#home" onClick={()=>setOpen(false)}>Home</a><a href="#fleet" onClick={()=>setOpen(false)}>Our Fleet</a><button className="nav-link-button" onClick={()=>{onFind();setOpen(false)}}>Find Booking</button><a href="#contact" onClick={()=>setOpen(false)}>Contact</a></nav><div className="header-actions"><a href="https://wa.me/254726913395" className="whatsapp-link" target="_blank" rel="noreferrer">â— WhatsApp</a><button className="gold-button" onClick={onBook}>Book Now <ArrowRight size={16}/></button></div></div></header>; }
function BookingSearch({dates,setDates,category,setCategory,onSearch}) { return <div className="booking-search"><div className="booking-field"><CalendarDays/><div className="booking-field-content"><label htmlFor="pickup">Pick-up Date</label><input id="pickup" type="date" value={dates.pickup} onChange={e=>setDates({...dates,pickup:e.target.value})}/></div></div><div className="booking-field"><CalendarDays/><div className="booking-field-content"><label htmlFor="return">Return Date</label><input id="return" type="date" min={dates.pickup} value={dates.return} onChange={e=>setDates({...dates,return:e.target.value})}/></div></div><div className="booking-field"><CarFront/><div className="booking-field-content"><label htmlFor="category">Car Category</label><select id="category" value={category} onChange={e=>setCategory(e.target.value)}><option value="All">Any Category</option>{categories.map(([c])=><option key={c} value={c}>{c}</option>)}</select></div></div><button className="gold-button search-button" onClick={onSearch}><Search size={19}/> Find Available Cars</button></div>; }
function ServiceStrip(){const services=[[ShieldCheck,'Safe & Secure','Bookings'],[Headset,'24/7 Customer','Support'],[Car,'Well-Maintained','Vehicles'],[MapPin,'Convenient Pickup','in Ruiru']];return <section className="service-strip">{services.map(([Icon,a,b])=><div className="service-item" key={a}><Icon/><div><strong>{a}</strong><span>{b}</span></div></div>)}</section>}
function Categories({ onSelect, vehicles }) {
  return (
    <section className="categories-section">
      <div className="section-heading">
        <span className="section-label">OUR FLEET</span>
        <h2>Choose from Our Wide Range of Vehicles</h2>
        <p>From economy to luxury, we have the perfect ride for you.</p>
      </div>

      <div className="category-grid">
        {categories.map(([name, description]) => {
          const categoryCar = vehicles.find(
            (car) => car.category === name
          );

          return (
            <article className="category-card" key={name}>
              {categoryCar?.image && (
                <img src={categoryCar.image} alt={name} />
              )}

              <div className="category-card-content">
                <h3>
                  {name === "SUV" ? "SUVs" :
                   name === "Van" ? "Vans" :
                   name === "Luxury" ? "Luxury Cars" :
                   "Economy Cars"}
                </h3>

                <p>{description}</p>

                <button
                  className="outline-button"
                  onClick={() => onSelect(name)}
                >
                  View Cars <ArrowRight size={14}/>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Fleet({ vehicles, onBook }) {
  return (
    <section className="fleet-section" id="fleet">
      <div className="section-heading">
        <span className="section-label">AVAILABLE VEHICLES</span>
        <h2>Find Your Perfect Ride</h2>
        <p>Comfort, reliability and convenience on every journey.</p>
      </div>

      {vehicles.length === 0 ? (
        <p className="empty-message">No cars match this category.</p>
      ) : (
        <div className="fleet-grid">
          {vehicles.map((vehicle) => (
            <article className="vehicle-card" key={vehicle.id}>
              <div className="vehicle-image">
                {vehicle.image && (
                  <img src={vehicle.image} alt={vehicle.name} />
                )}
                <span className="vehicle-category">
                  {vehicle.category}
                </span>
              </div>

              <div className="vehicle-content">
                <h3>{vehicle.name}</h3>

                <div className="vehicle-specs">
                  <span>
                    <Users size={16} /> {vehicle.seats} Seats
                  </span>
                  <span>
                    <CarFront size={16} /> {vehicle.transmission}
                  </span>
                  <span>
                    <Fuel size={16} /> {vehicle.fuel}
                  </span>
                </div>

                <div className="vehicle-bottom">
                  <div className="vehicle-price">
                    <strong>
                      KES {Number(vehicle.price).toLocaleString()}
                    </strong>
                    <span>per day</span>
                  </div>

                  <button
                    className="gold-button"
                    onClick={() => onBook(vehicle)}
                  >
                    Reserve
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function Experience(){return <section className="experience-section"><div className="experience-content"><span className="section-label">THE WHEEL-Q EXPERIENCE</span><h2>More Than Just a Car Hire</h2><p>We are committed to providing you with a seamless car hire experience in Ruiru and beyond. Travel with confidence, comfort and class.</p><a className="gold-button" href="#contact">Learn More <ArrowRight size={16}/></a></div></section>}
function Footer(){return <footer className="footer" id="contact"><div className="footer-content"><div><a href="#home" className="logo footer-logo"><span className="logo-car">Wheel<span>Q</span></span><span className="logo-tagline">Tours and Car Hire</span></a><p>Where Every Ride is Unique</p></div><div><h3>Quick Links</h3><a href="#home">Home</a><a href="#fleet">Our Fleet</a><a href="#contact">Contact</a></div><div><h3>Location</h3><p>Lake Oil Petrol Station, Matangi Road, Kimbo, Ruiru</p><p>0726 913 395</p><p>0704 576 605</p></div></div><div className="footer-bottom">Â© {new Date().getFullYear()} WHEEL-Q. All rights reserved.</div></footer>}
function Modal({
  vehicle,
  onClose,
  dates,
  onSubmit,
  saving,
  bookingResult,
  bookingError
}) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
if (!vehicle) return null;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!dates.pickup || !dates.return) {
      alert("Please select your pick-up and return dates.");
      return;
    }

    if (dates.return <= dates.pickup) {
      alert("Return date must be after pick-up date.");
      return;
    }

    await onSubmit({
      car_id: vehicle.id,
      customer_name: customerName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      pickup_date: dates.pickup,
      return_date: dates.return
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="booking-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          <X />
        </button>

        <h2>Reserve Your Vehicle</h2>

        <div className="modal-summary">
          {vehicle.image && (
            <img src={vehicle.image} alt={vehicle.name} />
          )}

          <div>
            <strong>{vehicle.name}</strong>
            <p>
              KES {Number(vehicle.price).toLocaleString()} per day
            </p>
          </div>
        </div>

        <p>Pick-up: {dates.pickup || "Not selected"}</p>
        <p>Return: {dates.return || "Not selected"}</p>

        {bookingResult ? (
          <div className="booking-success">
            <h3>Booking received!</h3>
            <p>Your reservation has been saved.</p>
            <p>
              Reference: <strong>{bookingResult.reference}</strong>
            </p>
            <p>
              Total: KES {Number(bookingResult.total_amount).toLocaleString()}
            </p>
            <p>Status: {bookingResult.status}</p>

            <button className="gold-button" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                required
                maxLength={120}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your full name"
              />
            </label>

            <label>
              Phone number
              <input
                required
                maxLength={30}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07XXXXXXXX"
              />
            </label>

            <label>
              Email address (optional)
              <input
                type="email"
                maxLength={120}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>

            {bookingError && (
              <p className="booking-error">{bookingError}</p>
            )}

            <button
              type="submit"
              className="gold-button modal-whatsapp"
              disabled={saving}
            >
              {saving ? "Processing..." : "Confirm Reservation"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
function App() {
  const [dates, setDates] = useState({
    pickup: "",
    return: ""
  });

  const [category, setCategory] = useState("All");
  const [filter, setFilter] = useState("All");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fleetError, setFleetError] = useState("");

  const [vehicle, setVehicle] = useState(null);
  const [findOpen, setFindOpen] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [foundBooking, setFoundBooking] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);

  const [bookingSaving, setBookingSaving] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingResult, setBookingResult] = useState(null);

  async function handleBooking(payload) {
    try {
      setBookingSaving(true);
      setBookingError("");
      setBookingResult(null);

      const result = await createBooking(payload);
      setBookingResult(result);

    } catch (error) {
      setBookingError(
        error.message || "Could not complete your reservation."
      );
    } finally {
      setBookingSaving(false);
    }
  }

  async function handleFindBooking(e) {
    e.preventDefault();

    try {
      setLookupLoading(true);
      setLookupError("");
      setFoundBooking(null);

      const result = await findBooking(
        bookingCode.trim(),
        bookingPhone.trim()
      );

      setFoundBooking(result);

    } catch (error) {
      setLookupError(error.message || "Booking not found.");
    } finally {
      setLookupLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadFleet() {
      try {
        setLoading(true);
        setFleetError("");

        const result = await listCars();

        if (!active) return;

        const data = Array.isArray(result) ? result : result.data;

        if (!Array.isArray(data)) {
          throw new Error("The vehicle list returned an unexpected response.");
        }

        const vehicles = data.map((car) => ({
          ...car,
          image: car.image
            ? car.image.startsWith("http")
              ? car.image
              : `${API_URL}${car.image}`
            : ""
        }));

        setCars(vehicles);
      } catch {
        if (active) {
          setCars([]);
          setFleetError(
            "We couldn't load our vehicles right now. Please try again shortly."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadFleet();

    return () => {
      active = false;
    };
  }, []);
  const availableCars = cars.filter(
    (car) => car.status === "Available"
  );

  const filtered = availableCars.filter(
    (car) => filter === "All" || car.category === filter
  );

  const scrollFleet = () => {
    document.getElementById("fleet")?.scrollIntoView({
      behavior: "smooth"
    });
  };

  function search() {
    if (
      dates.pickup &&
      dates.return &&
      dates.return < dates.pickup
    ) {
      alert("Return date cannot be earlier than pick-up date.");
      return;
    }

    setFilter(category);
    scrollFleet();
  }

  return (
    <>
      <Header
        onBook={() => document.getElementById("booking")?.scrollIntoView({
          behavior: "smooth"
        })}
        onFind={() => {
          setBookingCode("");
          setBookingPhone("");
          setFoundBooking(null);
          setLookupError("");
          setFindOpen(true);
        }}
      />

      <main>
        <section className="hero" id="home">
          <div className="hero-overlay"/>

          <div className="hero-content">
            <span className="hero-kicker">
              CAR HIRE, TOURS & TRANSFERS IN KENYA
            </span>
            <h1>Rent a Car with<span>WHEEL-Q</span></h1>
            <p className="hero-subtitle">Where Every Ride is Unique</p>
            <p className="hero-location">
              <MapPin size={18}/>
              Lake Oil Petrol Station, Matangi Road, Kimbo, Ruiru
            </p>
          </div>

          <div className="booking-container" id="booking">
            <BookingSearch
              dates={dates}
              setDates={setDates}
              category={category}
              setCategory={setCategory}
              onSearch={search}
            />
          </div>
        </section>

        <ServiceStrip/>

        <Categories
          onSelect={(selected) => {
            setFilter(selected);
            scrollFleet();
          }}
          vehicles={availableCars}
        />

        <Fleet
          vehicles={filtered}
          onBook={setVehicle}
        />

        {loading && (
          <p className="empty-message">
            Loading available vehicles...
          </p>
        )}

        {!loading && fleetError && (
          <p className="empty-message">{fleetError}</p>
        )}

        {!loading && !fleetError && availableCars.length === 0 && (
          <p className="empty-message">
            No vehicles are currently available. Please check back soon.
          </p>
        )}

        <Experience/>
      </main>

      <Footer/>

      <Modal
        key={vehicle?.id ?? "closed"}
        vehicle={vehicle}
        onClose={() => {
          setVehicle(null);
          setBookingResult(null);
          setBookingError("");
        }}
        dates={dates}
        onSubmit={handleBooking}
        saving={bookingSaving}
        bookingResult={bookingResult}
        bookingError={bookingError}
      />

      {findOpen && (
        <div
          className="modal-overlay"
          onClick={() => setFindOpen(false)}
        >
          <div
            className="booking-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setFindOpen(false)}
            >
              <X/>
            </button>

            <h2>Find Your Booking</h2>
            <p>Enter your booking reference and phone number.</p>

            <form onSubmit={handleFindBooking}>
              <input
                className="booking-code-input"
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value)}
                placeholder="Booking reference"
                required
              />

              <input
                className="booking-code-input"
                type="tel"
                value={bookingPhone}
                onChange={(e) => setBookingPhone(e.target.value)}
                placeholder="Phone number used for booking"
                required
              />

              {lookupError && (
                <p className="booking-error">{lookupError}</p>
              )}

              <button
                type="submit"
                className="gold-button modal-whatsapp"
                disabled={lookupLoading}
              >
                {lookupLoading ? "Searching..." : "Find Booking"}
              </button>
            </form>

            {foundBooking && (
              <div className="booking-success">
                <h3>Booking Details</h3>
                <p>Reference: {foundBooking.reference}</p>
                <p>Customer: {foundBooking.customer_name}</p>
                <p>Vehicle: {foundBooking.car_name}</p>
                <p>Pick-up: {foundBooking.pickup_date}</p>
                <p>Return: {foundBooking.return_date}</p>
                <p>
                  Total: KES {Number(foundBooking.total_amount).toLocaleString()}
                </p>
                <p>Status: {foundBooking.status}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;















