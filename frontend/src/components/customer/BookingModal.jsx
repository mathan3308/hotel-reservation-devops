import React, { useState } from 'react';
import { reservationApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../common/Modal';
import ReceiptModal from '../common/ReceiptModal';

const BookingModal = ({ isOpen, onClose, room, initialDates = {} }) => {
  const { isAuthenticated, user } = useAuth();
  const { success, error } = useToast();

  const [checkInDate, setCheckInDate] = useState(
    initialDates.checkInDate || new Date().toISOString().split('T')[0]
  );
  const [checkOutDate, setCheckOutDate] = useState(
    initialDates.checkOutDate ||
      new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [numGuests, setNumGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [loading, setLoading] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState(null);

  if (!room) return null;

  // Calculate nights
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const totalAmount = (Number(room.pricePerNight) * diffDays).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      error('Please sign in or register to complete your reservation');
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      error('Check-out date must be after check-in date');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        roomId: room.id,
        checkInDate,
        checkOutDate,
        numGuests: Number(numGuests),
        specialRequests,
        autoSimulatePayment: true,
        paymentMethod,
      };

      const res = await reservationApi.create(payload);
      if (res && res.data) {
        success('Reservation confirmed and payment simulated successfully!');
        setConfirmedReservation(res.data);
      }
    } catch (err) {
      error(err.message || 'Failed to book room: Check dates or existing bookings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen && !confirmedReservation} onClose={onClose} title={`Book Room ${room.roomNumber} - ${room.roomType?.name}`}>
        <form onSubmit={handleSubmit}>
          {/* Room Summary Header */}
          <div style={{ display: 'flex', gap: '1rem', background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                Room {room.roomNumber} ({room.roomType?.name})
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Max Capacity: {room.capacity} Guests | Floor: {room.floor || '1st'}
              </div>
              <div style={{ fontSize: '1.1rem', color: 'var(--gold-500)', fontWeight: 800, marginTop: '0.25rem' }}>
                ${room.pricePerNight} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ night</span>
              </div>
            </div>
          </div>

          {/* Dates & Guests */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Check-In Date</label>
              <input
                type="date"
                className="form-control"
                value={checkInDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckInDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Check-Out Date</label>
              <input
                type="date"
                className="form-control"
                value={checkOutDate}
                min={checkInDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Number of Guests (Max {room.capacity})</label>
            <select
              className="form-control"
              value={numGuests}
              onChange={(e) => setNumGuests(e.target.value)}
            >
              {Array.from({ length: room.capacity }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Special Requests (Optional)</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="e.g. Quiet floor, extra pillows, late check-in"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            ></textarea>
          </div>

          {/* Simulated Payment Section */}
          <div style={{ background: 'rgba(217, 119, 6, 0.1)', border: '1px solid var(--border-accent)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>💳 Simulated Payment Flow</span>
              <span style={{ fontSize: '0.75rem', background: 'var(--gold-500)', color: '#000', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>
                DEMO SANDBOX
              </span>
            </div>

            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Payment Method</label>
              <select
                className="form-control"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="CREDIT_CARD">Credit Card / Debit Card</option>
                <option value="UPI">UPI / Instant Pay</option>
                <option value="NET_BANKING">Net Banking</option>
                <option value="CASH">Pay at Hotel Frontdesk</option>
              </select>
            </div>

            {paymentMethod === 'CREDIT_CARD' && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <input
                  type="text"
                  className="form-control"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Card Number"
                />
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                ${room.pricePerNight} × {diffDays} {diffDays === 1 ? 'night' : 'nights'}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                Total Due: <span style={{ color: 'var(--gold-500)' }}>${totalAmount}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Processing...' : `Confirm & Pay $${totalAmount}`}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Confirmation Voucher Modal upon successful booking */}
      {confirmedReservation && (
        <ReceiptModal
          isOpen={!!confirmedReservation}
          onClose={() => {
            setConfirmedReservation(null);
            onClose();
          }}
          reservation={confirmedReservation}
        />
      )}
    </>
  );
};

export default BookingModal;
