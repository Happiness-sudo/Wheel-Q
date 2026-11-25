import { useEffect, useState } from "react";
import {
  adminListCars,
  adminCreateCar,
  adminUpdateCar,
  adminDeleteCar
} from "./api";
import { LayoutDashboard, CarFront, CalendarDays, Users, Settings, LogOut, Plus, Search, Bell, Upload, Eye, Pencil, Trash2, Menu, X } from "lucide-react";
import "./Admin.css";

const starterCars = [
  { id: 1, name: "Toyota Axio", plate: "KDG 921B", category: "Economy", price: 3500, status: "Available", image: "" },
  { id: 2, name: "Toyota Prado", plate: "KCA 402R", category: "SUV", price: 9500, status: "Booked", image: "" },
];

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cars, setCars] = useState([]);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({ name: "", plate: "", category: "Economy", price: "", status: "Available", image: "" });
useEffect(() => {
  async function loadCars() {
    try {
      setLoading(true);
      const data = await adminListCars();
      setCars(data);
    } catch (error) {
      setNotice(error.message || "Could not load vehicles.");
    } finally {
      setLoading(false);
    }
  }

  loadCars();
}, []);

  function login(e) {
    e.preventDefault();
    // UI demonstration only: backend authentication will replace this check.
    if (email.trim() && password.trim()) {
      setAuthenticated(true);
      setNotice("");
    } else setNotice("Enter your email and password.");
  }
  function logout() { setAuthenticated(false); setEmail(""); setPassword(""); }
  function openAdd() { setEditing(null); setForm({ name: "", plate: "", category: "Economy", price: "", status: "Available", image: "" }); setShowForm(true); }
  function openEdit(car) { setEditing(car.id); setForm({ ...car, price: String(car.price) }); setShowForm(true); }
  function saveCar(e) {
    e.preventDefault();
    const item = { ...form, price: Number(form.price), id: editing || Date.now() };
    setCars((prev) => editing ? prev.map((c) => c.id === editing ? item : c) : [item, ...prev]);
    setShowForm(false);
  }
  function removeCar(id) { if (confirm("Delete this vehicle from the demo fleet?")) setCars((prev) => prev.filter((c) => c.id !== id)); }
  function upload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setNotice("Choose an image file."); return; }
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, image: String(reader.result) }));
    reader.readAsDataURL(file);
  }

  if (!authenticated) return (
    <main className="aq-login">
      <section className="aq-login-image">
        <div className="aq-brand"><span>WHEEL<span className="aq-gold">-Q</span></span><small>TOURS AND CAR HIRE</small></div>
        <div className="aq-login-message"><span className="aq-kicker">ADMIN PORTAL</span><h1>Manage every ride.<br/><em>Move your business.</em></h1><p>Fleet, bookings and customer operations in one place.</p></div>
        <small className="aq-image-footer">WHERE EVERY RIDE IS UNIQUE</small>
      </section>
      <section className="aq-login-panel">
        <form className="aq-login-card" onSubmit={login}>
          <div className="aq-mobile-brand">WHEEL<span>-Q</span></div>
          <span className="aq-kicker">WELCOME BACK</span>
          <h2>Admin sign in</h2>
          <p>Sign in to access your management dashboard.</p>
          <label>Email address<input type="email" autoComplete="username" placeholder="admin@wheelq.co.ke" value={email} onChange={e=>setEmail(e.target.value)} /></label>
          <label>Password<input type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={e=>setPassword(e.target.value)} /></label>
          {notice && <div className="aq-notice">{notice}</div>}
          <button className="aq-primary aq-login-submit">Sign in to dashboard</button>
          <div className="aq-login-note">Access is intended for authorised WHEEL-Q administrators.</div>
          <a className="aq-back" href="/">← Back to website</a>
        </form>
      </section>
    </main>
  );

  const visibleCars = cars.filter((c) => `${c.name} ${c.plate} ${c.category}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="aq-admin">
      <aside className={`aq-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="aq-side-brand">WHEEL<span>-Q</span><small>ADMIN CONSOLE</small></div>
        <div className="aq-side-label">WORKSPACE</div>
        <a className="aq-side-active"><LayoutDashboard size={18}/> Dashboard</a>
        <a href="#fleet"><CarFront size={18}/> Fleet management</a>
        <a><CalendarDays size={18}/> Bookings</a>
        <a><Users size={18}/> Customers</a>
        <div className="aq-side-label">SETTINGS</div>
        <a><Settings size={18}/> Settings</a>
        <button className="aq-side-logout" onClick={logout}><LogOut size={18}/> Sign out</button>
        <div className="aq-side-footer">Where Every Ride is Unique</div>
      </aside>
      {sidebarOpen && <button className="aq-side-scrim" onClick={()=>setSidebarOpen(false)} aria-label="Close menu"/>}
      <main className="aq-main">
        <header className="aq-topbar">
          <button className="aq-mobile-menu" onClick={()=>setSidebarOpen(!sidebarOpen)}><Menu/></button>
          <div><span className="aq-top-muted">Workspace /</span> Dashboard</div>
          <div className="aq-top-right"><button className="aq-icon-button" aria-label="Notifications"><Bell size={18}/></button><div className="aq-avatar">WQ</div><span className="aq-admin-label">Administrator</span></div>
        </header>
        <section className="aq-dashboard-content">
          <div className="aq-welcome"><div><span className="aq-kicker">OVERVIEW</span><h1>Dashboard</h1><p>Here's what's happening with your rental business.</p></div><button className="aq-primary" onClick={openAdd}><Plus size={18}/> Add vehicle</button></div>
          <div className="aq-stat-grid">
            <article className="aq-stat"><span>Total vehicles</span><strong>{cars.length}</strong><small>In your demo fleet</small></article>
            <article className="aq-stat"><span>Available</span><strong>{cars.filter(c=>c.status==="Available").length}</strong><small>Ready to rent</small></article>
            <article className="aq-stat"><span>Currently booked</span><strong>{cars.filter(c=>c.status==="Booked").length}</strong><small>Marked as booked</small></article>
            <article className="aq-stat"><span>Fleet categories</span><strong>{new Set(cars.map(c=>c.category)).size}</strong><small>Across vehicle types</small></article>
          </div>
          <section className="aq-fleet-panel" id="fleet">
            <div className="aq-fleet-heading"><div><h2>Fleet management</h2><p>Add, update and manage vehicle listings.</p></div><button className="aq-primary aq-add-mobile" onClick={openAdd}><Plus size={17}/> Add vehicle</button></div>
            <div className="aq-toolbar"><div className="aq-search"><Search size={17}/><input placeholder="Search model, plate or category" value={query} onChange={e=>setQuery(e.target.value)}/></div><span>{visibleCars.length} vehicles</span></div>
            <div className="aq-table-wrap"><table className="aq-table"><thead><tr><th>Vehicle</th><th>Registration</th><th>Category</th><th>Daily rate</th><th>Status</th><th>Actions</th></tr></thead><tbody>
              {visibleCars.map(car=><tr key={car.id}><td><div className="aq-car-cell">{car.image ? <img src={car.image} alt=""/> : <div className="aq-car-placeholder"><CarFront/></div>}<strong>{car.name}</strong></div></td><td>{car.plate}</td><td>{car.category}</td><td>KES {Number(car.price).toLocaleString()}</td><td><span className={`aq-status ${car.status==="Available"?"available":"booked"}`}>{car.status}</span></td><td><div className="aq-actions"><button title="Edit" onClick={()=>openEdit(car)}><Pencil size={16}/></button><button title="Delete" onClick={()=>removeCar(car.id)}><Trash2 size={16}/></button></div></td></tr>)}
            </tbody></table></div>
            {visibleCars.length===0 && <div className="aq-empty">No vehicles match that search.</div>}
          </section>
          <div className="aq-demo-warning">Demo dashboard: changes and uploaded images currently remain in this page's memory only. Secure authentication, database persistence and cloud image storage will be connected in the backend phase.</div>
        </section>
      </main>
      {showForm && <div className="aq-modal-overlay" onClick={()=>setShowForm(false)}><section className="aq-vehicle-modal" onClick={e=>e.stopPropagation()}><button className="aq-modal-x" onClick={()=>setShowForm(false)}><X/></button><span className="aq-kicker">{editing?"EDIT VEHICLE":"NEW LISTING"}</span><h2>{editing?"Update vehicle":"Add a vehicle"}</h2><p>Enter the details customers will see.</p><form onSubmit={saveCar}>
        <label>Vehicle model<input required placeholder="e.g. Toyota Axio" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
        <label>Registration / number plate<input required placeholder="e.g. KDG 921B" value={form.plate} onChange={e=>setForm({...form,plate:e.target.value.toUpperCase()})}/></label>
        <div className="aq-form-row"><label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Economy</option><option>SUV</option><option>Van</option><option>Luxury</option><option>Tour vehicle</option></select></label><label>Daily price (KES)<input required min="0" type="number" value={form.price} placeholder="3500" onChange={e=>setForm({...form,price:e.target.value})}/></label></div>
        <label>Status<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>Available</option><option>Booked</option><option>Unavailable</option></select></label>
        <label className="aq-upload"><Upload size={22}/><strong>{form.image?"Image selected":"Upload vehicle photo"}</strong><span>Choose an image file from your device</span><input type="file" accept="image/*" onChange={upload}/></label>
        {form.image && <img className="aq-preview" src={form.image} alt="Vehicle preview"/>}
        <div className="aq-form-actions"><button type="button" className="aq-secondary" onClick={()=>setShowForm(false)}>Cancel</button><button className="aq-primary">{editing?"Save changes":"Add vehicle"}</button></div>
      </form></section></div>}
    </div>
  );
}
