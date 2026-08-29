import React, { useState, useEffect } from 'react';
import { warehouseApi, warehouseLocationApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';

const AdminWarehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Warehouse Modal
  const [isWhModalOpen, setIsWhModalOpen] = useState(false);
  const [editingWh, setEditingWh] = useState(null);
  const [whFormData, setWhFormData] = useState({ name: '', code: '', address: '', capacityDescription: '' });

  // Location Modal
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);
  const [locFormData, setLocFormData] = useState({ warehouseId: '', code: '', description: '' });

  const { success, error } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [whRes, locRes] = await Promise.all([
        warehouseApi.getAll(),
        warehouseLocationApi.getAll(),
      ]);
      if (whRes && whRes.data) {
        setWarehouses(whRes.data);
        if (whRes.data.length > 0 && !locFormData.warehouseId) {
          setLocFormData((prev) => ({ ...prev, warehouseId: whRes.data[0].id }));
        }
      }
      if (locRes && locRes.data) setLocations(locRes.data);
    } catch (err) {
      console.error('Error loading warehouses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWhCreate = () => {
    setEditingWh(null);
    setWhFormData({ name: '', code: '', address: '', capacityDescription: '' });
    setIsWhModalOpen(true);
  };

  const handleOpenWhEdit = (wh) => {
    setEditingWh(wh);
    setWhFormData({
      name: wh.name,
      code: wh.code,
      address: wh.address || '',
      capacityDescription: wh.capacityDescription || '',
    });
    setIsWhModalOpen(true);
  };

  const handleDeleteWh = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete Warehouse '${code}'?`)) return;
    try {
      await warehouseApi.delete(id);
      success(`Warehouse ${code} deleted`);
      fetchData();
    } catch (err) {
      error(err.message || 'Failed to delete warehouse');
    }
  };

  const handleWhSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingWh) {
        await warehouseApi.update(editingWh.id, whFormData);
        success(`Warehouse ${whFormData.code} updated`);
      } else {
        await warehouseApi.create(whFormData);
        success(`Warehouse ${whFormData.code} created`);
      }
      setIsWhModalOpen(false);
      fetchData();
    } catch (err) {
      error(err.message || 'Failed to save warehouse');
    }
  };

  const handleLocSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...locFormData,
        warehouseId: Number(locFormData.warehouseId),
      };
      await warehouseLocationApi.create(payload);
      success(`Storage location ${locFormData.code} added`);
      setIsLocModalOpen(false);
      fetchData();
    } catch (err) {
      error(err.message || 'Failed to add location');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Warehouses & Storage Hubs</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage central depots, regional housekeeping pantries, and storage aisle/rack bin coordinates.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleOpenWhCreate} className="btn btn-primary">
            ➕ Add Warehouse
          </button>
          <button onClick={() => setIsLocModalOpen(true)} className="btn btn-secondary">
            📍 Add Storage Location
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gold-500)' }}>
          <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>⟳</div>
        </div>
      ) : (
        <div className="grid-2">
          {/* Warehouses Card List */}
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Facilities ({warehouses.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {warehouses.map((wh) => (
                <div key={wh.id} className="card card-glass">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>🏢</span>
                        <h4 style={{ fontSize: '1.15rem' }}>{wh.name}</h4>
                      </div>
                      <div style={{ color: 'var(--gold-500)', fontWeight: 700, fontSize: '0.85rem', marginTop: '0.25rem' }}>
                        CODE: {wh.code}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                        📍 {wh.address || 'Central Compound'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        📦 Capacity: {wh.capacityDescription || 'Standard storage'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button onClick={() => handleOpenWhEdit(wh)} className="btn btn-secondary btn-sm">
                        ✏️
                      </button>
                      <button onClick={() => handleDeleteWh(wh.id, wh.code)} className="btn btn-danger btn-sm">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Locations / Bins */}
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Aisle & Bin Locations ({locations.length})</h3>
            <div className="card card-glass">
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Bin / Code</th>
                      <th>Facility</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locations.map((loc) => (
                      <tr key={loc.id}>
                        <td style={{ fontWeight: 700, color: 'var(--gold-500)' }}>{loc.code}</td>
                        <td>{loc.warehouseName || loc.warehouseCode}</td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{loc.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warehouse Modal */}
      <Modal isOpen={isWhModalOpen} onClose={() => setIsWhModalOpen(false)} title={editingWh ? `Edit ${editingWh.code}` : 'Add Warehouse'}>
        <form onSubmit={handleWhSubmit}>
          <div className="form-group">
            <label className="form-label">Warehouse Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Main Hotel Central Warehouse"
              value={whFormData.name}
              onChange={(e) => setWhFormData({ ...whFormData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Warehouse Code</label>
            <input
              type="text"
              className="form-control"
              placeholder="WH-MAIN"
              value={whFormData.code}
              onChange={(e) => setWhFormData({ ...whFormData, code: e.target.value.toUpperCase() })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Physical Address / Building Wing</label>
            <input
              type="text"
              className="form-control"
              placeholder="Basement Hub, Logistics Wing"
              value={whFormData.address}
              onChange={(e) => setWhFormData({ ...whFormData, address: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Capacity Description</label>
            <input
              type="text"
              className="form-control"
              placeholder="5,000 sq ft climate controlled"
              value={whFormData.capacityDescription}
              onChange={(e) => setWhFormData({ ...whFormData, capacityDescription: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ padding: '1rem 0 0', borderTop: 'none' }}>
            <button type="button" onClick={() => setIsWhModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingWh ? 'Save Changes' : 'Create Warehouse'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Location Modal */}
      <Modal isOpen={isLocModalOpen} onClose={() => setIsLocModalOpen(false)} title="Add Storage Bin / Location">
        <form onSubmit={handleLocSubmit}>
          <div className="form-group">
            <label className="form-label">Target Warehouse</label>
            <select
              className="form-control"
              value={locFormData.warehouseId}
              onChange={(e) => setLocFormData({ ...locFormData, warehouseId: e.target.value })}
              required
            >
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.code})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Aisle / Shelf / Rack Code</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. A-01, RACK-03, BIN-B"
              value={locFormData.code}
              onChange={(e) => setLocFormData({ ...locFormData, code: e.target.value.toUpperCase() })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location Description</label>
            <input
              type="text"
              className="form-control"
              placeholder="Row A - Bed Linens & Towels"
              value={locFormData.description}
              onChange={(e) => setLocFormData({ ...locFormData, description: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ padding: '1rem 0 0', borderTop: 'none' }}>
            <button type="button" onClick={() => setIsLocModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Location
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminWarehouses;
