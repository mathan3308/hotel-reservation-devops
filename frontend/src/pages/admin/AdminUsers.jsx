import React, { useState, useEffect } from 'react';
import { userApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('ROLE_CUSTOMER');

  const { success, error } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getAll();
      if (res && res.data) setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setSelectedRole(user.role);
    setIsModalOpen(true);
  };

  const handleRoleUpdate = async (e) => {
    e.preventDefault();
    try {
      await userApi.update(editingUser.id, { role: selectedRole });
      success(`User '${editingUser.username}' role updated to ${selectedRole.replace('ROLE_', '')}`);
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      error(err.message || 'Failed to update user role');
    }
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Delete user '${username}'?`)) return;
    try {
      await userApi.delete(id);
      success(`User '${username}' deleted`);
      fetchUsers();
    } catch (err) {
      error(err.message || 'Failed to delete user');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>User & Role Administration</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage staff operational permissions, administrator access control, and customer accounts.
          </p>
        </div>
        <button onClick={fetchUsers} className="btn btn-secondary btn-sm">
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gold-500)' }}>
          <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>⟳</div>
        </div>
      ) : (
        <div className="card card-glass">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Member Since</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{u.fullName || u.username}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{u.username}</div>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.phone || 'N/A'}</td>
                    <td>
                      <StatusBadge status={u.role} />
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => handleOpenEdit(u)} className="btn btn-secondary btn-sm" title="Edit Role">
                          ⚙️ Role
                        </button>
                        <button onClick={() => handleDelete(u.id, u.username)} className="btn btn-danger btn-sm" title="Delete">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Role Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Change Role: ${editingUser?.username}`}>
        <form onSubmit={handleRoleUpdate}>
          <div className="form-group">
            <label className="form-label">Assign System Role</label>
            <select
              className="form-control"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="ROLE_CUSTOMER">CUSTOMER (Can make & manage own reservations)</option>
              <option value="ROLE_STAFF">STAFF (Access to Housekeeping, Inventory, & Bookings)</option>
              <option value="ROLE_ADMIN">ADMIN (Full unrestricted system control & User Admin)</option>
            </select>
          </div>

          <div className="modal-footer" style={{ padding: '1rem 0 0', borderTop: 'none' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Role
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUsers;
