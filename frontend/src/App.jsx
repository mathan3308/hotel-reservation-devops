import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Common Components
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Customer Pages
import Home from './pages/customer/Home';
import Rooms from './pages/customer/Rooms';
import MyReservations from './pages/customer/MyReservations';
import Profile from './pages/customer/Profile';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRooms from './pages/admin/AdminRooms';
import AdminRoomTypes from './pages/admin/AdminRoomTypes';
import AdminReservations from './pages/admin/AdminReservations';
import AdminInventory from './pages/admin/AdminInventory';
import AdminStock from './pages/admin/AdminStock';
import AdminHousekeeping from './pages/admin/AdminHousekeeping';
import AdminWarehouses from './pages/admin/AdminWarehouses';
import AdminSuppliers from './pages/admin/AdminSuppliers';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReports from './pages/admin/AdminReports';

// Admin Layout with Sidebar
const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

// Main Customer Layout
const CustomerLayout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="brand-logo" style={{ marginBottom: '0.75rem' }}>
                <div className="logo-icon">👑</div>
                <span>GRAND LUXE</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px' }}>
                Cloud-Based Inventory and Warehouse Management with CI/CD Container-Oriented Deployment of a Hotel Reservation System.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--gold-500)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                Explore
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                <a href="/rooms">Rooms & Suites</a>
                <a href="/my-reservations">My Reservations</a>
                <a href="/login">Account Login</a>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--gold-500)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                Technology
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>Spring Boot 3.3.4 (Java 21)</span>
                <span>React 18 + Vite SPA</span>
                <span>Docker & Kubernetes</span>
                <span>GitHub Actions CI/CD</span>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--gold-500)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                DevOps Health
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                <a href="http://localhost:8080/actuator/health" target="_blank" rel="noreferrer">
                  Actuator Health Probe ↗
                </a>
                <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer">
                  OpenAPI / Swagger UI ↗
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Grand Luxe Resort Management Platform. All rights reserved.</span>
            <span>Cloud Container-Oriented Deployment Specification</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Customer Facing Web Pages */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/my-reservations"
                element={
                  <ProtectedRoute>
                    <MyReservations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Admin & Staff Portal */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_STAFF']}>
                  <div className="app-container">
                    <Navbar />
                    <AdminLayout />
                  </div>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="rooms" element={<AdminRooms />} />
              <Route path="room-types" element={<AdminRoomTypes />} />
              <Route path="reservations" element={<AdminReservations />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="stock" element={<AdminStock />} />
              <Route path="housekeeping" element={<AdminHousekeeping />} />
              <Route path="warehouses" element={<AdminWarehouses />} />
              <Route path="locations" element={<AdminWarehouses />} />
              <Route path="suppliers" element={<AdminSuppliers />} />
              <Route path="reports" element={<AdminReports />} />
              <Route
                path="users"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
