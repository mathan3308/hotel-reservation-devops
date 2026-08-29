import React, { useState, useEffect } from 'react';
import { supplierApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';

const AdminSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
  });

  const { success, error } = useToast();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await supplierApi.getAll();
      if (res && res.data) setSuppliers(res.data);
    } catch (err) {
      console.error('Error loading suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingSupplier(null);
    setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setEditingSupplier(s);
    setFormData({
      name: s.name,
      contactPerson: s.contactPerson || '',
      email: s.email || '',
      phone: s.phone || '',
      address: s.address || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete supplier '${name}'?`)) return;
    try {
      await supplierApi.delete(id);
      success(`Supplier '${name}' deleted`);
      fetchSuppliers();
    } catch (err) {
      error(err.message || 'Failed to delete supplier');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await supplierApi.update(editingSupplier.id, formData);
        success(`Supplier '${formData.name}' updated`);
      } else {
        await supplierApi.create(formData);
        success(`Supplier '${formData.name}' created`);
      }
      setIsModalOpen(false);
      fetchSuppliers();
    } catch (err) {
      error(err.message || 'Failed to save supplier');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Suppliers & Vendors</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Maintain vendor directories for hotel textiles, organic toiletries, industrial cleaners, and beverage consignments.
          </p>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary">
          ➕ Add Supplier
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gold-500)' }}>
          <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>⟳</div>
        </div>
      ) : (
        <div className="grid-3">
          {suppliers.map((s) => (
            <div key={s.id} className="card card-glass" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>🚚</span>
                  <h3 style={{ fontSize: '1.2rem' }}>{s.name}</h3>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gold-500)', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Contact: {s.contactPerson || 'General Dispatch'}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  📧 {s.email || 'N/A'}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  📞 {s.phone || 'N/A'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  📍 {s.address || 'Address on file'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '1rem' }}>
                <button onClick={() => handleOpenEdit(s)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(s.id, s.name)} className="btn btn-danger btn-sm">
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSupplier ? `Edit ${editingSupplier.name}` : 'Add Supplier'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Company / Vendor Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Royal Textile Mills"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Person</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Margaret Sterling"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="orders@vendor.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+1-800-444-1234"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="Vendor distribution facility address..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            ></textarea>
          </div>

          <div className="modal-footer" style={{ padding: '1rem 0 0', borderTop: 'none' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingSupplier ? 'Save Changes' : 'Add Supplier'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminSuppliers;
