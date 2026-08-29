import React, { useState, useEffect } from 'react';
import { housekeepingApi, roomApi, reservationApi, inventoryApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';

const AdminHousekeeping = () => {
  const [cleaningRooms, setCleaningRooms] = useState([]);
  const [activeReservations, setActiveReservations] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dispatch Form state
  const [selectedReference, setSelectedReference] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { success, error } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, resRes, invRes] = await Promise.all([
        roomApi.getAll(),
        reservationApi.getAll(),
        inventoryApi.getAll(),
      ]);

      if (roomsRes && roomsRes.data) {
        setCleaningRooms(roomsRes.data.filter((r) => r.status === 'CLEANING' || r.status === 'MAINTENANCE'));
      }
      if (resRes && resRes.data) {
        setActiveReservations(resRes.data.filter((r) => r.status === 'CONFIRMED' || r.status === 'PENDING'));
      }
      if (invRes && invRes.data) {
        setInventoryItems(invRes.data);
      }
    } catch (err) {
      console.error('Error fetching housekeeping data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDispatch = async (ref, roomId) => {
    setIsSubmitting(true);
    try {
      const payload = {
        reference: ref,
        roomId: roomId || null,
      };

      const res = await housekeepingApi.prepareRoom(payload);
      if (res && res.data) {
        success(`Housekeeping room prep kit issued for ${ref}! Inventory deducted and room marked AVAILABLE.`);
        fetchData();
      }
    } catch (err) {
      error(err.message || 'Failed to dispatch room prep kit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomDispatch = async (e) => {
    e.preventDefault();
    if (!selectedReference && !selectedRoomId) {
      error('Please select a room or reservation reference');
      return;
    }

    const ref = selectedReference || `ROOM-${selectedRoomId}`;
    handleQuickDispatch(ref, selectedRoomId);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Housekeeping & Room Preparation</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Automate room preparation by issuing standard amenity packs (Egyptian Towels, Silk Bedding, Herbal Soaps, Lavender Shampoos), deducting warehouse stock, and resetting room status to AVAILABLE.
        </p>
      </div>

      {/* Standard Kit Breakdown Card */}
      <div className="card card-glass" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--gold-500)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.15rem' }}>📦 Standard Room Turn-down & Preparation Pack</h3>
          <span style={{ fontSize: '0.75rem', background: 'rgba(217, 119, 6, 0.2)', color: 'var(--gold-500)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 'bold' }}>
            AUTO DEDUCTION INTEGRATION
          </span>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Dispatching a room preparation kit executes automated <code>STOCK_OUT</code> transactions from the central warehouse linked to the reservation reference:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
          <div style={{ background: 'var(--bg-elevated)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.2rem' }}>🛁</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>2× Bath Towels</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Egyptian Cotton</div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.2rem' }}>🛏</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>1× King Bed Linen</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Silk Fitted Sheet</div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.2rem' }}>🧼</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>2× Organic Soaps</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Oatmeal Bar 50g</div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.2rem' }}>🧴</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>2× Shampoos</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lavender 100ml</div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Rooms Under Cleaning / Turnover */}
        <div className="card card-glass">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Rooms Awaiting Housekeeping</h3>
          {cleaningRooms.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              ✓ All rooms are currently clean and ready for guests!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cleaningRooms.map((room) => (
                <div
                  key={room.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--bg-elevated)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>Room {room.roomNumber} ({room.roomType?.name})</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Floor: {room.floor} • Status: <StatusBadge status={room.status} />
                    </div>
                  </div>
                  <button
                    onClick={() => handleQuickDispatch(`ROOM-${room.roomNumber}`, room.id)}
                    disabled={isSubmitting}
                    className="btn btn-primary btn-sm"
                  >
                    🧹 Issue Kit & Mark Ready
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirmed Bookings Prepared for Check-in */}
        <div className="card card-glass">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Upcoming Arrival Preparations</h3>
          {activeReservations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No upcoming check-ins requiring turnover.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeReservations.slice(0, 5).map((res) => (
                <div
                  key={res.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--bg-elevated)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--gold-500)' }}>{res.reservationReference}</div>
                    <div style={{ fontSize: '0.85rem' }}>
                      Room {res.room?.roomNumber} for {res.user?.fullName || res.user?.username}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Arrival: {res.checkInDate} ({res.numGuests} Guests)
                    </div>
                  </div>
                  <button
                    onClick={() => handleQuickDispatch(res.reservationReference, res.room?.id)}
                    disabled={isSubmitting}
                    className="btn btn-primary btn-sm"
                  >
                    ✨ Prep Room
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHousekeeping;
