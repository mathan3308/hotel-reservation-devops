import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatusBadge from './StatusBadge';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isStaff, logout } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    info('Logged out successfully');
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={closeMobileMenu}>
          <div className="logo-icon">👑</div>
          <div>
            <span style={{ fontWeight: 800, letterSpacing: '0.04em' }}>GRAND LUXE</span>
            <span style={{ fontSize: '0.625rem', display: 'block', color: 'var(--gold-400)', letterSpacing: '0.14em', fontWeight: 700 }}>
              HOTEL & LOGISTICS PLATFORM
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links-desktop">
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
            <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ color: 'var(--gold-400)', fontWeight: 700 }}>
              ⚙ Admin Console
            </NavLink>
          )}
        </nav>

        {/* Desktop User / Auth Actions */}
        <div className="nav-actions-desktop">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gold-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#060913', fontSize: '0.9rem', boxShadow: 'var(--gold-glow)' }}>
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : (user?.username ? user.username.charAt(0).toUpperCase() : 'U')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.2 }}>
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

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`mobile-drawer-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Slide-in Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-drawer-header">
          <Link to="/" className="brand-logo" onClick={closeMobileMenu}>
            <div className="logo-icon" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>👑</div>
            <span style={{ fontSize: '1.05rem' }}>GRAND LUXE</span>
          </Link>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={closeMobileMenu}
            style={{ minHeight: '32px', padding: '0.2rem 0.6rem' }}
          >
            ✕
          </button>
        </div>

        {/* User Info Pill in Drawer (if logged in) */}
        {isAuthenticated && (
          <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid var(--border-accent)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <Link to="/profile" onClick={closeMobileMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--gold-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#060913', fontSize: '0.95rem' }}>
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : (user?.username ? user.username.charAt(0).toUpperCase() : 'U')}
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                  {user?.fullName || user?.username}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gold-400)' }}>
                  {user?.email || 'Logged In'}
                </div>
              </div>
            </Link>
          </div>
        )}

        <nav className="mobile-drawer-links">
          <NavLink to="/" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu} end>
            🏨 Home
          </NavLink>
          <NavLink to="/rooms" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
            🛋 Rooms & Suites
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/my-reservations" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
              📅 My Bookings
            </NavLink>
          )}

          {(isAdmin || isStaff) && (
            <NavLink to="/admin/housekeeping" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
              🧹 Housekeeping
            </NavLink>
          )}

          {(isAdmin || isStaff) && (
            <NavLink to="/admin/dashboard" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu} style={{ color: 'var(--gold-400)', fontWeight: 700 }}>
              ⚙ Admin Console
            </NavLink>
          )}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%' }}>
              🚪 Log Out
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary" onClick={closeMobileMenu} style={{ width: '100%' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={closeMobileMenu} style={{ width: '100%' }}>
                Register Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
