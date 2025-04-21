import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { loadCSV } from '../../utils/csvLoader';

const CSV_URL = '/social_media.csv';

const SocialMediaCard: React.FC<{ timeRange: string; district: string }> = ({ timeRange, district }) => {
  const [socialData, setSocialData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    loadCSV(CSV_URL)
      .then(data => {
        setSocialData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Optionally, filter by district and timeRange here
  const filtered = socialData.filter(item =>
    (!district || district === 'All' || item.district?.includes(district))
  );

  return (
    <div className="dashboard-card" tabIndex={0} role="button" onClick={() => setModalOpen(true)}>
      <div className="card-header">
        <h2 className="card-title">Social Media Health Insights</h2>
        <div className="insight-tag">Early Signals</div>
      </div>
      <div className="card-content">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul style={{maxHeight: 180, overflowY: 'auto', padding: 0, margin: 0}}>
            {filtered.slice(0, 8).map((item, idx) => (
              <li key={idx} style={{marginBottom: 8, listStyle: 'none'}}>
                <strong>{item.district}:</strong> <span>{item.symptoms_mentioned}</span>
                <span style={{color: item.sentiment_score < 0 ? '#dc3545' : '#28a745', marginLeft: 8}}>
                  ({item.sentiment_score})
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="card-footer">
        <span>Increasing mentions of respiratory symptoms detected</span>
        <div className="alert-tag">Emerging Pattern</div>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <button aria-label="Close" onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 12, right: 12, fontSize: 18, background: 'none', border: 'none', cursor: 'pointer', zIndex: 2 }}>&times;</button>
        <h2>Social Media Mentions</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>District</th>
                <th>Symptoms Mentioned</th>
                <th>Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map((item, idx) => (
                <tr key={idx}>
                  <td>{item.post_date}</td>
                  <td>{item.district}</td>
                  <td>{item.symptoms_mentioned}</td>
                  <td>{item.sentiment_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Modal>
    </div>
  );
};

export default SocialMediaCard;
