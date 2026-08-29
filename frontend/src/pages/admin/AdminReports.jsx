import React, { useState, useEffect } from 'react';
import { dashboardApi, inventoryApi, reservationApi, paymentApi } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [statsRes, itemsRes, payRes] = await Promise.all([
        dashboardApi.getStats(),
        inventoryApi.getAll(),
        paymentApi.getAll(),
      ]);

      if (statsRes && statsRes.data) setStats(statsRes.data);
      if (itemsRes && itemsRes.data) setItems(itemsRes.data);
      if (payRes && payRes.data) setPayments(payRes.data);
    } catch (err) {
      console.error('Error loading report analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate inventory valuation
  const inventoryTotalValuation = items.reduce((acc, item) => {
    const cost = item.unitPrice ? Number(item.unitPrice) * item.quantity : 0;
    return acc + cost;
  }, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Reports & Strategic Analytics</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Financial revenue audit, room utilization statistics, inventory asset valuation, and printable management reports.
          </p>
        </div>
        <button onClick={handlePrint} className="btn btn-primary">
          🖨 Export / Print Report
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gold-500)' }}>
          <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>⟳</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Executive KPI Summary */}
          <div className="grid-4">
            <StatCard
              title="Gross Booking Revenue"
              value={`$${Number(stats?.totalRevenue || 0).toFixed(2)}`}
              subtitle="All settled reservations"
              icon="💵"
              color="green"
            />
            <StatCard
              title="Inventory Asset Value"
              value={`$${inventoryTotalValuation.toFixed(2)}`}
              subtitle={`${items.length} Tracked catalog lines`}
              icon="🏢"
              color="gold"
            />
            <StatCard
              title="Room Utilization"
              value={`${stats?.totalRooms > 0 ? Math.round((stats.bookedRooms / stats.totalRooms) * 100) : 0}%`}
              subtitle={`${stats?.bookedRooms} Occupied of ${stats?.totalRooms} Rooms`}
              icon="📈"
              color="blue"
            />
            <StatCard
              title="Restock Requirement"
              value={stats?.lowStockItemsCount || 0}
              subtitle="Lines at/below threshold"
              icon="⚠️"
              color={stats?.lowStockItemsCount > 0 ? 'red' : 'green'}
            />
          </div>

          {/* Operational Breakdown Sections */}
          <div className="grid-2">
            {/* Room Breakdown Card */}
            <div className="card card-glass">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Room Inventory Status Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span>🟢 Available for Guest Booking</span>
                  <strong>{stats?.availableRooms} Rooms</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span>🟡 Currently Booked / Occupied</span>
                  <strong>{stats?.bookedRooms} Rooms</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span>🔵 Housekeeping Turn-down (Cleaning)</span>
                  <strong>{stats?.cleaningRooms} Rooms</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0' }}>
                  <span>🔴 Scheduled Maintenance (HVAC/Civil)</span>
                  <strong>{stats?.maintenanceRooms} Rooms</strong>
                </div>
              </div>
            </div>

            {/* Reservation Status Breakdown */}
            <div className="card card-glass">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Reservation Volumes & Conversion</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span>Total Reservations Recorded</span>
                  <strong>{stats?.totalReservations}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span>Confirmed & Active Bookings</span>
                  <strong style={{ color: 'var(--success)' }}>{stats?.confirmedReservations}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span>Completed Stays</span>
                  <strong>{stats?.completedReservations}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0' }}>
                  <span>Cancelled Reservations</span>
                  <strong style={{ color: 'var(--danger)' }}>{stats?.cancelledReservations}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Transactions Log */}
          <div className="card card-glass">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Settled Payment Transactions Ledger</h3>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Txn Reference</th>
                    <th>Booking Ref</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No settled transactions found.
                      </td>
                    </tr>
                  ) : (
                    payments.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 700, color: 'var(--gold-500)' }}>{p.transactionReference}</td>
                        <td>{p.reservationReference}</td>
                        <td style={{ fontWeight: 700 }}>${Number(p.amount).toFixed(2)}</td>
                        <td>{p.paymentMethod}</td>
                        <td>
                          <StatusBadge status={p.paymentStatus} />
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {new Date(p.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
