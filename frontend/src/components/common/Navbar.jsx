import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatusBadge from './StatusBadge';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isStaff, logout } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    info('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link to="/" className="brand-logo">
          <div className="logo-icon">👑</div>
          <div>
            <span>GRAND LUXE</span>
            <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--gold-500)', letterSpacing: '0.15em', fontWeight: 600 }}>
              HOTEL & LOGISTICS DEVOPS
            </span>
          </div>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/rooms" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Rooms & Suites
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/my-reservations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              My Bookings
            </NavLink>
          )}

          {(isAdmin || isStaff) && (
            <NavLink to="/admin/housekeeping" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Housekeeping
            </NavLink>
          )}

          {(isAdmin || isStaff) && (
            <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ color: 'var(--gold-500)', fontWeight: 600 }}>
              ⚙ Admin Console
            </NavLink>
          )}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--gold-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', fontSize: '0.85rem' }}>
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : (user?.username ? user.username.charAt(0).toUpperCase() : 'U')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
                    {user?.fullName || user?.username || 'User'}
                  </span>
                  {user?.role && <StatusBadge status={user.role} />}
                </div>
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Sign Out">
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
