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
        if (roomsRes && roomsRes.data) setFeaturedRooms(roomsRes.data.slice(0, 3));
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
    <div>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '6rem 0 7rem',
          background:
            'radial-gradient(circle at 50% 30%, rgba(217, 119, 6, 0.12) 0%, rgba(11, 15, 25, 0.95) 75%), url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1800&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <span
            style={{
              display: 'inline-block',
              padding: '0.35rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(217, 119, 6, 0.15)',
              border: '1px solid var(--border-accent)',
              color: 'var(--gold-500)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '1.25rem',
            }}
          >
            ★ Five-Star Luxury Experience & Smart Logistics
          </span>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.15,
              maxWidth: '850px',
              margin: '0 auto 1.5rem',
              color: '#ffffff',
            }}
          >
            Where Luxury Hospitality Meets Modern Cloud Architecture
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              maxWidth: '650px',
              margin: '0 auto 3rem',
            }}
          >
            Experience exquisite guest suites backed by real-time automated warehouse logistics, CI/CD automated deployment, and Kubernetes container orchestration.
          </p>

          {/* Search Bar Widget */}
          <div
            className="card card-glass"
            style={{
              maxWidth: '1000px',
              margin: '0 auto',
              padding: '1.5rem',
              textAlign: 'left',
            }}
          >
            <form
              onSubmit={handleSearch}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 140px',
                gap: '1rem',
                alignItems: 'flex-end',
              }}
            >
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>
                  📅 CHECK-IN
                </label>
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
                <label className="form-label" style={{ fontSize: '0.75rem' }}>
                  📅 CHECK-OUT
                </label>
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
                <label className="form-label" style={{ fontSize: '0.75rem' }}>
                  👥 GUESTS
                </label>
                <select
                  className="form-control"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4+ Guests</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>
                  🏷 ROOM TIER
                </label>
                <select
                  className="form-control"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">All Room Tiers</option>
                  {roomTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '44px' }}>
                  🔍 Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Highlights / Features Banner */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-card)' }}>
        <div className="container">
          <div className="grid-3">
            <div className="card" style={{ background: 'var(--bg-elevated)', borderLeft: '4px solid var(--gold-500)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏨</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Smart Reservation Engine</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Mathematical date overlap validation preventing overbooking with instant booking vouchers and simulated payments.
              </p>
            </div>

            <div className="card" style={{ background: 'var(--bg-elevated)', borderLeft: '4px solid var(--success)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Integrated Warehouse Logistics</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Real-time stock movement, low-stock threshold triggers, multi-warehouse rack/bin locations, and room prep auto-issue.
              </p>
            </div>

            <div className="card" style={{ background: 'var(--bg-elevated)', borderLeft: '4px solid var(--info)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚀</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Cloud Native CI/CD & K8s</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Multi-stage Docker containers, automated GitHub Actions pipelines, multi-replica Kubernetes scaling, and self-healing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Room Tiers */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <span style={{ color: 'var(--gold-500)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                EXQUISITE ACCOMMODATIONS
              </span>
              <h2 style={{ fontSize: '2rem', marginTop: '0.25rem' }}>Featured Rooms & Suites</h2>
            </div>
            <Link to="/rooms" className="btn btn-outline">
              View All Rooms →
            </Link>
          </div>

          <div className="grid-3">
            {roomTypes.map((type) => (
              <div key={type.id} className="card card-glass" style={{ overflow: 'hidden', padding: 0 }}>
                <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={type.imageUrl || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'}
                    alt={type.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'rgba(0, 0, 0, 0.7)',
                      backdropFilter: 'blur(8px)',
                      color: 'var(--gold-500)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                    }}
                  >
                    ${type.basePrice} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#ccc' }}>/ night</span>
                  </div>
                </div>

                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{type.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', minHeight: '40px' }}>
                    {type.description}
                  </p>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    ✨ {type.amenities}
                  </div>
                  <Link to={`/rooms?type=${type.id}`} className="btn btn-primary" style={{ width: '100%' }}>
                    Browse Available Rooms
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
