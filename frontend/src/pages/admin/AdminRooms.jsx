import React, { useState, useEffect } from 'react';
import { roomApi, roomTypeApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [formData, setFormData] = useState({
    roomNumber: '',
    roomTypeId: '',
    pricePerNight: '',
    capacity: 2,
    status: 'AVAILABLE',
    floor: '1st Floor',
    description: '',
  });

  const { success, error } = useToast();

  useEffect(() => {
    fetchRoomsAndTypes();
  }, []);

  const fetchRoomsAndTypes = async () => {
    setLoading(true);
    try {
      const [roomsRes, typesRes] = await Promise.all([
        roomApi.getAll(),
        roomTypeApi.getAll(),
      ]);
      if (roomsRes && roomsRes.data) setRooms(roomsRes.data);
      if (typesRes && typesRes.data) {
        setRoomTypes(typesRes.data);
        if (typesRes.data.length > 0 && !formData.roomTypeId) {
          setFormData((prev) => ({ ...prev, roomTypeId: typesRes.data[0].id }));
        }
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingRoom(null);
    setFormData({
      roomNumber: '',
      roomTypeId: roomTypes[0]?.id || '',
      pricePerNight: roomTypes[0]?.basePrice || 100,
      capacity: 2,
      status: 'AVAILABLE',
      floor: '1st Floor',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      roomTypeId: room.roomType?.id,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      status: room.status,
      floor: room.floor || '1st Floor',
      description: room.description || '',
    });
    setIsModalOpen(true);
  };

  const handleStatusQuickChange = async (roomId, newStatus) => {
    try {
      await roomApi.updateStatus(roomId, newStatus);
      success(`Room status updated to ${newStatus}`);
      fetchRoomsAndTypes();
    } catch (err) {
      error(err.message || 'Failed to update status');
    }
  };

  const handleDeleteRoom = async (id, roomNumber) => {
    if (!window.confirm(`Are you sure you want to delete Room ${roomNumber}?`)) return;
    try {
      await roomApi.delete(id);
      success(`Room ${roomNumber} deleted successfully`);
      fetchRoomsAndTypes();
    } catch (err) {
      error(err.message || 'Failed to delete room');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        roomTypeId: Number(formData.roomTypeId),
        pricePerNight: Number(formData.pricePerNight),
        capacity: Number(formData.capacity),
      };

      if (editingRoom) {
        await roomApi.update(editingRoom.id, payload);
        success(`Room ${formData.roomNumber} updated successfully`);
      } else {
        await roomApi.create(payload);
        success(`Room ${formData.roomNumber} created successfully`);
      }
      setIsModalOpen(false);
      fetchRoomsAndTypes();
    } catch (err) {
      error(err.message || 'Failed to save room details');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Room Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Configure hotel rooms, assign room types, update prices, and control operational cleaning/maintenance states.
          </p>
        </div>
        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          ➕ Add New Room
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gold-500)' }}>
          <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>⟳</div>
          <div style={{ marginTop: '1rem' }}>Loading rooms catalog...</div>
        </div>
      ) : (
        <div className="card card-glass">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Room #</th>
                  <th>Tier & Type</th>
                  <th>Floor</th>
                  <th>Capacity</th>
                  <th>Price / Night</th>
                  <th>Operational Status</th>
                  <th>Quick Action</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>
                      {room.roomNumber}
                    </td>
                    <td style={{ color: 'var(--gold-500)', fontWeight: 600 }}>
                      {room.roomType?.name}
                    </td>
                    <td>{room.floor || '1st'}</td>
                    <td>{room.capacity} Guests</td>
                    <td style={{ fontWeight: 700 }}>${Number(room.pricePerNight).toFixed(2)}</td>
                    <td>
                      <StatusBadge status={room.status} />
                    </td>
                    <td>
                      <select
                        className="form-control"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                        value={room.status}
                        onChange={(e) => handleStatusQuickChange(room.id, e.target.value)}
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="BOOKED">BOOKED</option>
                        <option value="CLEANING">CLEANING</option>
                        <option value="MAINTENANCE">MAINTENANCE</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => handleOpenEditModal(room)} className="btn btn-secondary btn-sm" title="Edit">
                          ✏️
                        </button>
                        <button onClick={() => handleDeleteRoom(room.id, room.roomNumber)} className="btn btn-danger btn-sm" title="Delete">
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

      {/* Create / Edit Room Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRoom ? `Edit Room ${editingRoom.roomNumber}` : 'Add New Room'}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Room Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 101, 205, 302"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Floor</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 1st Floor, Penthouse"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Room Type</label>
              <select
                className="form-control"
                value={formData.roomTypeId}
                onChange={(e) => {
                  const typeId = e.target.value;
                  const selectedType = roomTypes.find((t) => t.id === Number(typeId));
                  setFormData({
                    ...formData,
                    roomTypeId: typeId,
                    pricePerNight: selectedType ? selectedType.basePrice : formData.pricePerNight,
                  });
                }}
                required
              >
                {roomTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (Base: ${t.basePrice})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price per Night ($)</label>
              <input
                type="number"
                step="0.01"
                min="1"
                className="form-control"
                value={formData.pricePerNight}
                onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Capacity (Max Guests)</label>
              <input
                type="number"
                min="1"
                max="10"
                className="form-control"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Operational Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="BOOKED">BOOKED</option>
                <option value="CLEANING">CLEANING</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Room Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="e.g. Spacious corner room with interior courtyard view..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="modal-footer" style={{ padding: '1rem 0 0', borderTop: 'none' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingRoom ? 'Save Changes' : 'Create Room'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminRooms;
