import React from 'react';

const StatusBadge = ({ status, type = 'general' }) => {
  if (!status) return null;

  let badgeClass = 'badge ';
  const cleanStatus = status.toString().toUpperCase();

  switch (cleanStatus) {
    case 'AVAILABLE':
    case 'CONFIRMED':
    case 'SUCCESS':
    case 'ROLE_CUSTOMER':
      badgeClass += 'badge-available';
      break;

    case 'BOOKED':
    case 'PENDING':
    case 'ROLE_STAFF':
      badgeClass += 'badge-booked';
      break;

    case 'MAINTENANCE':
    case 'CANCELLED':
    case 'FAILED':
    case 'ROLE_ADMIN':
      badgeClass += 'badge-maintenance';
      break;

    case 'CLEANING':
    case 'COMPLETED':
    case 'REFUNDED':
      badgeClass += 'badge-cleaning';
      break;

    case 'LOW_STOCK':
    case 'LOW STOCK':
      badgeClass += 'badge-low-stock';
      break;

    default:
      badgeClass += 'badge-available';
  }

  // Format label: remove ROLE_ prefix, replace _ with space
  const displayLabel = cleanStatus.replace('ROLE_', '').replace('_', ' ');

  return (
    <span className={badgeClass}>
      <span style={{ fontSize: '0.6rem', lineHeight: 1 }}>●</span> {displayLabel}
    </span>
  );
};

export default StatusBadge;
