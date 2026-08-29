import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const res = await dashboardApi.getStats();
      if (res && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gold-500)' }}>
        <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>⟳</div>
        <div style={{ marginTop: '1rem' }}>Loading operations intelligence...</div>
      </div>
    );
  }

  const occupancyRate = stats?.totalRooms > 0
    ? Math.round((stats.bookedRooms / stats.totalRooms) * 100)
    : 0;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Operations & Logistics Hub</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Real-time hotel metrics, live room occupancy, warehouse inventory levels, and transaction auditing.
          </p>
        </div>
        <button onClick={fetchDashboardStats} className="btn btn-secondary btn-sm">
          🔄 Refresh Metrics
        </button>
      </div>

      {/* Low Stock Warning Banner if items are low stock */}
      {stats?.lowStockItemsCount > 0 && (
        <div className="alert alert-warning" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
            <div>
              <strong>Low Stock Alert Detected:</strong> {stats.lowStockItemsCount} items are at or below minimum threshold.
            </div>
          </div>
          <Link to="/admin/inventory" className="btn btn-primary btn-sm">
            Restock Items Now →
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Total Rooms"
          value={stats?.totalRooms || 0}
          subtitle={`${stats?.availableRooms || 0} Available • ${stats?.bookedRooms || 0} Booked`}
          icon="🏨"
          color="gold"
        />

        <StatCard
          title="Room Occupancy"
          value={`${occupancyRate}%`}
          subtitle={`${stats?.cleaningRooms || 0} Cleaning • ${stats?.maintenanceRooms || 0} Maintenance`}
          icon="📊"
          trend={`${occupancyRate}% rate`}
          color={occupancyRate > 70 ? 'green' : 'blue'}
        />

        <StatCard
          title="Inventory Items"
          value={stats?.totalInventoryItems || 0}
          subtitle={`${stats?.lowStockItemsCount || 0} Low Stock • ${stats?.totalWarehouses || 0} Warehouses`}
          icon="📦"
          color={stats?.lowStockItemsCount > 0 ? 'red' : 'green'}
        />

        <StatCard
          title="Total Revenue"
          value={`$${Number(stats?.totalRevenue || 0).toFixed(2)}`}
          subtitle={`${stats?.confirmedReservations || 0} Confirmed Bookings`}
          icon="💰"
          color="green"
        />
      </div>

      {/* Quick Action Navigation */}
      <div className="card card-glass" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          ⚡ QUICK DISPATCH ACTIONS
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Link to="/admin/housekeeping" className="btn btn-primary btn-sm">
            🧹 Dispatch Room Prep Kit
          </Link>
          <Link to="/admin/stock" className="btn btn-secondary btn-sm">
            📥 Stock In Delivery
          </Link>
          <Link to="/admin/stock" className="btn btn-secondary btn-sm">
            📤 Stock Out Usage
          </Link>
          <Link to="/admin/rooms" className="btn btn-secondary btn-sm">
            ➕ Add / Manage Rooms
          </Link>
          <Link to="/admin/inventory" className="btn btn-secondary btn-sm">
            📦 Manage Catalog
          </Link>
        </div>
      </div>

      {/* Tables Row: Recent Bookings & Recent Stock Activity */}
      <div className="grid-2">
        {/* Recent Reservations */}
        <div className="card card-glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Recent Reservations</h3>
            <Link to="/admin/reservations" style={{ fontSize: '0.85rem' }}>
              View All →
            </Link>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Room</th>
                  <th>Guest</th>
                  <th>Dates</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentReservations?.length > 0 ? (
                  stats.recentReservations.map((res) => (
                    <tr key={res.id}>
                      <td style={{ fontWeight: 700, color: 'var(--gold-500)', fontSize: '0.85rem' }}>
                        {res.reservationReference}
                      </td>
                      <td>Room {res.room?.roomNumber}</td>
                      <td>{res.user?.fullName || res.user?.username}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {res.checkInDate}
                      </td>
                      <td>
                        <StatusBadge status={res.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      No recent reservations recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Stock Movement */}
        <div className="card card-glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Recent Inventory Movements</h3>
            <Link to="/admin/stock" style={{ fontSize: '0.85rem' }}>
              View Audit Log →
            </Link>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Type</th>
                  <th>Balance</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentTransactions?.length > 0 ? (
                  stats.recentTransactions.slice(0, 5).map((st) => (
                    <tr key={st.id}>
                      <td style={{ fontWeight: 600 }}>{st.itemName}</td>
                      <td style={{ fontWeight: 700, color: st.transactionType === 'STOCK_IN' ? 'var(--success)' : 'var(--danger)' }}>
                        {st.transactionType === 'STOCK_IN' ? `+${st.quantity}` : `-${st.quantity}`}
                      </td>
                      <td>
                        <StatusBadge status={st.transactionType} />
                      </td>
                      <td style={{ fontWeight: 600 }}>{st.balanceAfter}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {st.reason}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      No stock transactions recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
