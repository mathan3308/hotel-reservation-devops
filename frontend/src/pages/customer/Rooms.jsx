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
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Rooms & Luxury Suites</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Browse available guest suites, filter by dates with strict collision prevention, and reserve instantly.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="card card-glass" style={{ marginBottom: '2.5rem', padding: '1.5rem' }}>
        <form
          onSubmit={handleSearchAvailable}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto',
            gap: '1rem',
            alignItems: 'flex-end',
          }}
        >
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>📅 CHECK-IN</label>
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
            <label className="form-label" style={{ fontSize: '0.75rem' }}>📅 CHECK-OUT</label>
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
            <label className="form-label" style={{ fontSize: '0.75rem' }}>👥 GUESTS</label>
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
            <label className="form-label" style={{ fontSize: '0.75rem' }}>🏷 ROOM TYPE</label>
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
            <label className="form-label" style={{ fontSize: '0.75rem' }}>
              💵 MAX PRICE: ${maxPrice}
            </label>
            <input
              type="range"
              min="50"
              max="1000"
              step="25"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', height: '38px', accentColor: 'var(--gold-500)' }}
            />
          </div>

          <div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '42px' }}>
              🔍 Check Availability
            </button>
          </div>
        </form>
      </div>

      {/* Room Listing Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gold-500)' }}>
          <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>⟳</div>
          <div style={{ marginTop: '1rem' }}>Loading available rooms...</div>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="card card-glass" style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <h3>No Available Rooms Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Try adjusting your check-in / check-out dates, guest count, or price filters.
          </p>
          <button onClick={fetchInitialData} className="btn btn-outline" style={{ marginTop: '1.5rem' }}>
            Reset Filters
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
              <div key={room.id} className="card card-glass" style={{ overflow: 'hidden', padding: 0 }}>
                <div style={{ height: '200px', position: 'relative' }}>
                  <img
                    src={img}
                    alt={`Room ${room.roomNumber}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                    <StatusBadge status={room.status} />
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0.75rem',
                      right: '0.75rem',
                      background: 'rgba(0, 0, 0, 0.75)',
                      backdropFilter: 'blur(8px)',
                      color: 'var(--gold-500)',
                      padding: '0.3rem 0.65rem',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                    }}
                  >
                    ${room.pricePerNight} <span style={{ fontSize: '0.7rem', color: '#ccc', fontWeight: 400 }}>/ night</span>
                  </div>
                </div>

                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1.2rem' }}>Room {room.roomNumber}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{room.floor || '1st Floor'}</span>
                  </div>

                  <div style={{ color: 'var(--gold-500)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {room.roomType?.name}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', minHeight: '38px' }}>
                    {room.description || room.roomType?.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                    <span>👥 Max {room.capacity} Guests</span>
                    <span>✨ {room.roomType?.amenities?.split(',')[0] || 'Air Conditioning'}</span>
                  </div>

                  <button
                    onClick={() => setSelectedRoomForBooking(room)}
                    disabled={!isAvailable}
                    className={`btn ${isAvailable ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: '100%' }}
                  >
                    {isAvailable ? 'Reserve This Room' : 'Unavailable (Booked/Cleaning)'}
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
