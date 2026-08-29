import React from 'react';

const StatCard = ({ title, value, subtitle, icon, trend, color = 'gold' }) => {
  let borderHighlight = 'var(--border-subtle)';
  if (color === 'gold') borderHighlight = 'rgba(217, 119, 6, 0.3)';
  if (color === 'red') borderHighlight = 'rgba(239, 68, 68, 0.4)';
  if (color === 'green') borderHighlight = 'rgba(16, 185, 129, 0.3)';
  if (color === 'blue') borderHighlight = 'rgba(59, 130, 246, 0.3)';

  return (
    <div
      className="card card-glass"
      style={{
        borderLeft: `4px solid ${
          color === 'gold'
            ? 'var(--gold-500)'
            : color === 'red'
            ? 'var(--danger)'
            : color === 'green'
            ? 'var(--success)'
            : 'var(--info)'
        }`,
        borderColor: borderHighlight,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        {icon && (
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-elevated)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#ffffff', marginBottom: '0.25rem' }}>
        {value}
      </div>

      {subtitle && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {trend && <span style={{ color: trend.startsWith('+') ? 'var(--success)' : 'var(--danger)' }}>{trend}</span>}
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
