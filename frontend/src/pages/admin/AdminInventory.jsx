import React, { useState, useEffect } from 'react';
import { inventoryApi, categoryApi, warehouseApi, warehouseLocationApi, supplierApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';

const AdminInventory = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: '',
    quantity: 50,
    minStockLevel: 20,
    unit: 'Pieces',
    unitPrice: 10.0,
    warehouseId: '',
    locationId: '',
    supplierId: '',
  });

  const { success, error } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, catRes, whRes, locRes, supRes] = await Promise.all([
        inventoryApi.getAll(),
        categoryApi.getAll(),
        warehouseApi.getAll(),
        warehouseLocationApi.getAll(),
        supplierApi.getAll(),
      ]);

      if (itemsRes && itemsRes.data) setItems(itemsRes.data);
      if (catRes && catRes.data) {
        setCategories(catRes.data);
        if (catRes.data.length > 0 && !formData.categoryId) {
          setFormData((prev) => ({ ...prev, categoryId: catRes.data[0].id }));
        }
      }
      if (whRes && whRes.data) {
        setWarehouses(whRes.data);
        if (whRes.data.length > 0 && !formData.warehouseId) {
          setFormData((prev) => ({ ...prev, warehouseId: whRes.data[0].id }));
        }
      }
      if (locRes && locRes.data) setLocations(locRes.data);
      if (supRes && supRes.data) setSuppliers(supRes.data);
    } catch (err) {
      console.error('Error fetching inventory catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      sku: '',
      categoryId: categories[0]?.id || '',
      quantity: 50,
      minStockLevel: 20,
      unit: 'Pieces',
      unitPrice: 10.0,
      warehouseId: warehouses[0]?.id || '',
      locationId: locations[0]?.id || '',
      supplierId: suppliers[0]?.id || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      sku: item.sku,
      categoryId: item.category?.id || '',
      quantity: item.quantity,
      minStockLevel: item.minStockLevel,
      unit: item.unit,
      unitPrice: item.unitPrice || 0,
      warehouseId: item.warehouse?.id || '',
      locationId: item.location?.id || '',
      supplierId: item.supplier?.id || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to deactivate item '${name}'?`)) return;
    try {
      await inventoryApi.delete(id);
      success(`Item '${name}' deactivated successfully`);
      fetchData();
    } catch (err) {
      error(err.message || 'Failed to delete item');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        categoryId: Number(formData.categoryId),
        warehouseId: Number(formData.warehouseId),
        locationId: formData.locationId ? Number(formData.locationId) : null,
        supplierId: formData.supplierId ? Number(formData.supplierId) : null,
        quantity: Number(formData.quantity),
        minStockLevel: Number(formData.minStockLevel),
        unitPrice: Number(formData.unitPrice),
      };

      if (editingItem) {
        await inventoryApi.update(editingItem.id, payload);
        success(`Item '${formData.name}' updated`);
      } else {
        await inventoryApi.create(payload);
        success(`Item '${formData.name}' created`);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      error(err.message || 'Failed to save inventory item');
    }
  };

  const filtered = items.filter((item) => {
    if (filterLowStockOnly && !item.isLowStock) return false;
    if (selectedCategory && item.category?.id !== Number(selectedCategory)) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const nameMatch = item.name.toLowerCase().includes(term);
      const skuMatch = item.sku.toLowerCase().includes(term);
      return nameMatch || skuMatch;
    }
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Inventory Catalog</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Track hospitality supplies, monitors low-stock alert thresholds, manage SKUs, and warehouse storage bins.
          </p>
        </div>
        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          ➕ Add Inventory Item
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card card-glass" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search item name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="form-control"
          style={{ width: 'auto' }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
          className={`btn btn-sm ${filterLowStockOnly ? 'btn-danger' : 'btn-secondary'}`}
        >
          ⚠️ {filterLowStockOnly ? 'Showing Low Stock Only' : 'Show Low Stock Only'}
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
                  <th>SKU</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Stock Quantity</th>
                  <th>Min Threshold</th>
                  <th>Stock Status</th>
                  <th>Warehouse / Bin</th>
                  <th>Supplier</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      No inventory items found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 700, color: 'var(--gold-500)', fontSize: '0.85rem' }}>
                        {item.sku}
                      </td>
                      <td style={{ fontWeight: 600 }}>{item.name}</td>
                      <td>{item.category?.name}</td>
                      <td style={{ fontWeight: 800, fontSize: '1.05rem', color: item.isLowStock ? 'var(--danger)' : '#fff' }}>
                        {item.quantity} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>{item.unit}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>
                        {item.minStockLevel} {item.unit}
                      </td>
                      <td>
                        {item.isLowStock ? (
                          <StatusBadge status="LOW_STOCK" />
                        ) : (
                          <StatusBadge status="AVAILABLE" />
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>{item.warehouse?.name || 'Main Warehouse'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Location: {item.location?.code || 'General'}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {item.supplier?.name || 'In-House'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => handleOpenEditModal(item)} className="btn btn-secondary btn-sm" title="Edit">
                            ✏️
                          </button>
                          <button onClick={() => handleDelete(item.id, item.name)} className="btn btn-danger btn-sm" title="Delete">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Item Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? `Edit ${editingItem.name}` : 'Add Inventory Item'}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Item Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Egyptian Cotton Bath Towels"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">SKU</label>
              <input
                type="text"
                className="form-control"
                placeholder="LIN-TWL-001"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Unit of Measure</label>
              <input
                type="text"
                className="form-control"
                placeholder="Pieces, Bottles, Sets, Packs"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Current Quantity</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Min Stock Level</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={formData.minStockLevel}
                onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Unit Cost ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Primary Warehouse</label>
              <select
                className="form-control"
                value={formData.warehouseId}
                onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
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
              <label className="form-label">Rack / Bin Location (Optional)</label>
              <select
                className="form-control"
                value={formData.locationId}
                onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
              >
                <option value="">None / General Staging</option>
                {locations
                  .filter((l) => !formData.warehouseId || l.warehouseId === Number(formData.warehouseId))
                  .map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.code} - {l.description}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Supplier / Vendor</label>
            <select
              className="form-control"
              value={formData.supplierId}
              onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
            >
              <option value="">None / In-House</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.contactPerson})
                </option>
              ))}
            </select>
          </div>

          <div className="modal-footer" style={{ padding: '1rem 0 0', borderTop: 'none' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingItem ? 'Save Changes' : 'Create Item'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminInventory;
