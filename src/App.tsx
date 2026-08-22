import React, { useState, useEffect } from 'react';

interface Service {
  id: number;
  name: string;
  category: string;
  icon: string;
  rating: string;
  price: string;
  address: string;
  phone: string;
  description: string;
  cover: string;
  portfolio: string[];
}

const servicesData: Service[] = [
  {
    id: 1,
    name: "Studio Élégance",
    category: "Photographe",
    icon: "📸",
    rating: "4.9 · 128 avis",
    price: "À partir de 45 000 DA",
    address: "12 Rue des Frères Bessol, Akid Lotfi, Oran, Algérie",
    phone: "+213550000000",
    description: "Studio spécialisé dans les mariages et événements. Photographie, vidéo et albums personnalisés pour immortaliser votre Jour J.",
    cover: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
    portfolio: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=85",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=85",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=700&q=85",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=700&q=85"
    ]
  },
  {
    id: 2,
    name: "Royal Wedding",
    category: "Salle",
    icon: "🏛️",
    rating: "4.8 · 96 avis",
    price: "À partir de 120 000 DA",
    address: "Bir El Djir, Oran, Algérie",
    phone: "+213560000000",
    description: "Salle de réception élégante pour mariages et grandes célébrations, avec espace invités et décoration personnalisable.",
    cover: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85",
    portfolio: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=700&q=85",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=700&q=85",
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=700&q=85",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=85"
    ]
  },
  {
    id: 3,
    name: "Luxury Cars",
    category: "Voiture",
    icon: "🚗",
    rating: "4.9 · 74 avis",
    price: "À partir de 25 000 DA",
    address: "Oran Centre, Algérie",
    phone: "+213770000000",
    description: "Voitures premium avec chauffeur pour mariages, séances photos et événements.",
    cover: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85",
    portfolio: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=85",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=700&q=85",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=700&q=85",
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=700&q=85"
    ]
  },
  {
    id: 4,
    name: "Maison du Traiteur",
    category: "Traiteur",
    icon: "🍽️",
    rating: "4.7 · 61 avis",
    price: "À partir de 1 500 DA / personne",
    address: "Canastel, Oran, Algérie",
    phone: "+213660000000",
    description: "Traiteur pour mariages et événements : menus traditionnels, modernes, buffet et service sur place.",
    cover: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=85",
    portfolio: [
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=700&q=85",
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85",
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=700&q=85",
      "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=700&q=85"
    ]
  },
  {
    id: 5,
    name: "Élégance Homme",
    category: "Costume",
    icon: "🤵",
    rating: "4.8 · 43 avis",
    price: "À partir de 18 000 DA",
    address: "Es Senia, Oran, Algérie",
    phone: "+213550111111",
    description: "Location et vente de costumes de cérémonie pour mariés et invités.",
    cover: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85",
    portfolio: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=85",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=700&q=85",
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=700&q=85",
      "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=700&q=85"
    ]
  }
];

const categoriesList = [
  { name: 'Tout', icon: '✦' },
  { name: 'Photographe', icon: '📸' },
  { name: 'Salle', icon: '🏛️' },
  { name: 'Costume', icon: '🤵' },
  { name: 'Voiture', icon: '🚗' },
  { name: 'Traiteur', icon: '🍽️' },
  { name: 'Décoration', icon: '🌸' }
];

