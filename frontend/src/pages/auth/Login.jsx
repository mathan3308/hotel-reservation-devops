import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      error('Please provide both username/email and password');
      return;
    }

    setLoading(true);
    try {
      const user = await login(username, password);
      success(`Welcome back, ${user.fullName || user.username}!`);
      if (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_STAFF') {
        navigate('/admin/dashboard');
      } else {
        navigate(from === '/login' ? '/' : from);
      }
    } catch (err) {
      error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (u, p) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1rem', maxWidth: '480px' }}>
      <div className="card card-glass card-gold-glow" style={{ padding: '2.5rem 1.75rem', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="logo-icon" style={{ margin: '0 auto 1rem', width: '54px', height: '54px', fontSize: '1.75rem' }}>👑</div>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.35rem' }}>Account Sign In</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Access your bookings and hotel logistics management
          </p>
        </div>

        {/* 1-Click Demo Accounts */}
        <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid var(--border-accent)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--gold-400)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.6rem', textAlign: 'center', letterSpacing: '0.08em' }}>
            ⚡ 1-Click Demo Accounts
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.45rem' }}>
            <button
              type="button"
              onClick={() => setDemoCredentials('mathan3308', 'Kiot@123')}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.45rem 0.2rem', minHeight: '36px' }}
              title="mathan3308 / Kiot@123"
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('staff', 'staff123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.45rem 0.2rem', minHeight: '36px' }}
              title="staff / staff123"
            >
              🧹 Staff
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('john_doe', 'customer123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.45rem 0.2rem', minHeight: '36px' }}
              title="john_doe / customer123"
            >
              🏖 Guest
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username or Email</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. mathan3308 or mathankumar3308@gmail.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? 'Authenticating...' : 'Sign In to Account →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ fontWeight: 700, color: 'var(--gold-400)' }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
