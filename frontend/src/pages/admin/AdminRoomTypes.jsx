import React, { useState, useEffect } from 'react';
import { roomTypeApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';

const AdminRoomTypes = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    defaultCapacity: 2,
    amenities: '',
    imageUrl: '',
  });

  const { success, error } = useToast();

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const res = await roomTypeApi.getAll();
      if (res && res.data) setTypes(res.data);
    } catch (err) {
      console.error('Error fetching room types:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingType(null);
    setFormData({
      name: '',
      description: '',
      basePrice: '',
      defaultCapacity: 2,
      amenities: 'Wi-Fi, Smart TV, AC, En-suite Bathroom',
      imageUrl: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (type) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      description: type.description || '',
      basePrice: type.basePrice,
      defaultCapacity: type.defaultCapacity,
      amenities: type.amenities || '',
      imageUrl: type.imageUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete Room Type '${name}'?`)) return;
    try {
      await roomTypeApi.delete(id);
      success(`Room Type '${name}' deleted successfully`);
      fetchTypes();
    } catch (err) {
      error(err.message || 'Failed to delete room type');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        basePrice: Number(formData.basePrice),
        defaultCapacity: Number(formData.defaultCapacity),
      };

      if (editingType) {
        await roomTypeApi.update(editingType.id, payload);
        success(`Room Type '${formData.name}' updated`);
      } else {
        await roomTypeApi.create(payload);
        success(`Room Type '${formData.name}' created`);
      }
      setIsModalOpen(false);
      fetchTypes();
    } catch (err) {
      error(err.message || 'Failed to save room type');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Room Types & Tiers</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Define luxury accommodation categories, default capacities, base pricing models, and guest amenities.
          </p>
        </div>
        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          ➕ Create Room Type
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gold-500)' }}>
          <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>⟳</div>
        </div>
      ) : (
        <div className="grid-3">
          {types.map((type) => (
            <div key={type.id} className="card card-glass" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.25rem' }}>{type.name}</h3>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--gold-500)' }}>
                    ${Number(type.basePrice).toFixed(2)}
                  </div>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', minHeight: '40px' }}>
                  {type.description}
                </p>

                <div style={{ background: 'var(--bg-elevated)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  <div>👥 Default Capacity: {type.defaultCapacity} Guests</div>
                  <div style={{ marginTop: '0.25rem' }}>✨ Amenities: {type.amenities}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <button onClick={() => handleOpenEditModal(type)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(type.id, type.name)} className="btn btn-danger btn-sm">
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingType ? `Edit ${editingType.name}` : 'Create Room Type'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Type Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Deluxe Suite, Presidential Penthouse"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Base Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="1"
                className="form-control"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Default Capacity (Guests)</label>
              <input
                type="number"
                min="1"
                max="12"
                className="form-control"
                value={formData.defaultCapacity}
                onChange={(e) => setFormData({ ...formData, defaultCapacity: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Amenities List (Comma-separated)</label>
            <input
              type="text"
              className="form-control"
              placeholder="High-speed Wi-Fi, King Bed, Jacuzzi, Balcony"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Image URL (Optional)</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Detailed description of room type..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="modal-footer" style={{ padding: '1rem 0 0', borderTop: 'none' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingType ? 'Save Changes' : 'Create Room Type'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminRoomTypes;
