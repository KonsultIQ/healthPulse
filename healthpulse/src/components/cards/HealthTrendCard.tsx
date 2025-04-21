import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { loadCSV } from '../../utils/csvLoader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CSV_URL = '/hospital_admissions.csv';

const HealthTrendCard: React.FC<{ timeRange: string; district: string }> = ({ timeRange, district }) => {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    loadCSV(CSV_URL)
      .then(data => {
        setAdmissions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Aggregate admissions per week (or month) by diagnosis
  const chartData = React.useMemo(() => {
    if (!admissions.length) return [];
    const counts: Record<string, number> = {};
    admissions.forEach(item => {
      if (district !== 'All' && item.facility_district && !item.facility_district.includes(district)) return;
      const date = item.admission_date || item.admission_timestamp;
      const week = date ? date.slice(0,7) : 'Unknown'; // YYYY-MM
      counts[week] = (counts[week] || 0) + 1;
    });
    return Object.entries(counts).map(([week, count]) => ({ week, count }));
  }, [admissions, district]);

  return (
    <div className="dashboard-card" tabIndex={0} role="button" style={{cursor:'pointer'}} onClick={() => setModalOpen(true)}>
      <div className="card-header">
        <h2 className="card-title">Health Trend Analysis</h2>
        <div className="insight-tag">Trends</div>
      </div>
      <div className="card-content">
        {loading ? (
          <div style={{textAlign: 'center', color: '#aaa', marginTop: 120}}>Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#2791D3" name="Admissions" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="card-footer">
        <span>Diabetes and cardiovascular diseases remain primary concerns</span>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <button aria-label="Close" onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 12, right: 12, fontSize: 18, background: 'none', border: 'none', cursor: 'pointer', zIndex: 2 }}>&times;</button>
        <h2>Hospital Admissions Data</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Facility</th>
                <th>Diagnosis</th>
                <th>Type</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {admissions.filter(item => district === 'All' || item.facility_district?.includes(district)).slice(0, 50).map((item, idx) => (
                <tr key={idx}>
                  <td>{item.admission_date || item.admission_timestamp}</td>
                  <td>{item.facility_name}</td>
                  <td>{item.diagnosis || item.diagnosis_primary_name}</td>
                  <td>{item.admission_type}</td>
                  <td>{item.severity || item.severity_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Modal>
    </div>
  );
};

export default HealthTrendCard;
