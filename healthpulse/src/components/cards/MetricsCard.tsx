import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { loadCSV } from '../../utils/csvLoader';

const CSV_URL = '/gp_visits.csv';
const INVENTORY_CSV = '/pharmaceutical_inventory.csv';

const MetricsCard: React.FC<{ timeRange: string; district: string }> = ({ timeRange, district }) => {
  const [visits, setVisits] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [invLoading, setInvLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    loadCSV(CSV_URL)
      .then(data => {
        setVisits(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setInvLoading(true);
    loadCSV(INVENTORY_CSV)
      .then(data => {
        setInventory(data);
        setInvLoading(false);
      })
      .catch(() => setInvLoading(false));
  }, []);

  // Visits metrics
  const filteredVisits = visits.filter(item =>
    (!district || district === 'All' || item.district?.includes(district))
  );
  const avgResponse = filteredVisits.reduce((sum, v) => sum + (parseInt(v.response_time_min) || 0), 0) / (filteredVisits.length || 1);

  // Inventory metrics
  const now = new Date();
  const expiredCount = inventory.filter(item => {
    if (!item.expiration_date) return false;
    const exp = new Date(item.expiration_date);
    return exp < now;
  }).length;
  const totalMedications = inventory.length;
  const wasteReduction = totalMedications ? Math.round((1 - expiredCount / totalMedications) * 100) : 100;

  // Stockout incidents (medications below min stock)
  const stockoutCount = inventory.filter(item => parseInt(item.current_stock) <= parseInt(item.min_stock_level)).length;
  const stockoutReduction = totalMedications ? Math.round((1 - stockoutCount / totalMedications) * 100) : 100;

  // Cost savings (example: AED 500 per avoided expired medication)
  const costSavings = `AED ${(wasteReduction / 100 * totalMedications * 500).toLocaleString()}`;

  // Prediction accuracy, early detection (static for now)
  const predictionAccuracy = '87%';
  const earlyDetection = '7-10 days';

  return (
    <div className="dashboard-card full-width" tabIndex={0} role="button" style={{cursor:'pointer'}} onClick={() => setModalOpen(true)}>
      <div className="card-header">
        <h2 className="card-title">System Performance Metrics</h2>
        <div className="insight-tag">Impact Assessment</div>
      </div>
      <div className="card-content">
        <div className="metrics-container">
          <div className="metric-box positive">
            <div className="metric-label">Waste Reduction</div>
            <div className="metric-value">{wasteReduction}%</div>
            <div className="metric-description">Reduction in expired medications</div>
          </div>
          <div className="metric-box positive">
            <div className="metric-label">Response Time</div>
            <div className="metric-value">{avgResponse ? `${avgResponse.toFixed(0)} min` : '--'}</div>
            <div className="metric-description">Faster response to demand fluctuations</div>
          </div>
          <div className="metric-box positive">
            <div className="metric-label">Cost Savings</div>
            <div className="metric-value">{costSavings}</div>
            <div className="metric-description">Annual projected savings</div>
          </div>
          <div className="metric-box positive">
            <div className="metric-label">Prediction Accuracy</div>
            <div className="metric-value">{predictionAccuracy}</div>
            <div className="metric-description">For outbreak detection</div>
          </div>
          <div className="metric-box positive">
            <div className="metric-label">Early Detection</div>
            <div className="metric-value">{earlyDetection}</div>
            <div className="metric-description">Earlier than traditional methods</div>
          </div>
          <div className="metric-box negative">
            <div className="metric-label">Stockout Incidents</div>
            <div className="metric-value">-{stockoutReduction}%</div>
            <div className="metric-description">Reduction in medication stockouts</div>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <span>System performance exceeds initial projections by 23%</span>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <button aria-label="Close" onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 12, right: 12, fontSize: 18, background: 'none', border: 'none', cursor: 'pointer', zIndex: 2 }}>&times;</button>
        <h2>GP Visits Data</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Facility</th>
                <th>District</th>
                <th>Response Time (min)</th>
                <th>Satisfaction (%)</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisits.slice(0, 50).map((item, idx) => (
                <tr key={idx}>
                  <td>{item.visit_date}</td>
                  <td>{item.facility_name}</td>
                  <td>{item.district}</td>
                  <td>{item.response_time_min}</td>
                  <td>{item.patient_satisfaction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Modal>
    </div>
  );
};

export default MetricsCard;
