import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { loadCSV } from '../../utils/csvLoader';

const CSV_URL = '/environmental_data.csv';

const GeoMapCard: React.FC<{ timeRange: string; district: string }> = ({ timeRange, district }) => {
  const [envData, setEnvData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setLoading(true);
    loadCSV(CSV_URL)
      .then(data => {
        setEnvData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // For the demo, show a table of environmental readings filtered by district
  const filtered = envData.filter(item =>
    (!district || district === 'All' || item.district?.includes(district))
  );

  return (
    <div className="dashboard-card" tabIndex={0} role="button" style={{cursor:'pointer'}} onClick={() => setModalOpen(true)}>
      <div className="card-header">
        <h2 className="card-title">Geographic Health Map</h2>
        <div className="insight-tag">Spatial Analysis</div>
      </div>
      <div 
        className="card-content map-container"
        style={{
          position: 'relative', minHeight: 260, background: '#f8f8f8', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px 0 #0001', width: '100%', height: 260, maxHeight: 320, maxWidth: '100%', cursor: 'pointer',
          transition: 'box-shadow 0.25s, border 0.25s',
          boxShadow: hovered ? '0 4px 24px 0 #2791d333, 0 0 0 2px #2791D3' : '0 2px 12px 0 #0001',
          border: hovered ? '2px solid #2791D3' : 'none',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Map base image */}
        <img 
          src="/dubai_map_placeholder.png" 
          alt="Dubai Map" 
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            display: 'block',
            background: 'transparent',
            pointerEvents: 'none',
            transition: 'opacity 0.2s, filter 0.2s',
            opacity: hovered ? 1 : 0.93,
            filter: hovered ? 'drop-shadow(0 4px 24px #2791d333)' : 'drop-shadow(0 2px 10px #0002)',
          }} 
        />
        {/* Color tint overlay, perfectly matching the image */}
        <div 
          className="map-overlay" 
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            background: hovered
              ? 'linear-gradient(90deg, rgba(39,145,211,0.18) 0%, rgba(255,255,255,0.08) 100%)'
              : 'linear-gradient(90deg, rgba(39,145,211,0.09) 0%, rgba(255,255,255,0.05) 100%)',
            borderRadius: 12,
            pointerEvents: 'none',
            zIndex: 2,
            transition: 'background 0.2s',
          }} 
        />
        {/* Centered loading indicator */}
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',color:'#555',fontWeight:500,zIndex:3}}>
          {loading ? 'Loading...' : ''}
        </div>
      </div>
      <div className="card-footer">
        <span>Respiratory condition cluster detected in Dubai Marina</span>
        <div className="alert-tag">Hotspot</div>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <button aria-label="Close" onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 12, right: 12, fontSize: 18, background: 'none', border: 'none', cursor: 'pointer', zIndex: 2 }}>&times;</button>
        <h2>Environmental Data Table</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="env-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>District</th>
                <th>PM2.5</th>
                <th>NO2</th>
                <th>Ozone</th>
                <th>Temperature</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map((item, idx) => (
                <tr key={idx}>
                  <td>{item.timestamp || item.date}</td>
                  <td>{item.district}</td>
                  <td>{item.pm25}</td>
                  <td>{item.no2}</td>
                  <td>{item.ozone}</td>
                  <td>{item.temperature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Modal>
    </div>
  );
};

export default GeoMapCard;
