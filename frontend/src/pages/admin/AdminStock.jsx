import React, { useState, useEffect } from 'react';
import { stockApi, inventoryApi, warehouseApi, warehouseLocationApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';

const AdminStock = () => {
  const [transactions, setTransactions] = useState([]);
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [activeModal, setActiveModal] = useState(null); // 'IN', 'OUT', 'TRANSFER', 'ADJUST'
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState(10);
  const [reason, setReason] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [destWarehouseId, setDestWarehouseId] = useState('');
  const [destLocationId, setDestLocationId] = useState('');

  const { success, error } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [txRes, itemsRes, whRes, locRes] = await Promise.all([
        stockApi.getTransactions(),
        inventoryApi.getAll(),
        warehouseApi.getAll(),
        warehouseLocationApi.getAll(),
      ]);

      if (txRes && txRes.data) setTransactions(txRes.data);
      if (itemsRes && itemsRes.data) {
        setItems(itemsRes.data);
        if (itemsRes.data.length > 0 && !selectedItemId) {
          setSelectedItemId(itemsRes.data[0].id);
        }
      }
      if (whRes && whRes.data) {
        setWarehouses(whRes.data);
        if (whRes.data.length > 0 && !destWarehouseId) {
          setDestWarehouseId(whRes.data[0].id);
        }
      }
      if (locRes && locRes.data) setLocations(locRes.data);
    } catch (err) {
      console.error('Error loading stock operations:', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type) => {
    setActiveModal(type);
    setQuantity(10);
    setReason('');
    setReferenceId('');
    if (items.length > 0 && !selectedItemId) setSelectedItemId(items[0].id);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeModal === 'IN') {
        await stockApi.stockIn({
          itemId: Number(selectedItemId),
          quantity: Number(quantity),
          reason: reason || 'Restock delivery',
          referenceId: referenceId || `PO-${Date.now().toString().slice(-4)}`,
        });
        success('Stock replenishment recorded successfully');
      } else if (activeModal === 'OUT') {
        await stockApi.stockOut({
          itemId: Number(selectedItemId),
          quantity: Number(quantity),
          reason: reason || 'Floor consumption',
          referenceId: referenceId || `ISSUE-${Date.now().toString().slice(-4)}`,
        });
        success('Stock issuance recorded successfully');
      } else if (activeModal === 'TRANSFER') {
        await stockApi.transfer({
          itemId: Number(selectedItemId),
          quantity: Number(quantity),
          destWarehouseId: Number(destWarehouseId),
          destLocationId: destLocationId ? Number(destLocationId) : null,
          reason: reason || 'Warehouse relocation',
        });
        success('Stock transferred between warehouses successfully');
      } else if (activeModal === 'ADJUST') {
        await stockApi.adjustment({
          itemId: Number(selectedItemId),
          newQuantity: Number(quantity),
          reason: reason || 'Physical inventory audit',
        });
        success('Stock audit adjustment recorded successfully');
      }

      closeModal();
      fetchData();
    } catch (err) {
      error(err.message || 'Failed to execute stock operation');
    }
  };

  const selectedItemObj = items.find((i) => i.id === Number(selectedItemId));

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Stock Operations & Audit Trail</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Execute real-time stock-in deliveries, consumption issues, inter-warehouse transfers, and physical audit adjustments.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => openModal('IN')} className="btn btn-success">
            📥 Stock In
          </button>
          <button onClick={() => openModal('OUT')} className="btn btn-danger">
            📤 Stock Out
          </button>
          <button onClick={() => openModal('TRANSFER')} className="btn btn-secondary">
            🔄 Transfer
          </button>
          <button onClick={() => openModal('ADJUST')} className="btn btn-outline">
            ⚖ Adjust
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
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
                  <th>Timestamp</th>
                  <th>Item / SKU</th>
                  <th>Movement</th>
                  <th>Qty</th>
                  <th>Balance After</th>
                  <th>Source → Dest</th>
                  <th>Reference / Reason</th>
                  <th>Operator</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      No stock movements recorded yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(tx.createdAt).toLocaleString()}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{tx.itemName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gold-500)' }}>{tx.itemSku}</div>
                      </td>
                      <td>
                        <StatusBadge status={tx.transactionType} />
                      </td>
                      <td style={{ fontWeight: 800, fontSize: '1.05rem', color: tx.transactionType === 'STOCK_IN' ? 'var(--success)' : tx.transactionType === 'STOCK_OUT' ? 'var(--danger)' : '#fff' }}>
                        {tx.transactionType === 'STOCK_IN' ? `+${tx.quantity}` : tx.transactionType === 'STOCK_OUT' ? `-${tx.quantity}` : tx.quantity}
                      </td>
                      <td style={{ fontWeight: 700 }}>{tx.balanceAfter}</td>
                      <td style={{ fontSize: '0.85rem' }}>
                        {tx.sourceWarehouseName && tx.destWarehouseName && tx.sourceWarehouseName !== tx.destWarehouseName ? (
                          <span>
                            {tx.sourceWarehouseName} → <strong style={{ color: 'var(--gold-500)' }}>{tx.destWarehouseName}</strong>
                          </span>
                        ) : (
                          tx.destWarehouseName || tx.sourceWarehouseName || 'Central Hub'
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>{tx.reason || 'General'}</div>
                        {tx.referenceId && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Ref: {tx.referenceId}
                          </span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {tx.performedBy || 'System'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Modals */}
      <Modal
        isOpen={!!activeModal}
        onClose={closeModal}
        title={
          activeModal === 'IN'
            ? '📥 Record Stock-In Delivery'
            : activeModal === 'OUT'
            ? '📤 Record Stock-Out Issue'
            : activeModal === 'TRANSFER'
            ? '🔄 Inter-Warehouse Stock Transfer'
            : '⚖ Physical Audit Adjustment'
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Inventory Item</label>
            <select
              className="form-control"
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              required
            >
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} ({i.sku}) - Current Stock: {i.quantity} {i.unit}
                </option>
              ))}
            </select>
          </div>

          {selectedItemObj && (
            <div style={{ background: 'var(--bg-elevated)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Current Available: <strong>{selectedItemObj.quantity} {selectedItemObj.unit}</strong></span>
              <span>Warehouse: <strong>{selectedItemObj.warehouse?.name}</strong></span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              {activeModal === 'ADJUST' ? 'New Total Balance' : 'Quantity to Move'}
            </label>
            <input
              type="number"
              min={activeModal === 'ADJUST' ? '0' : '1'}
              max={activeModal === 'OUT' || activeModal === 'TRANSFER' ? selectedItemObj?.quantity : undefined}
              className="form-control"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
            {(activeModal === 'OUT' || activeModal === 'TRANSFER') && selectedItemObj && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Maximum available to issue: {selectedItemObj.quantity} {selectedItemObj.unit}
              </div>
            )}
          </div>

          {activeModal === 'TRANSFER' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Destination Warehouse</label>
                <select
                  className="form-control"
                  value={destWarehouseId}
                  onChange={(e) => setDestWarehouseId(e.target.value)}
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
                <label className="form-label">Destination Location / Bin</label>
                <select
                  className="form-control"
                  value={destLocationId}
                  onChange={(e) => setDestLocationId(e.target.value)}
                >
                  <option value="">General Staging</option>
                  {locations
                    .filter((l) => l.warehouseId === Number(destWarehouseId))
                    .map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.code} - {l.description}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Reference ID (PO #, Booking Ref, Voucher)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. PO-2026-901 or RES-2026-00001"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Reason / Notes</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Room preparation, bulk supplier replenishment, annual audit"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="modal-footer" style={{ padding: '1rem 0 0', borderTop: 'none' }}>
            <button type="button" onClick={closeModal} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm Transaction
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminStock;
