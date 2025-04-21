import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { loadCSV } from '../../utils/csvLoader';

const CSV_URL = '/hospital_admissions.csv';

const DiseaseDistributionCard: React.FC<{ timeRange: string; district: string }> = ({ timeRange, district }) => {
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

  // Count diseases for bar chart
  const diseaseCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    admissions.forEach(item => {
      const diag = item.diagnosis || item.diagnosis_primary_name;
      if (diag) counts[diag] = (counts[diag] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [admissions]);

  return (
    <div className="dashboard-card" tabIndex={0} role="button" onClick={() => setModalOpen(true)}>
      <div className="card-header">
        <h2 className="card-title">Disease Distribution</h2>
        <div className="insight-tag">Current Status</div>
      </div>
      <div className="card-content">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul style={{maxHeight: 180, overflowY: 'auto', padding: 0, margin: 0}}>
            {diseaseCounts.map(([name, count], idx) => (
              <li key={idx} style={{marginBottom: 8, listStyle: 'none'}}>
                <strong>{name}:</strong> <span>{count} cases</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="card-footer">
        <span>Diabetes and cardiovascular diseases remain primary concerns</span>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <button aria-label="Close" onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 12, right: 12, fontSize: 18, background: 'none', border: 'none', cursor: 'pointer', zIndex: 2 }}>&times;</button>
        <h2>Disease Distribution Data</h2>
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
              {admissions.slice(0, 20).map((item, idx) => (
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

export default DiseaseDistributionCard;
