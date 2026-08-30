import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { roomApi, roomTypeApi } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import BookingModal from '../../components/customer/BookingModal';

const Rooms = () => {
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [checkInDate, setCheckInDate] = useState(
    searchParams.get('checkIn') || new Date().toISOString().split('T')[0]
  );
  const [checkOutDate, setCheckOutDate] = useState(
    searchParams.get('checkOut') ||
      new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [guests, setGuests] = useState(Number(searchParams.get('guests')) || 1);
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Booking Modal
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [roomsRes, typesRes] = await Promise.all([
        roomApi.getAll(),
        roomTypeApi.getAll(),
      ]);
      if (roomsRes && roomsRes.data) setRooms(roomsRes.data);
      if (typesRes && typesRes.data) setRoomTypes(typesRes.data);
    } catch (err) {
      console.error('Error loading rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAvailable = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        checkInDate,
        checkOutDate,
        guests: Number(guests),
        roomTypeId: selectedType ? Number(selectedType) : null,
        maxPrice: Number(maxPrice),
      };
      const res = await roomApi.search(payload);
      if (res && res.data) {
        setRooms(res.data);
      }
    } catch (err) {
      console.error('Error searching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter((room) => {
    if (statusFilter !== 'ALL' && room.status !== statusFilter) return false;
    if (selectedType && room.roomType?.id !== Number(selectedType)) return false;
    if (Number(room.pricePerNight) > maxPrice) return false;
    if (room.capacity < guests) return false;
    return true;
  });

  return (
    <div className="container" style={{ padding: '3rem 1.25rem 5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid var(--border-accent)',
            color: 'var(--gold-400)',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          ✦ LIVE CLOUD INVENTORY
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '0.5rem' }}>
          Rooms & Luxury Suites
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
          Browse available guest suites, filter with mathematical collision-prevention, and reserve instantly.
        </p>
      </div>

      {/* Interactive Category Filter Chips */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.75rem',
          marginBottom: '1.5rem',
          justifyContent: 'flex-start',
        }}
      >
        <button
          type="button"
          onClick={() => setSelectedType('')}
          className={`btn btn-sm ${selectedType === '' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderRadius: 'var(--radius-full)', minHeight: '38px', padding: '0.4rem 1.1rem' }}
        >
          All Categories ({rooms.length})
        </button>
        {roomTypes.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelectedType(String(t.id))}
            className={`btn btn-sm ${selectedType === String(t.id) ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)', minHeight: '38px', padding: '0.4rem 1.1rem' }}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Filter / Search Bar */}
      <div className="card card-glass card-gold-glow" style={{ marginBottom: '3rem', padding: '1.75rem' }}>
        <form onSubmit={handleSearchAvailable}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
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
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4+ Guests</option>
              </select>
            </div>

            <div>
              <label className="form-label">
                💵 MAX PRICE: ${maxPrice}
              </label>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', height: '40px', accentColor: 'var(--gold-500)' }}
              />
            </div>

            <div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', minHeight: '46px', fontSize: '0.95rem' }}
              >
                🔍 Filter Availability
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Room Listing Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gold-400)' }}>
          <div style={{ fontSize: '2.5rem', animation: 'spin 1s linear infinite' }}>⟳</div>
          <div style={{ marginTop: '1rem', fontWeight: 600 }}>Loading available suites from AWS MySQL...</div>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="card card-glass" style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📭</div>
          <h3 style={{ fontSize: '1.5rem' }}>No Available Rooms Matching Filter</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '480px', margin: '0.5rem auto 1.5rem' }}>
            Try adjusting your dates, guests, or resetting your filter criteria.
          </p>
          <button onClick={fetchInitialData} className="btn btn-outline">
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {filteredRooms.map((room) => {
            const isAvailable = room.status === 'AVAILABLE';
            const img =
              room.roomType?.imageUrl ||
              'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={room.id}
                className="card card-interactive"
                style={{ overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={img}
                    alt={`Room ${room.roomNumber}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem' }}>
                    <StatusBadge status={room.status} />
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0.85rem',
                      right: '0.85rem',
                      background: 'rgba(6, 9, 19, 0.85)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid var(--border-accent)',
                      color: 'var(--gold-400)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  >
                    ${room.pricePerNight}{' '}
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      / night
                    </span>
                  </div>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      marginBottom: '0.35rem',
                    }}
                  >
                    <h3 style={{ fontSize: '1.25rem' }}>Room {room.roomNumber}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {room.floor || '1st Floor'}
                    </span>
                  </div>

                  <div style={{ color: 'var(--gold-400)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                    {room.roomType?.name}
                  </div>

                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '1.25rem',
                      minHeight: '42px',
                      lineHeight: 1.5,
                      flex: 1,
                    }}
                  >
                    {room.description || room.roomType?.description}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      marginBottom: '1.25rem',
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '0.85rem',
                    }}
                  >
                    <span>👥 Max {room.capacity} Guests</span>
                    <span>✨ {room.roomType?.amenities?.split(',')[0] || 'Air Conditioning'}</span>
                  </div>

                  <button
                    onClick={() => setSelectedRoomForBooking(room)}
                    disabled={!isAvailable}
                    className={`btn ${isAvailable ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: '100%', minHeight: '44px' }}
                  >
                    {isAvailable ? 'Book This Suite →' : 'Unavailable (In Use)'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      {selectedRoomForBooking && (
        <BookingModal
          isOpen={!!selectedRoomForBooking}
          onClose={() => setSelectedRoomForBooking(null)}
          room={selectedRoomForBooking}
          initialDates={{ checkInDate, checkOutDate }}
        />
      )}
    </div>
  );
};

export default Rooms;
