import React, { useState, useEffect } from 'react';
import { reservationApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import ReceiptModal from '../../components/common/ReceiptModal';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedForReceipt, setSelectedForReceipt] = useState(null);

  const { success, error } = useToast();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await reservationApi.getAll();
      if (res && res.data) setReservations(res.data);
    } catch (err) {
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status, ref) => {
    try {
      await reservationApi.updateStatus(id, status);
      success(`Reservation ${ref} marked as ${status}`);
      fetchReservations();
    } catch (err) {
      error(err.message || 'Failed to update reservation status');
    }
  };

  const handleCancelReservation = async (id, ref) => {
    if (!window.confirm(`Are you sure you want to cancel reservation ${ref}? Simulated refund will be recorded.`)) return;
    try {
      await reservationApi.cancel(id);
      success(`Reservation ${ref} cancelled successfully`);
      fetchReservations();
    } catch (err) {
      error(err.message || 'Failed to cancel reservation');
    }
  };

  const filtered = reservations.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const refMatch = r.reservationReference?.toLowerCase().includes(term);
      const nameMatch = (r.user?.fullName || r.user?.username)?.toLowerCase().includes(term);
      const roomMatch = r.room?.roomNumber?.toLowerCase().includes(term);
      return refMatch || nameMatch || roomMatch;
    }
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Reservation Roster</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Oversee hotel bookings, manage frontdesk check-ins, process cancellations, and inspect billing vouchers.
          </p>
        </div>
        <button onClick={fetchReservations} className="btn btn-secondary btn-sm">
          🔄 Refresh
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card card-glass" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search reference, guest name, or room #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none' }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gold-500)' }}>
          <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>⟳</div>
        </div>
      ) : (
        <div className="card card-glass">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Ref #</th>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Check-In / Out</th>
                  <th>Nights</th>
                  <th>Total Paid</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      No reservations match the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((res) => (
                    <tr key={res.id}>
                      <td style={{ fontWeight: 800, color: 'var(--gold-500)', fontSize: '0.85rem' }}>
                        {res.reservationReference}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{res.user?.fullName || res.user?.username}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{res.user?.email}</div>
                      </td>
                      <td>
                        <div>Room {res.room?.roomNumber}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{res.room?.roomType?.name}</div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        {res.checkInDate} → {res.checkOutDate}
                      </td>
                      <td style={{ textAlign: 'center' }}>{res.numNights}</td>
                      <td style={{ fontWeight: 700, color: 'var(--success)' }}>
                        ${Number(res.totalAmount).toFixed(2)}
                      </td>
                      <td>
                        <StatusBadge status={res.status} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => setSelectedForReceipt(res)} className="btn btn-secondary btn-sm" title="View Voucher">
                            📄
                          </button>
                          {res.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleUpdateStatus(res.id, 'COMPLETED', res.reservationReference)}
                              className="btn btn-success btn-sm"
                              title="Mark Completed / Checked-In"
                            >
                              ✓
                            </button>
                          )}
                          {res.status !== 'CANCELLED' && res.status !== 'COMPLETED' && (
                            <button
                              onClick={() => handleCancelReservation(res.id, res.reservationReference)}
                              className="btn btn-danger btn-sm"
                              title="Cancel & Refund"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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

export default AdminReservations;
