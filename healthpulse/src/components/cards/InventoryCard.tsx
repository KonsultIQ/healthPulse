import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { loadCSV } from '../../utils/csvLoader';

const CSV_URL = '/pharmaceutical_inventory.csv';

const InventoryCard: React.FC<{ timeRange: string; district: string }> = ({ timeRange, district }) => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    loadCSV(CSV_URL)
      .then(data => {
        setInventory(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [district]);

  const filtered = inventory.filter(item =>
    (!district || district === 'All' || item.facility_name?.includes(district))
  );

  return (
    <div className="dashboard-card" tabIndex={0} role="button" style={{cursor:'pointer'}} onClick={() => setModalOpen(true)}>
      <div className="card-header">
        <h2 className="card-title">Medication Inventory Status</h2>
        <div className="insight-tag">Supply Chain</div>
      </div>
      <div className="card-content">
        {loading ? (
          <div style={{textAlign: 'center', color: '#aaa', marginTop: 120}}>Loading...</div>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Medication</th>
                <th>Category</th>
                <th>Stock / Min</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 5).map((item, idx) => {
                const currentStock = parseInt(item.current_stock) || 0;
                const minStock = parseInt(item.min_stock_level) || 0;
                let status = '';
                let statusClass = '';
                if (currentStock <= minStock * 0.5) {
                  status = 'Critical'; statusClass = 'status-critical';
                } else if (currentStock <= minStock) {
                  status = 'Warning'; statusClass = 'status-warning';
                } else {
                  status = 'Optimal'; statusClass = 'status-optimal';
                }
                return (
                  <tr key={idx}>
                    <td>{item.medication_name}</td>
                    <td>{item.medication_category}</td>
                    <td>{item.current_stock} / {item.min_stock_level}</td>
                    <td><span className={`status-indicator ${statusClass}`}></span>{status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <div className="card-footer">
        <span style={{color:'#c00',fontWeight:600,display:'flex',alignItems:'center',gap:6}}>
          {filtered.filter(item => parseInt(item.current_stock) <= parseInt(item.min_stock_level)).length === 1 &&
            <span style={{fontSize:22,verticalAlign:'middle'}}>⚠️</span>
          }
          {filtered.filter(item => parseInt(item.current_stock) <= parseInt(item.min_stock_level)).length} medications require immediate reordering
        </span>
        <div className="alert-tag" style={{background:'#c00',color:'#fff',fontWeight:700,borderRadius:6,padding:'2px 10px',marginLeft:10}}>Action Required</div>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <button aria-label="Close" onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 12, right: 12, fontSize: 18, background: 'none', border: 'none', cursor: 'pointer', zIndex: 2 }}>&times;</button>
        <h2 style={{marginTop: 0, fontSize: '1.35rem', fontWeight: 600, textAlign: 'center'}}>Full Inventory Data</h2>
        {loading ? (
          <div style={{textAlign: 'center', color: '#888', margin: 32}}>Loading...</div>
        ) : (
          <div style={{overflowX: 'auto', maxHeight: 420}}>
            <table className="inventory-table" style={{width: '100%', borderCollapse: 'collapse', fontSize: 15}}>
              <thead>
                <tr style={{background: '#f7f7f7'}}>
                  <th>Medication</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Min Level</th>
                  <th>Facility</th>
                  <th>Status</th>
                  <th>Expiration</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => {
                  const currentStock = parseInt(item.current_stock) || 0;
                  const minStock = parseInt(item.min_stock_level) || 0;
                  let status = '';
                  let statusClass = '';
                  if (currentStock <= minStock * 0.5) {
                    status = 'Critical'; statusClass = 'status-critical';
                  } else if (currentStock <= minStock) {
                    status = 'Warning'; statusClass = 'status-warning';
                  } else {
                    status = 'Optimal'; statusClass = 'status-optimal';
                  }
                  return (
                    <tr key={idx} style={{borderBottom: '1px solid #eee'}}>
                      <td>{item.medication_name}</td>
                      <td>{item.medication_category}</td>
                      <td>{item.current_stock}</td>
                      <td>{item.min_stock_level}</td>
                      <td>{item.facility_name}</td>
                      <td><span className={`status-indicator ${statusClass}`}></span>{status}</td>
                      <td>{item.expiration_date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InventoryCard;