export default function App() {
  const [view, setView] = useState<'landing' | 'home' | 'detail'>('landing');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tout');
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  // Modals state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Forms state
  const [loginName, setLoginName] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [bookingTime, setBookingTime] = useState('09:00 — 12:00');
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleEnterSite = () => {
    setView('home');
    window.scrollTo(0, 0);
  };

  const handleSelectCategory = (catName: string) => {
    setSelectedCategory(catName);
  };

  const handleOpenDetail = (service: Service) => {
    setCurrentService(service);
    setSelectedDayNumber(null);
    setSelectedDate('');
    setView('detail');
    window.scrollTo(0, 0);
  };

  const handleCloseDetail = () => {
    setView('home');
    window.scrollTo(0, 0);
  };

  const handleOpenLogin = () => {
    setIsMenuOpen(false);
    setIsLoginOpen(true);
  };

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = loginName.trim();
    const phone = loginPhone.trim();
    if (!name || !phone) {
      alert("Entrez votre nom et votre numéro.");
      return;
    }
    localStorage.setItem("jourjUser", JSON.stringify({ name, phone }));
    setIsLoginOpen(false);
    showToast(`Bienvenue ${name} ! Votre espace Jour J est prêt.`);
  };

  const handleDayClick = (dayNum: number, status: string) => {
    if (status === 'booked') {
      showToast("❌ Cette date est déjà réservée.");
      return;
    }
    setSelectedDayNumber(dayNum);
    const dateStr = `2026-09-${String(dayNum).padStart(2, '0')}`;
    setSelectedDate(dateStr);

    if (status === 'partial') {
      showToast(`🟠 Date partiellement disponible : ${dayNum} septembre 2026`);
    } else {
      showToast(`🟢 Date disponible : ${dayNum} septembre 2026`);
    }
  };

  const handleOpenBooking = () => {
    if (!selectedDate) {
      alert("Choisissez d'abord une date disponible dans le calendrier.");
      return;
    }
    try {
      const stored = localStorage.getItem("jourjUser");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setBookingName(u.name);
        if (u.phone) setBookingPhone(u.phone);
      }
    } catch {
      // ignore
    }
    setIsBookingOpen(true);
  };

  const handleConfirmBooking = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = bookingName.trim();
    const phone = bookingPhone.trim();
    if (!name || !phone) {
      alert("Veuillez renseigner votre nom et votre téléphone.");
      return;
    }
    try {
      const existing = JSON.parse(localStorage.getItem("jourjBookings") || "[]");
      existing.push({
        service: currentService?.name,
        date: selectedDate,
        time: bookingTime,
        name,
        phone
      });
      localStorage.setItem("jourjBookings", JSON.stringify(existing));
    } catch {
      // ignore
    }
    setIsBookingOpen(false);
    setIsSuccessOpen(true);
  };

  const handleCallService = () => {
    if (currentService) {
      window.location.href = `tel:${currentService.phone}`;
    }
  };

  const handleWhatsappService = () => {
    if (currentService) {
      const cleaned = currentService.phone.replace(/\D/g, "");
      const msg = encodeURIComponent(`Bonjour, je vous contacte depuis Jour J concernant ${currentService.name}`);
      window.open(`https://wa.me/${cleaned}?text=${msg}`, "_blank");
    }
  };

  const handleOpenMap = () => {
    if (currentService) {
      const query = encodeURIComponent(currentService.address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
    }
  };

  const handleDemoAlert = (item: string) => {
    setIsMenuOpen(false);
    showToast(`${item} sera disponible dans la version connectée.`);
  };

  // Filtered services
  const displayedServices = selectedCategory === 'Tout'
    ? servicesData
    : servicesData.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());

  // Render September 2026 Calendar days
  const renderCalendarDays = () => {
    if (!currentService) return null;
    const year = 2026;
    const month = 8; // September (0-indexed)
    const firstDay = new Date(year, month, 1);
    const offset = (firstDay.getDay() + 6) % 7; // Monday = 0
    const totalDays = new Date(year, month + 1, 0).getDate(); // 30 days

    const daysElements = [];

    // Empty offset slots
    for (let i = 0; i < offset; i++) {
      daysElements.push(<div key={`empty-${i}`}></div>);
    }

    // Day numbers
    for (let n = 1; n <= totalDays; n++) {
      const isBooked = (n + currentService.id * 2) % 9 === 0;
      const isPartial = !isBooked && (n + currentService.id) % 5 === 0;
      const status = isBooked ? 'booked' : isPartial ? 'partial' : 'available';
      const isSelected = selectedDayNumber === n;

      daysElements.push(
        <div
          key={`day-${n}`}
          id={`cal-day-${n}`}
          className={`day ${status} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDayClick(n, status)}
        >
          {n}
        </div>
      );
    }

    return daysElements;
  };

  return (
    <div className="app-container">
      {/* TOAST NOTICE */}
      {toastMessage && (
        <div className="toast-notice">
          {toastMessage}
        </div>
      )}

      {/* LANDING PAGE */}
      {view === 'landing' && (
        <section id="landing" className="landing">
          <div className="landing-content">
            <div className="crown">♛</div>
            <div className="brand">JOUR J</div>
            <div className="tagline">LE MOMENT QU'ON ATTEND</div>
            <p className="landing-text">
              Tout pour préparer votre grand jour au même endroit : salles, photographes, voitures, traiteurs, costumes et bien plus.
            </p>
            <button
              id="enter-site-btn"
              className="enter-btn"
              onClick={handleEnterSite}
            >
              Entrer
            </button>
            <div className="demo-note">Version démonstration · Oran, Algérie</div>
          </div>
        </section>
      )}

      {/* MAIN APPLICATION SITE */}
      {view !== 'landing' && (
        <section id="site">
          {/* HEADER */}
          <header className="topbar">
            <button
              id="menu-toggle-btn"
              className="circle-btn"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Menu"
            >
              ☰
            </button>
            <div className="logo" onClick={() => { setView('home'); setSelectedCategory('Tout'); }}>
              JOUR J<small>LE MOMENT QU'ON ATTEND</small>
            </div>
            <button
              id="user-login-btn"
              className="circle-btn"
              onClick={handleOpenLogin}
              aria-label="Profil"
            >
              ◉
            </button>
          </header>

          {/* CATEGORIES BAR */}
          <div className="categories">
            {categoriesList.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  id={`cat-btn-${cat.name}`}
                  className={`category ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    handleSelectCategory(cat.name);
                    if (view === 'detail') setView('home');
                  }}
                  type="button"
                >
                  <div className="category-icon">{cat.icon}</div>
                  <div className="category-name">{cat.name}</div>
                </button>
              );
            })}
          </div>

          {/* HOME VIEW */}
          {view === 'home' && (
            <main id="home" className="home-main">
              <section className="hero">
                <div className="hero-content">
                  <div className="hero-label">VOTRE GRAND JOUR</div>
                  <h2>Le moment qu'on attend</h2>
                  <p>Trouvez les professionnels qui feront de votre événement un moment inoubliable.</p>
                </div>
              </section>

              <section className="section">
                <div className="section-title">
                  <h3 id="serviceTitle">
                    {selectedCategory === 'Tout' ? 'Services populaires' : `${selectedCategory}s disponibles`}
                  </h3>
                  <span>Oran</span>
                </div>
                <div id="services" className="services">
                  {displayedServices.map((s) => (
                    <article
                      key={s.id}
                      id={`service-card-${s.id}`}
                      className="service-card"
                      onClick={() => handleOpenDetail(s)}
                    >
                      <div
                        className="service-image"
                        style={{ backgroundImage: `url('${s.cover}')` }}
                      >
                        <span className="badge">{s.category}</span>
                      </div>
                      <div className="service-info">
                        <h4>{s.icon} {s.name}</h4>
                        <div className="location">📍 {s.address.split(",")[0]}, Oran</div>
                        <div className="price">{s.price}</div>
                      </div>
                    </article>
                  ))}
                  {displayedServices.length === 0 && (
                    <div className="text-center py-8 text-[#777] text-xs w-full">
                      Aucun prestataire disponible dans cette catégorie pour le moment.
                    </div>
                  )}
                </div>
              </section>
            </main>
          )}

          {/* DETAIL VIEW */}
          {view === 'detail' && currentService && (
            <section id="detail" className="detail">
              <div className="detail-header">
                <button
                  id="detail-back-btn"
                  className="circle-btn"
                  onClick={handleCloseDetail}
                  aria-label="Retour"
                >
                  ‹
                </button>
                <h3 id="detailHeader">{currentService.name}</h3>
              </div>

              <div
                id="detailCover"
                className="detail-cover"
                style={{ backgroundImage: `url('${currentService.cover}')` }}
              >
                <div className="cover-title">
                  <h1 id="detailName">{currentService.name}</h1>
                  <p id="detailCategory">{currentService.category} · Oran</p>
                </div>
              </div>

              <div className="detail-info">
                <h2 id="infoName">{currentService.name}</h2>
                <div className="rating">★★★★★ <span id="rating">{currentService.rating}</span></div>
                <p id="description" className="description">{currentService.description}</p>
                
                <div className="contact-grid">
                  <button
                    id="btn-call"
                    className="contact-btn gold"
                    onClick={handleCallService}
                  >
                    📞 Appeler
                  </button>
                  <button
                    id="btn-whatsapp"
                    className="contact-btn"
                    onClick={handleWhatsappService}
                  >
                    💬 WhatsApp
                  </button>
                </div>
              </div>

              <div className="info-card">
                <h3>📍 Adresse</h3>
                <div id="address" className="address">{currentService.address}</div>
                <div className="map">
                  <button id="btn-map" onClick={handleOpenMap}>
                    🗺️ Ouvrir dans Google Maps
                  </button>
                </div>
              </div>

              <section className="portfolio">
                <h3>Portfolio</h3>
                <div id="portfolioGrid" className="portfolio-grid">
                  {currentService.portfolio.map((imgUrl, idx) => (
                    <div key={idx} className="portfolio-photo">
                      <img src={imgUrl} alt={`Portfolio ${idx + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              </section>

              <section className="availability">
                <div className="section-title">
                  <h3>Disponibilité</h3>
                  <span id="monthLabel">septembre 2026</span>
                </div>
                <div className="calendar-card">
                  <div className="calendar-top">
                    <button className="arrow" type="button" aria-label="Mois précédent">‹</button>
                    <strong id="calendarTitle">septembre 2026</strong>
                    <button className="arrow" type="button" aria-label="Mois suivant">›</button>
                  </div>
                  <div id="calendar" className="days">
                    <div className="day-name">Lun</div>
                    <div className="day-name">Mar</div>
                    <div className="day-name">Mer</div>
                    <div className="day-name">Jeu</div>
                    <div className="day-name">Ven</div>
                    <div className="day-name">Sam</div>
                    <div className="day-name">Dim</div>
                    {renderCalendarDays()}
                  </div>
                  <div className="legend">
                    <span><i className="dot g"></i>Disponible</span>
                    <span><i className="dot o"></i>Partiellement disponible</span>
                    <span><i className="dot r"></i>Réservé</span>
                  </div>
                </div>
              </section>

              <section className="section">
                <div className="section-title">
                  <h3>Horaires</h3>
                </div>
                <div className="hours-grid">
                  <div className="hour">
                    <span>Matin</span>
                    <strong>08:00 — 12:00</strong>
                  </div>
                  <div className="hour">
                    <span>Après-midi</span>
                    <strong>14:00 — 19:00</strong>
                  </div>
                </div>
              </section>

              <div className="book-section">
                <button
                  id="btn-open-booking"
                  className="book-btn"
                  onClick={handleOpenBooking}
                >
                  📅 Demander une réservation
                </button>
              </div>
            </section>
          )}

          {/* BOTTOM NAVIGATION */}
          <nav className="bottom">
            <button
              id="bottom-home-btn"
              className={`nav ${view === 'home' ? 'active' : ''}`}
              onClick={() => { setView('home'); setSelectedCategory('Tout'); }}
            >
              <div>⌂</div>Accueil
            </button>
            <button
              id="bottom-add-btn"
              className="add"
              onClick={handleOpenLogin}
              aria-label="Ajouter"
            >
              +
            </button>
            <button
              id="bottom-profile-btn"
              className="nav"
              onClick={handleOpenLogin}
            >
              <div>♙</div>Moi
            </button>
          </nav>
        </section>
      )}

      {/* DRAWER MENU OVERLAY */}
      {isMenuOpen && (
        <div
          id="menu"
          className="overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setIsMenuOpen(false); }}
        >
          <div className="side">
            <button className="x" onClick={() => setIsMenuOpen(false)} aria-label="Fermer le menu">
              ×
            </button>
            <div className="menu-logo">
              <h2>JOUR J</h2>
              <p style={{ color: '#777', fontSize: '9px', marginTop: '6px' }}>
                LE MOMENT QU'ON ATTEND
              </p>
            </div>
            <div className="menu-item" onClick={() => { setView('home'); setIsMenuOpen(false); }}>
              🏠 Accueil
            </div>
            <div className="menu-item" onClick={handleOpenLogin}>
              👤 Se connecter
            </div>
            <div className="menu-item" onClick={() => handleDemoAlert('Mes favoris')}>
              ❤️ Mes favoris
            </div>
            <div className="menu-item" onClick={() => handleDemoAlert('Mes réservations')}>
              📅 Mes réservations
            </div>
            <div className="menu-item" onClick={() => handleDemoAlert('Paramètres')}>
              ⚙️ Paramètres
            </div>
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {isLoginOpen && (
        <div id="loginModal" className="modal">
          <div className="modal-box">
            <div className="modal-head">
              <strong>Connexion</strong>
              <button className="x" onClick={() => setIsLoginOpen(false)}>×</button>
            </div>
            <p style={{ color: '#999', fontSize: '11px', lineHeight: '1.6' }}>
              Démo client : entrez n'importe quel nom et numéro. La session est enregistrée localement sur cet appareil.
            </p>
            <form onSubmit={handleLoginSubmit}>
              <input
                id="loginName"
                className="input"
                placeholder="Votre nom"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                required
              />
              <input
                id="loginPhone"
                className="input"
                placeholder="Numéro de téléphone"
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                required
              />
              <button id="login-submit-btn" className="modal-btn" type="submit">
                Entrer dans mon espace
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      {isBookingOpen && currentService && (
        <div id="bookingModal" className="modal">
          <div className="modal-box">
            <div className="modal-head">
              <strong>Demande de réservation</strong>
              <button className="x" onClick={() => setIsBookingOpen(false)}>×</button>
            </div>
            <p id="bookingService" style={{ color: 'var(--gold2)', fontSize: '13px' }}>
              {currentService.name} · {selectedDate}
            </p>
            <form onSubmit={handleConfirmBooking}>
              <input
                id="bookingDate"
                className="input"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
              <select
                id="bookingTime"
                className="input"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
              >
                <option value="09:00 — 12:00">09:00 — 12:00</option>
                <option value="14:00 — 17:00">14:00 — 17:00</option>
                <option value="17:00 — 20:00">17:00 — 20:00</option>
              </select>
              <input
                id="bookingName"
                className="input"
                placeholder="Votre nom"
                value={bookingName}
                onChange={(e) => setBookingName(e.target.value)}
                required
              />
              <input
                id="bookingPhone"
                className="input"
                placeholder="Votre téléphone"
                value={bookingPhone}
                onChange={(e) => setBookingPhone(e.target.value)}
                required
              />
              <button id="booking-submit-btn" className="modal-btn" type="submit">
                Envoyer la demande
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {isSuccessOpen && (
        <div id="successModal" className="modal">
          <div className="modal-box success">
            <div className="icon">✓</div>
            <h2>Demande envoyée</h2>
            <p>
              Votre demande de réservation a été enregistrée dans cette démonstration. Le professionnel pourra ensuite vous contacter.
            </p>
            <button
              id="success-close-btn"
              className="modal-btn"
              onClick={() => setIsSuccessOpen(false)}
            >
              Terminer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
