import { CONTACT_PHONE, WHATSAPP_NUMBER } from '../config';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

function WheelLogo() {
  return (
    <svg className="logo-wheel" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="29" cy="29" r="25" stroke="currentColor" strokeWidth="5"/>
      <circle cx="29" cy="29" r="16" stroke="currentColor" strokeWidth="3"/>
      <circle cx="29" cy="29" r="5" fill="currentColor"/>
      <path d="M29 13V24M29 34V45M13 29H24M34 29H45M17.7 17.7L25.5 25.5M32.5 32.5L40.3 40.3M40.3 17.7L32.5 25.5M25.5 32.5L17.7 40.3"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M42 45L57 59" stroke="#D5B477" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  );
}

export default function Header({ view, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const whatsapp = WHATSAPP_NUMBER.replace(/\D/g, '');
  const phone = CONTACT_PHONE.replace(/\s/g, '');

  function navigate(page) {
    onNavigate(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand" onClick={() => navigate('home')} aria-label="Wheel-Q home">
          <WheelLogo />
          <span className="brand-name">WHEEL<span>Q</span></span>
          <span className="brand-subtitle">DRIVE YOUR WAY</span>
        </button>

        <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`} aria-label="Main navigation">
          <button className={`nav-link ${view === 'home' ? 'active' : ''}`} onClick={() => navigate('home')}>
            Discover
          </button>
          <a className="nav-link" href="#fleet" onClick={() => setMenuOpen(false)}>
            Our fleet
          </a>
          <button className={`nav-link ${view === 'find' ? 'active' : ''}`} onClick={() => navigate('find')}>
            My booking
          </button>

          {phone && <a className="nav-link" href={`tel:${phone}`}>Contact</a>}

          {whatsapp && (
            <a className="nav-cta" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">
              Let's talk <ArrowUpRight size={16}/>
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
