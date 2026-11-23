import { CONTACT_PHONE, WHATSAPP_NUMBER } from '../config';

export default function Header({ view, onNavigate }) {
  const whatsappDigits = WHATSAPP_NUMBER.replace(/\D/g, '');
  const phoneLink = CONTACT_PHONE.replace(/\s/g, '');

  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <button type="button" className="brand" onClick={() => onNavigate('home')} aria-label="Wheel-Q home">
          <span>Wheel</span>
          <span className="brand__q">Q</span>
        </button>

        <nav className="site-nav" aria-label="Main">
          <button
            type="button"
            className="nav-link"
            aria-current={view === 'home' ? 'page' : undefined}
            onClick={() => onNavigate('home')}
          >
            Cars
          </button>
          <button
            type="button"
            className="nav-link"
            aria-current={view === 'find' ? 'page' : undefined}
            onClick={() => onNavigate('find')}
          >
            Find my booking
          </button>
          {phoneLink && (
            <a className="nav-link" href={`tel:${phoneLink}`}>
              Call us
            </a>
          )}
          {whatsappDigits && (
            <a className="nav-link" href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
