import React from 'react';
import Modal from './Modal';
import StatusBadge from './StatusBadge';

const ReceiptModal = ({ isOpen, onClose, reservation }) => {
  if (!reservation) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Booking Confirmation Voucher" maxWidth="560px">
      <div style={{ background: '#ffffff', color: '#1e293b', padding: '1.5rem', borderRadius: 'var(--radius-md)', fontFamily: 'sans-serif' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ color: '#0f172a', margin: 0, fontSize: '1.4rem', fontFamily: 'serif' }}>GRAND LUXE RESORT</h2>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Cloud DevOps Hotel Management</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b' }}>REFERENCE</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#d97706', letterSpacing: '1px' }}>
              {reservation.reservationReference}
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Status: </span>
            <StatusBadge status={reservation.status} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Payment: </span>
            <StatusBadge status={reservation.payment?.paymentStatus || 'CONFIRMED'} />
          </div>
        </div>

        {/* Guest & Room Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Guest Name</div>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>{reservation.user?.fullName || reservation.user?.username || 'Guest'}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{reservation.user?.email}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Room Details</div>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>
              Room {reservation.room?.roomNumber} - {reservation.room?.roomType?.name || 'Standard'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Capacity: {reservation.numGuests} Guest(s)</div>
          </div>
        </div>

        {/* Dates */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', background: '#f1f5f9', padding: '0.85rem', borderRadius: '6px', marginBottom: '1.25rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>CHECK-IN</div>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>{reservation.checkInDate}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>CHECK-OUT</div>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>{reservation.checkOutDate}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>TOTAL NIGHTS</div>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>{reservation.numNights} Night(s)</div>
          </div>
        </div>

        {/* Billing Breakdown */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '0.5rem 0', color: '#64748b' }}>Rate per night</td>
              <td style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 500 }}>${Number(reservation.pricePerNight).toFixed(2)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '0.5rem 0', color: '#64748b' }}>Duration ({reservation.numNights} nights)</td>
              <td style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 500 }}>${(Number(reservation.pricePerNight) * Number(reservation.numNights)).toFixed(2)}</td>
            </tr>
            {reservation.payment?.transactionReference && (
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.5rem 0', color: '#64748b' }}>Transaction Ref ({reservation.payment?.paymentMethod})</td>
                <td style={{ padding: '0.5rem 0', textAlign: 'right', fontSize: '0.8rem', color: '#64748b' }}>{reservation.payment?.transactionReference}</td>
              </tr>
            )}
            <tr style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              <td style={{ padding: '0.75rem 0' }}>Total Amount Paid</td>
              <td style={{ padding: '0.75rem 0', textAlign: 'right', color: '#059669' }}>
                ${Number(reservation.totalAmount).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer info */}
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px dashed #cbd5e1', paddingTop: '0.75rem' }}>
          Thank you for choosing Grand Luxe Resort. Please present this voucher upon check-in.
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
        <button onClick={handlePrint} className="btn btn-secondary">
          🖨 Print Voucher
        </button>
        <button onClick={onClose} className="btn btn-primary">
          Done
        </button>
      </div>
    </Modal>
  );
};

export default ReceiptModal;
