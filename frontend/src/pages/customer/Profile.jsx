import React from 'react';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem', maxWidth: '700px' }}>
      <div className="card card-glass">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'var(--gold-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#ffffff',
            }}
          >
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{user.fullName || user.username}</h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              @{user.username} • {user.email}
            </div>
            <StatusBadge status={user.role} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Username</div>
            <div style={{ fontWeight: 600, color: '#ffffff', marginTop: '0.25rem' }}>{user.username}</div>
          </div>

          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Address</div>
            <div style={{ fontWeight: 600, color: '#ffffff', marginTop: '0.25rem' }}>{user.email}</div>
          </div>

          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Phone Contact</div>
            <div style={{ fontWeight: 600, color: '#ffffff', marginTop: '0.25rem' }}>{user.phone || 'Not provided'}</div>
          </div>

          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Account Role</div>
            <div style={{ fontWeight: 600, color: '#ffffff', marginTop: '0.25rem' }}>
              {user.role?.replace('ROLE_', '')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
