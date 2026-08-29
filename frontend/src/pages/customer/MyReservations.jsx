import React, { useState, useEffect } from 'react';
import { reservationApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import ReceiptModal from '../../components/common/ReceiptModal';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selectedForReceipt, setSelectedForReceipt] = useState(null);
  const { success, error } = useToast();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await reservationApi.getMy();
      if (res && res.data) {
        setReservations(res.data);
      }
    } catch (err) {
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id, ref) => {
    if (!window.confirm(`Are you sure you want to cancel reservation ${ref}? A full simulated refund will be issued.`)) {
      return;
    }

    try {
      const res = await reservationApi.cancel(id);
      if (res && res.data) {
        success(`Reservation ${ref} has been cancelled successfully.`);
        fetchReservations();
      }
    } catch (err) {
      error(err.message || 'Failed to cancel reservation');
    }
  };

  const filtered = reservations.filter((r) => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>My Reservations</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Review your past and upcoming stays, download vouchers, and manage bookings.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-elevated)', padding: '0.35rem', borderRadius: 'var(--radius-md)' }}>
          {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`btn btn-sm ${filter === tab ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none' }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gold-500)' }}>
          <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>⟳</div>
          <div style={{ marginTop: '1rem' }}>Loading your reservations...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card card-glass" style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏨</div>
          <h3>No Reservations Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            You have no bookings matching the selected filter.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filtered.map((res) => {
            const canCancel = res.status === 'CONFIRMED' || res.status === 'PENDING';

            return (
              <div
                key={res.id}
                className="card card-glass"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr 1fr auto',
                  gap: '1.5rem',
                  alignItems: 'center',
                }}
              >
                {/* Reference & Room */}
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    REFERENCE
                  </span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gold-500)', letterSpacing: '0.5px' }}>
                    {res.reservationReference}
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <StatusBadge status={res.status} />
                  </div>
                </div>

                {/* Stay Info */}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>
                    Room {res.room?.roomNumber} - {res.room?.roomType?.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    📅 {res.checkInDate} → {res.checkOutDate} ({res.numNights} {res.numNights === 1 ? 'Night' : 'Nights'}) | 👥 {res.numGuests} Guests
                  </div>
                  {res.specialRequests && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Note: "{res.specialRequests}"
                    </div>
                  )}
                </div>

                {/* Billing */}
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    TOTAL BILLED
                  </span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                    ${Number(res.totalAmount).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Payment: <StatusBadge status={res.payment?.paymentStatus || 'CONFIRMED'} />
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button onClick={() => setSelectedForReceipt(res)} className="btn btn-outline btn-sm">
                    📄 View Voucher
                  </button>
                  {canCancel && (
                    <button
                      onClick={() => handleCancel(res.id, res.reservationReference)}
                      className="btn btn-danger btn-sm"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedForReceipt && (
        <ReceiptModal
          isOpen={!!selectedForReceipt}
          onClose={() => setSelectedForReceipt(null)}
          reservation={selectedForReceipt}
        />
      )}
    </div>
  );
};

export default MyReservations;
