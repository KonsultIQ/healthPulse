import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { loadCSV } from '../../utils/csvLoader';

const CSV_URL = '/environmental_data.csv';

const TemperatureImpactCard: React.FC<{ timeRange: string; district: string }> = ({ timeRange, district }) => {
  const [envData, setEnvData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    loadCSV(CSV_URL)
      .then(data => {
        setEnvData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = envData.filter(item =>
    (!district || district === 'All' || item.district?.includes(district))
  );

  // Simple average temperature for demo
  const avgTemp = filtered.length
    ? (filtered.reduce((sum, item) => sum + Number(item.temperature || 0), 0) / filtered.length).toFixed(1)
    : 'N/A';

  return (
    <div className="dashboard-card" tabIndex={0} role="button" onClick={() => setModalOpen(true)}>
      <div className="card-header">
        <h2 className="card-title">Temperature Impact Analysis</h2>
        <div className="insight-tag">Environmental Factors</div>
      </div>
      <div className="card-content" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div style={{fontSize: 48, color: '#2791D3', fontWeight: 700, marginBottom: 8}}>{avgTemp}°C</div>
            <div style={{color: '#888'}}>Average temperature in selected range</div>
          </>
        )}
      </div>
      <div className="card-footer">
        <span>Heat-related conditions expected to rise in coming weeks</span>
        <div className="alert-tag">Seasonal Forecast</div>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <button aria-label="Close" onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 12, right: 12, fontSize: 18, background: 'none', border: 'none', cursor: 'pointer', zIndex: 2 }}>&times;</button>
        <h2 style={{marginTop: 0, fontSize: '1.35rem', fontWeight: 600, textAlign: 'center'}}>Environmental Data</h2>
        {loading ? (
          <div style={{textAlign: 'center', color: '#888', margin: 32}}>Loading...</div>
        ) : (
          <div style={{overflowX: 'auto', maxHeight: 420}}>
            <table className="inventory-table" style={{width: '100%', borderCollapse: 'collapse', fontSize: 15}}>
              <thead>
                <tr style={{background: '#f7f7f7'}}>
                  <th>Date</th>
                  <th>District</th>
                  <th>Temperature</th>
                  <th>Humidity</th>
                  <th>Air Quality Index</th>
                  <th>Special Event</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 50).map((item, idx) => (
                  <tr key={idx} style={{borderBottom: '1px solid #eee'}}>
                    <td>{item.date}</td>
                    <td>{item.district}</td>
                    <td>{item.temperature}</td>
                    <td>{item.humidity}</td>
                    <td>{item.air_quality_index}</td>
                    <td>{item.special_event}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TemperatureImpactCard;
