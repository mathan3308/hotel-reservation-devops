import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { roomTypeApi, roomApi } from '../../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [roomTypes, setRoomTypes] = useState([]);
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [checkInDate, setCheckInDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [guests, setGuests] = useState(1);
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesRes, roomsRes] = await Promise.all([
          roomTypeApi.getAll(),
          roomApi.getAll(),
        ]);
        if (typesRes && typesRes.data) setRoomTypes(typesRes.data);
        if (roomsRes && roomsRes.data) setFeaturedRooms(roomsRes.data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      type: selectedType,
    }).toString();
    navigate(`/rooms?${query}`);
  };

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* Luxury Hero Banner */}
      <section
        style={{
          position: 'relative',
          padding: '5.5rem 0 6.5rem',
          background:
            'radial-gradient(ellipse 90% 60% at 50% 10%, rgba(245, 158, 11, 0.15) 0%, rgba(6, 9, 19, 0.94) 85%), url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          {/* Floating Pill Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid var(--border-accent)',
              color: 'var(--gold-400)',
              fontSize: '0.825rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '1.5rem',
              boxShadow: 'var(--gold-glow)',
            }}
          >
            <span>👑</span> FIVE-STAR LUXURY RESORT & CLOUD OPERATIONS
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.25rem, 5.5vw, 4.25rem)',
              lineHeight: 1.15,
              maxWidth: '920px',
              margin: '0 auto 1.5rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
            }}
          >
            Where Bespoke Luxury Meets{' '}
            <span
              style={{
                background: 'var(--gold-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
              }}
            >
              Cloud Native Excellence
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--text-secondary)',
              maxWidth: '720px',
              margin: '0 auto 2.75rem',
              lineHeight: 1.6,
            }}
          >
            Indulge in exquisite guest suites backed by real-time automated warehouse logistics, zero-downtime CI/CD deployment, and high-availability Kubernetes clustering.
          </p>

          {/* Interactive Responsive Search Bar */}
          <div
            className="card card-glass card-gold-glow"
            style={{
              maxWidth: '1060px',
              margin: '0 auto',
              padding: '1.75rem',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <form onSubmit={handleSearch}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1.25rem',
                  alignItems: 'flex-end',
                }}
              >
                <div>
                  <label className="form-label">📅 CHECK-IN</label>
                  <input
                    type="date"
                    className="form-control"
                    value={checkInDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">📅 CHECK-OUT</label>
                  <input
                    type="date"
                    className="form-control"
                    value={checkOutDate}
                    min={checkInDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">👥 GUESTS</label>
                  <select
                    className="form-control"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                  >
                    <option value={1}>1 Guest (Solo)</option>
                    <option value={2}>2 Guests (Couple)</option>
                    <option value={3}>3 Guests (Family)</option>
                    <option value={4}>4+ Guests (Group)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">🏷 ROOM TIER</label>
                  <select
                    className="form-control"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">All Luxury Tiers</option>
                    {roomTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ gridColumn: 'span 1' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', minHeight: '46px', fontSize: '1rem' }}
                  >
                    🔍 Search Suites
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Real-time Cloud DevOps & Hotel Metrics */}
      <section style={{ padding: '3rem 0', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="grid-4" style={{ textAlign: 'center' }}>
            <div className="card card-glass" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold-400)', fontFamily: 'var(--font-display)' }}>
                99.99%
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.2rem' }}>
                Cloud Uptime (AWS Live)
              </div>
            </div>

            <div className="card card-glass" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', fontFamily: 'var(--font-display)' }}>
                12
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.2rem' }}>
                Luxury Suites Ready
              </div>
            </div>

            <div className="card card-glass" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--info)', fontFamily: 'var(--font-display)' }}>
                100%
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.2rem' }}>
                Automated CI/CD Verified
              </div>
            </div>

            <div className="card card-glass" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--purple)', fontFamily: 'var(--font-display)' }}>
                &lt; 50ms
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.2rem' }}>
                Microservices Latency
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Room Tiers Section */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginBottom: '3rem',
              textAlign: 'center',
            }}
          >
            <div style={{ color: 'var(--gold-400)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              ✦ CURATED ACCOMMODATIONS
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>Featured Luxury Rooms & Suites</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>
              Each suite is equipped with bespoke European furnishings, smart ambient lighting, and automated minibar replenishment.
            </p>
          </div>

          <div className="grid-3">
            {roomTypes.map((type) => (
              <div
                key={type.id}
                className="card card-interactive"
                style={{ overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={type.imageUrl || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'}
                    alt={type.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'rgba(6, 9, 19, 0.82)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid var(--border-accent)',
                      color: 'var(--gold-400)',
                      padding: '0.4rem 0.9rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 800,
                      fontSize: '1rem',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  >
                    ${type.basePrice}{' '}
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                      / night
                    </span>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '1rem',
                      left: '1rem',
                      background: 'rgba(0, 0, 0, 0.7)',
                      backdropFilter: 'blur(6px)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      color: '#ffffff',
                      fontWeight: 600,
                    }}
                  >
                    👥 Up to {type.defaultCapacity} Guests
                  </div>
                </div>

                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.6rem' }}>{type.name}</h3>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '1.25rem',
                      lineHeight: 1.5,
                      flex: 1,
                    }}
                  >
                    {type.description}
                  </p>

                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      marginBottom: '1.5rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    ✨ <strong style={{ color: 'var(--gold-400)' }}>Amenities:</strong> {type.amenities}
                  </div>

                  <Link
                    to={`/rooms?type=${type.id}`}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    Reserve {type.name} →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/rooms" className="btn btn-outline btn-lg">
              Explore All 12 Available Suites →
            </Link>
          </div>
        </div>
      </section>

      {/* DevOps & Warehouse Logistics Architectural Highlights */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ color: 'var(--gold-400)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              ✦ ENTERPRISE CAPABILITIES
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', marginTop: '0.35rem' }}>
              Engineered with Enterprise DevOps Standards
            </h2>
            <p style={{ maxWidth: '650px', margin: '0.5rem auto 0' }}>
              Seamlessly harmonizing luxury hospitality with intelligent warehouse stock workflows and fault-tolerant cloud architecture.
            </p>
          </div>

          <div className="grid-3">
            <div className="card card-glass" style={{ borderLeft: '4px solid var(--gold-500)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛡</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Zero-Collision Reservations</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Mathematical date overlap validation prevents double bookings with automatic reservation reference generation and instant invoice logging.
              </p>
            </div>

            <div className="card card-glass" style={{ borderLeft: '4px solid var(--success)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📦</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Integrated Warehouse Logistics</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Automated linen and toiletry staging across multi-depot warehouse locations with low-stock warnings and housekeeping dispatch.
              </p>
            </div>

            <div className="card card-glass" style={{ borderLeft: '4px solid var(--info)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>☸️</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Kubernetes & Microservices</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Decoupled Spring Boot Java 21, React Nginx, and MySQL with Horizontal Pod Autoscaling (HPA) and automated self-healing probes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
