import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { isAdmin } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-title">OPERATIONS</div>
      <NavLink to="/admin/dashboard" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`} end>
        <span>📊</span> Dashboard Overview
      </NavLink>
      <NavLink to="/admin/reservations" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <span>📅</span> Reservations
      </NavLink>
      <NavLink to="/admin/rooms" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <span>🚪</span> Rooms & Suites
      </NavLink>
      <NavLink to="/admin/room-types" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <span>🏷</span> Room Types & Pricing
      </NavLink>
      <NavLink to="/admin/housekeeping" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <span>🧹</span> Room Prep & Housekeeping
      </NavLink>

      <div className="sidebar-title" style={{ marginTop: '0.75rem' }}>LOGISTICS & WAREHOUSE</div>
      <NavLink to="/admin/inventory" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <span>📦</span> Inventory Catalog
      </NavLink>
      <NavLink to="/admin/stock" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <span>🔄</span> Stock Operations & Audit
      </NavLink>
      <NavLink to="/admin/warehouses" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <span>🏢</span> Warehouses
      </NavLink>
      <NavLink to="/admin/suppliers" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <span>🚚</span> Suppliers & Vendors
      </NavLink>

      <div className="sidebar-title" style={{ marginTop: '0.75rem' }}>ADMINISTRATION</div>
      <NavLink to="/admin/reports" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <span>📈</span> Reports & Analytics
      </NavLink>
      {isAdmin && (
        <NavLink to="/admin/users" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <span>👥</span> User & Roles
        </NavLink>
      )}
    </aside>
  );
};

export default Sidebar;
