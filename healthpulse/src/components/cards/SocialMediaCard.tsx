import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { loadCSV } from '../../utils/csvLoader';
import SocialMediaHeatmap from './SocialMediaHeatmap';

const CSV_URL = '/social_media.csv';

const SocialMediaCard: React.FC<{ timeRange: string; district: string }> = ({ timeRange, district }) => {
  const [socialData, setSocialData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    loadCSV(CSV_URL)
      .then(data => {
        setSocialData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter by dashboard district (if set)
  const filtered = socialData.filter(item =>
    (!district || district === 'All' || item.district?.includes(district))
  );

  // Count mentions per district for heatmap
  const districtCounts = filtered.reduce((acc: Record<string, number>, item: any) => {
    acc[item.district] = (acc[item.district] || 0) + 1;
    return acc;
  }, {});

  // Posts for selected district
  const postsForDistrict = selectedDistrict
    ? filtered.filter(item => item.district === selectedDistrict)
    : [];

  return (
    <div className="dashboard-card" tabIndex={0}>
      <div className="card-header">
        <h2 className="card-title">Social Media Health Insights</h2>
        <div className="insight-tag">Early Signals</div>
      </div>
      <div className="card-content">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <SocialMediaHeatmap
            districtCounts={districtCounts}
            onDistrictClick={district => {
              if (districtCounts[district] > 0) {
                setSelectedDistrict(district);
                setModalOpen(true);
              }
            }}
          />
        )}
      </div>
      <div className="card-footer">
        <span>Click a region to view recent posts</span>
        <div className="alert-tag">Emerging Pattern</div>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <button aria-label="Close" onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 12, right: 12, fontSize: 18, background: 'none', border: 'none', cursor: 'pointer', zIndex: 2 }}>&times;</button>
        <h2 style={{marginTop:0, fontSize:'1.2rem', fontWeight:600, textAlign:'center'}}>
          {selectedDistrict ? `Recent Posts from ${selectedDistrict}` : 'Recent Posts'}
        </h2>
        {loading ? (
          <div>Loading...</div>
        ) : postsForDistrict.length === 0 ? (
          <div style={{textAlign:'center', color:'#888', margin:32}}>No recent posts for this region.</div>
        ) : (
          <ul style={{maxHeight: 340, overflowY: 'auto', padding: 0, margin: 0}}>
            {postsForDistrict.slice(0, 10).map((item, idx) => (
              <li key={idx} style={{marginBottom: 16, listStyle: 'none', borderBottom: '1px solid #eee', paddingBottom: 8}}>
                <div style={{fontWeight:600, color:'#2791D3'}}>{item.post_date}</div>
                <div style={{margin:'4px 0'}}>{item.symptoms_mentioned}</div>
                <div style={{color: item.sentiment_score < 0 ? '#dc3545' : '#28a745'}}>
                  Sentiment: {item.sentiment_score}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
};

export default SocialMediaCard;
