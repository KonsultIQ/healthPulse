import React, { useState, useEffect } from 'react';
import Header from './Header';
import HealthTrendCard from './cards/HealthTrendCard';
import GeoMapCard from './cards/GeoMapCard';
import InventoryCard from './cards/InventoryCard';
import MetricsCard from './cards/MetricsCard';
import SocialMediaCard from './cards/SocialMediaCard';

// Import mock data utilities
import {
  getStatusCardsData,
  getCriticalAlerts,
  getRecommendedActions,
  getPatientFlowData,
  getSustainabilityData,
  getStaffingData
} from './mockData';

// --- Types for mock data ---
import type { CriticalAlert, AlertCategory, AlertStatus, AlertComment } from './mockData';

// --- Import chart components ---
import TrendChart, { TrendChartPoint } from './charts/TrendChart';
import BedUtilizationChart from './charts/BedUtilizationChart';
import SustainabilityChart, { SustainabilityChartPoint } from './charts/SustainabilityChart';
import GeoHealthMap from './charts/GeoHealthMap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

// --- Deterministic mock data for hydration consistency ---
const STATIC_TREND_CHART_DATA: TrendChartPoint[] = [
  { date: 'Apr 20', actual: 82, predicted: 0 },
  { date: 'Apr 21', actual: 85, predicted: 0 },
  { date: 'Apr 22', actual: 87, predicted: 0 },
  { date: 'Apr 23', actual: 90, predicted: 0 },
  { date: 'Apr 24', actual: 91, predicted: 0 },
  { date: 'Apr 25', actual: 93, predicted: 0 },
  { date: 'Apr 26', actual: 95, predicted: 0 },
  { date: 'Apr 27', actual: 97, predicted: 0 },
  { date: 'Apr 28', actual: 98, predicted: 0 },
  { date: 'Apr 29', actual: 99, predicted: 0 },
  { date: 'Apr 30', actual: 100, predicted: 0 },
  { date: 'May 1', actual: 0, predicted: 102 },
  { date: 'May 2', actual: 0, predicted: 104 },
  { date: 'May 3', actual: 0, predicted: 107 },
  { date: 'May 4', actual: 0, predicted: 110 },
  { date: 'May 5', actual: 0, predicted: 113 },
];
function generateTrendChartData(): TrendChartPoint[] {
  return STATIC_TREND_CHART_DATA;
}

const STATIC_BED_UTILIZATION_DETAILS = [
  { facility: 'Al Noor', value: 92 },
  { facility: 'City Hospital', value: 87 },
  { facility: 'Al Zahra', value: 78 },
  { facility: 'MedCare', value: 84 },
];
function generateBedUtilizationDetails() {
  return STATIC_BED_UTILIZATION_DETAILS;
}

const STATIC_SUSTAINABILITY_CHART_DATA: SustainabilityChartPoint[] = [
  { month: 'Jan', value: 20.1, baseline: 22 },
  { month: 'Feb', value: 19.7, baseline: 22 },
  { month: 'Mar', value: 18.9, baseline: 22 },
  { month: 'Apr', value: 18.5, baseline: 22 },
  { month: 'May', value: 18.2, baseline: 22 },
  { month: 'Jun', value: 17.9, baseline: 22 },
  { month: 'Jul', value: 18.3, baseline: 22 },
  { month: 'Aug', value: 18.8, baseline: 22 },
  { month: 'Sep', value: 19.1, baseline: 22 },
  { month: 'Oct', value: 19.5, baseline: 22 },
  { month: 'Nov', value: 19.9, baseline: 22 },
  { month: 'Dec', value: 20.0, baseline: 22 },
];
function generateSustainabilityChartData(): SustainabilityChartPoint[] {
  return STATIC_SUSTAINABILITY_CHART_DATA;
}

const STATIC_DISTRICT_DATA = [
  { district: 'Deira', value: 42 },
  { district: 'Bur Dubai', value: 35 },
  { district: 'Jumeirah', value: 53 },
  { district: 'Al Barsha', value: 47 },
  { district: 'Dubai Marina', value: 38 },
  { district: 'Satwa', value: 44 },
  { district: 'Karama', value: 31 },
  { district: 'Al Quoz', value: 29 },
  { district: 'Mirdif', value: 41 },
  { district: 'Rashidiya', value: 37 },
  { district: 'Al Nahda', value: 50 },
  { district: 'Al Twar', value: 36 },
  { district: 'Al Safa', value: 45 },
  { district: 'Jebel Ali', value: 32 },
  { district: 'Al Warqa', value: 39 },
  { district: 'Al Mizhar', value: 40 },
  { district: 'Al Rigga', value: 34 },
  { district: 'Al Qusais', value: 46 },
  { district: 'Al Rashidiya', value: 43 },
];
function generateGeoHealthData() {
  return STATIC_DISTRICT_DATA;
}

// Enhanced StatusCards component
const StatusCards = () => {
  const [cards, setCards] = useState<any[]>([]);
  useEffect(() => {
    setCards(getStatusCardsData());
    const interval = setInterval(() => setCards(getStatusCardsData()), 30000);
    return () => clearInterval(interval);
  }, []);
  if (!cards.length) return <div style={{height:100,marginBottom:20}}>Loading...</div>;
  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
      {cards.map((card: any, idx: number) => (
        <div key={idx} style={{ flex: 1, background: card.color, color: '#fff', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', boxShadow: '0 2px 6px #eee', minWidth: 180 }}>
          <span style={{ fontSize: 34, marginBottom: 10 }}>{card.icon}</span>
          <span style={{ fontWeight: 700, fontSize: 20 }}>{card.value}</span>
          <span style={{ fontWeight: 600, fontSize: 15, margin: '6px 0' }}>{card.title}</span>
          <span style={{ fontSize: 13, opacity: 0.95 }}>{card.description}</span>
        </div>
      ))}
    </div>
  );
};

// --- Enhanced CriticalAlerts: actionable & context-rich ---
const ALERT_CATEGORIES: { label: string, value: AlertCategory }[] = [
  { label: 'Clinical', value: 'clinical' },
  { label: 'Operational', value: 'operational' },
  { label: 'Supply', value: 'supply' },
  { label: 'Staffing', value: 'staffing' },
  { label: 'Sustainability', value: 'sustainability' },
  { label: 'IT', value: 'it' },
];
const ALERT_STATUSES: { label: string, value: AlertStatus }[] = [
  { label: 'New', value: 'new' },
  { label: 'Acknowledged', value: 'acknowledged' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
];

const CriticalAlerts = () => {
  const [alerts, setAlerts] = useState<CriticalAlert[] | null>(null);
  const [acknowledged, setAcknowledged] = useState<Set<number>>(new Set());
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [showActionPlan, setShowActionPlan] = useState<{open: boolean, alert?: CriticalAlert} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AlertCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<AlertStatus | 'all'>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string | 'all'>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string | 'all'>('all');
  const [selectedFacility, setSelectedFacility] = useState<string | 'all'>('all');
  const [selectedAlerts, setSelectedAlerts] = useState<Set<number>>(new Set());
  const [showHistory, setShowHistory] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [assignInput, setAssignInput] = useState('');
  useEffect(() => {
    setAlerts(getCriticalAlerts());
    const interval = setInterval(() => setAlerts(getCriticalAlerts()), 30000);
    return () => clearInterval(interval);
  }, []);
  if (!alerts) return <div style={{height:60,marginBottom:16}}>Loading...</div>;
  // Filtering logic
  let filteredAlerts = alerts.filter(a => !showHistory ? !a.archived : a.archived);
  if (selectedCategory !== 'all') filteredAlerts = filteredAlerts.filter(a => a.category === selectedCategory);
  if (selectedStatus !== 'all') filteredAlerts = filteredAlerts.filter(a => a.status === selectedStatus);
  if (selectedSeverity !== 'all') filteredAlerts = filteredAlerts.filter(a => a.severity === selectedSeverity);
  if (selectedDistrict !== 'all') filteredAlerts = filteredAlerts.filter(a => a.district === selectedDistrict);
  if (selectedFacility !== 'all') filteredAlerts = filteredAlerts.filter(a => a.facility === selectedFacility);
  // Unique districts/facilities for filters
  const allDistricts = Array.from(new Set(alerts.map(a => a.district).filter(Boolean)));
  const allFacilities = Array.from(new Set(alerts.map(a => a.facility).filter(Boolean)));
  // Status update helpers
  const updateAlertStatus = (id: number, status: AlertStatus) => {
    setAlerts(prev => prev ? prev.map(a => a.id === id ? { ...a, status } : a) : prev);
  };
  const assignAlert = (id: number, user: string) => {
    setAlerts(prev => prev ? prev.map(a => a.id === id ? { ...a, assignedTo: user } : a) : prev);
    setAssignInput('');
  };
  const addComment = (id: number, comment: string) => {
    if (!comment) return;
    setAlerts(prev => prev ? prev.map(a => a.id === id ? { ...a, comments: [...(a.comments || []), { user: 'You', time: 'now', comment }] } : a) : prev);
    setCommentInput('');
  };
  // Bulk actions
  const bulkAcknowledge = () => {
    setAlerts(prev => prev ? prev.map(a => selectedAlerts.has(a.id) ? { ...a, status: 'acknowledged' } : a) : prev);
    setSelectedAlerts(new Set());
  };
  const bulkAssign = (user: string) => {
    setAlerts(prev => prev ? prev.map(a => selectedAlerts.has(a.id) ? { ...a, assignedTo: user } : a) : prev);
    setSelectedAlerts(new Set());
    setAssignInput('');
  };
  // Selection
  const toggleAlertSelect = (id: number) => {
    setSelectedAlerts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
      return newSet;
    });
  };
  const selectAll = () => {
    setSelectedAlerts(new Set(filteredAlerts.map(a => a.id)));
  };
  const deselectAll = () => {
    setSelectedAlerts(new Set());
  };
  // Chart drill-down: jump to tab & scroll to chart
  const handleDrillDown = (alert: CriticalAlert) => {
    const tab = ALERT_METRIC_TO_TAB[alert.metric] || 'Overview';
    if (typeof window !== 'undefined') {
      const dashboardEvt = new CustomEvent('jump-to-dashboard-tab', { detail: { tab, metric: alert.metric, facility: alert.facility } });
      window.dispatchEvent(dashboardEvt);
    }
    setShowDetails(null);
  };
  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: 18, marginBottom: 16, boxShadow: '0 1px 4px #eee', minWidth: 320 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <h3 style={{ color: '#c00', margin: 0, flex: 1 }}>Critical Alerts</h3>
        <button style={{ padding: '4px 10px', borderRadius: 5, border: 'none', background: showHistory ? '#1976d2' : '#888', color: '#fff', fontWeight: 500, cursor: 'pointer', fontSize: 13 }} onClick={() => setShowHistory(h => !h)}>{showHistory ? 'Show Active' : 'Show History'}</button>
      </div>
      {/* Filtering Controls */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value as AlertCategory | 'all')} style={{ padding: 4, borderRadius: 4 }}>
          <option value="all">All Types</option>
          {ALERT_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value as AlertStatus | 'all')} style={{ padding: 4, borderRadius: 4 }}>
          <option value="all">All Statuses</option>
          {ALERT_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={selectedSeverity} onChange={e => setSelectedSeverity(e.target.value as string | 'all')} style={{ padding: 4, borderRadius: 4 }}>
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
        </select>
        <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value as string | 'all')} style={{ padding: 4, borderRadius: 4 }}>
          <option value="all">All Districts</option>
          {allDistricts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={selectedFacility} onChange={e => setSelectedFacility(e.target.value as string | 'all')} style={{ padding: 4, borderRadius: 4 }}>
          <option value="all">All Facilities</option>
          {allFacilities.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      {/* Bulk Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <button onClick={selectAll} style={{ padding: '2px 8px', fontSize: 13, borderRadius: 4, border: '1px solid #1976d2', background: '#f4f7fa', color: '#1976d2', fontWeight: 600, cursor: 'pointer' }}>Select All</button>
        <button onClick={deselectAll} style={{ padding: '2px 8px', fontSize: 13, borderRadius: 4, border: '1px solid #888', background: '#f4f7fa', color: '#888', fontWeight: 600, cursor: 'pointer' }}>Deselect All</button>
        <button onClick={bulkAcknowledge} disabled={selectedAlerts.size === 0} style={{ padding: '2px 8px', fontSize: 13, borderRadius: 4, border: '1px solid #28A745', background: selectedAlerts.size ? '#28A745' : '#eee', color: selectedAlerts.size ? '#fff' : '#888', fontWeight: 600, cursor: selectedAlerts.size ? 'pointer' : 'not-allowed' }}>Bulk Acknowledge</button>
        <input value={assignInput} onChange={e => setAssignInput(e.target.value)} placeholder="Assign to..." style={{ padding: 2, fontSize: 13, borderRadius: 4, border: '1px solid #1976d2', width: 100 }} />
        <button onClick={() => bulkAssign(assignInput)} disabled={!assignInput || selectedAlerts.size === 0} style={{ padding: '2px 8px', fontSize: 13, borderRadius: 4, border: '1px solid #1976d2', background: assignInput && selectedAlerts.size ? '#1976d2' : '#eee', color: assignInput && selectedAlerts.size ? '#fff' : '#888', fontWeight: 600, cursor: assignInput && selectedAlerts.size ? 'pointer' : 'not-allowed' }}>Bulk Assign</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {filteredAlerts.map((a: CriticalAlert, idx: number) => (
          <li key={idx} style={{ marginBottom: 18, padding: 14, borderRadius: 8, background: a.severity === 'critical' ? '#ffeaea' : '#fffbe6', border: `1.5px solid ${a.severity === 'critical' ? '#c00' : '#FFC107'}`, opacity: a.status === 'resolved' ? 0.6 : 1, position: 'relative' }}>
            <input type="checkbox" checked={selectedAlerts.has(a.id)} onChange={() => toggleAlertSelect(a.id)} style={{ position: 'absolute', left: 8, top: 18 }} />
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{a.message}</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>{a.time} &middot; <b>{a.facility}</b> &middot; <span style={{ color: '#1976d2' }}>{a.category}</span></div>
            <div style={{ fontSize: 13, marginBottom: 6 }}><span style={{ color: '#1976d2', fontWeight: 600 }}>{a.metric}:</span> <b>{a.value}</b> (Threshold: {a.threshold})</div>
            <div style={{ fontSize: 13, color: '#555', marginBottom: 6 }}>{a.context}</div>
            <div style={{ fontSize: 13, color: '#c00', marginBottom: 4 }}><b>Status:</b> {a.status}</div>
            <div style={{ fontSize: 13, color: '#1976d2', marginBottom: 4 }}><b>Assigned To:</b> {a.assignedTo || 'Unassigned'}</div>
            <div style={{ fontSize: 13, color: '#555', marginBottom: 4 }}><b>Root Cause:</b> {a.rootCause}</div>
            <div style={{ fontSize: 13, color: '#FFC107', marginBottom: 4 }}><b>Impact:</b> {a.impact}</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Occurred <b>{a.trendCount}</b> times this month</div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
              {a.status !== 'resolved' && <button onClick={() => updateAlertStatus(a.id, 'resolved')} style={{ padding: '4px 10px', borderRadius: 5, border: 'none', background: '#28A745', color: '#fff', fontWeight: 500, cursor: 'pointer', fontSize: 13 }}>Mark Resolved</button>}
              {a.status !== 'in_progress' && <button onClick={() => updateAlertStatus(a.id, 'in_progress')} style={{ padding: '4px 10px', borderRadius: 5, border: 'none', background: '#1976d2', color: '#fff', fontWeight: 500, cursor: 'pointer', fontSize: 13 }}>In Progress</button>}
              <button onClick={() => setShowDetails(a.id)} style={{ padding: '4px 10px', borderRadius: 5, border: 'none', background: '#888', color: '#fff', fontWeight: 500, cursor: 'pointer', fontSize: 13 }}>View Details</button>
              <button onClick={() => setShowActionPlan({open: true, alert: a})} style={{ padding: '4px 10px', borderRadius: 5, border: 'none', background: '#28A745', color: '#fff', fontWeight: 500, cursor: 'pointer', fontSize: 13 }}>Create Action Plan</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <input value={assignInput} onChange={e => setAssignInput(e.target.value)} placeholder="Assign to..." style={{ padding: 2, fontSize: 13, borderRadius: 4, border: '1px solid #1976d2', width: 100 }} />
              <button onClick={() => assignAlert(a.id, assignInput)} style={{ padding: '2px 8px', fontSize: 13, borderRadius: 4, border: '1px solid #1976d2', background: assignInput ? '#1976d2' : '#eee', color: assignInput ? '#fff' : '#888', fontWeight: 600, cursor: assignInput ? 'pointer' : 'not-allowed' }}>Assign</button>
            </div>
            <div style={{ marginBottom: 4 }}>
              <input value={commentInput} onChange={e => setCommentInput(e.target.value)} placeholder="Add comment..." style={{ padding: 2, fontSize: 13, borderRadius: 4, border: '1px solid #888', width: 170 }} />
              <button onClick={() => addComment(a.id, commentInput)} style={{ padding: '2px 8px', fontSize: 13, borderRadius: 4, border: '1px solid #888', background: commentInput ? '#888' : '#eee', color: commentInput ? '#fff' : '#888', fontWeight: 600, cursor: commentInput ? 'pointer' : 'not-allowed' }}>Add</button>
            </div>
            <div style={{ fontSize: 13, color: '#1976d2', marginBottom: 4 }}><b>Comments:</b></div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {(a.comments || []).map((c: AlertComment, idx: number) => (
                <li key={idx} style={{ fontSize: 13, color: '#555', marginBottom: 2 }}><b>{c.user}:</b> {c.comment} <span style={{ color: '#888', fontSize: 11 }}>({c.time})</span></li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {/* Alert Details Modal */}
      {showDetails !== null && alerts.find(a => a.id === showDetails) && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setShowDetails(null)} role="dialog" aria-modal="true">
          <div style={{ background: '#fff', borderRadius: 10, padding: 28, minWidth: 340, boxShadow: '0 2px 12px #aaa', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowDetails(null)} aria-label="Close" style={{ position: 'absolute', top: 12, right: 12, fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontWeight: 700 }}>×</button>
            <h3 style={{ marginBottom: 8, color: '#c00' }}>Alert Details</h3>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{alerts.find(a => a.id === showDetails)?.message}</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>{alerts.find(a => a.id === showDetails)?.time} &middot; <b>{alerts.find(a => a.id === showDetails)?.facility}</b> &middot; <span style={{ color: '#1976d2' }}>{alerts.find(a => a.id === showDetails)?.category}</span></div>
            <div style={{ fontSize: 13, marginBottom: 6 }}><span style={{ color: '#1976d2', fontWeight: 600 }}>{alerts.find(a => a.id === showDetails)?.metric}:</span> <b>{alerts.find(a => a.id === showDetails)?.value}</b> (Threshold: {alerts.find(a => a.id === showDetails)?.threshold})</div>
            <div style={{ fontSize: 13, color: '#555', marginBottom: 12 }}>{alerts.find(a => a.id === showDetails)?.context}</div>
            <div style={{ fontSize: 13, color: '#c00', marginBottom: 4 }}><b>Status:</b> {alerts.find(a => a.id === showDetails)?.status}</div>
            <div style={{ fontSize: 13, color: '#1976d2', marginBottom: 4 }}><b>Assigned To:</b> {alerts.find(a => a.id === showDetails)?.assignedTo || 'Unassigned'}</div>
            <div style={{ fontSize: 13, color: '#555', marginBottom: 4 }}><b>Root Cause:</b> {alerts.find(a => a.id === showDetails)?.rootCause}</div>
            <div style={{ fontSize: 13, color: '#FFC107', marginBottom: 4 }}><b>Impact:</b> {alerts.find(a => a.id === showDetails)?.impact}</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Occurred <b>{alerts.find(a => a.id === showDetails)?.trendCount}</b> times this month</div>
            <div style={{ fontSize: 13, color: '#1976d2', marginTop: 12 }}><b>Suggested Action:</b> {alerts.find(a => a.id === showDetails)?.suggestedAction}</div>
            {/* Drill-down: link to metric/chart */}
            <button style={{ padding: '6px 14px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 15, cursor: 'pointer', marginTop: 10 }} onClick={() => handleDrillDown(alerts.find(a => a.id === showDetails)!)}>View Metric in Context</button>
            <div style={{ fontSize: 13, color: '#1976d2', marginTop: 12 }}><b>Comments:</b></div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {(alerts.find(a => a.id === showDetails)?.comments || []).map((c: AlertComment, idx: number) => (
                <li key={idx} style={{ fontSize: 13, color: '#555', marginBottom: 2 }}><b>{c.user}:</b> {c.comment} <span style={{ color: '#888', fontSize: 11 }}>({c.time})</span></li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {/* Create Action Plan Modal */}
      {showActionPlan?.open && showActionPlan.alert && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setShowActionPlan(null)} role="dialog" aria-modal="true">
          <div style={{ background: '#fff', borderRadius: 10, padding: 28, minWidth: 340, boxShadow: '0 2px 12px #aaa', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowActionPlan(null)} aria-label="Close" style={{ position: 'absolute', top: 12, right: 12, fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontWeight: 700 }}>×</button>
            <h3 style={{ marginBottom: 8, color: '#28A745' }}>Create Action Plan</h3>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{showActionPlan.alert.message}</div>
            <div style={{ fontSize: 13, color: '#555', marginBottom: 6 }}>{showActionPlan.alert.context}</div>
            <button style={{ padding: '8px 18px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 15, cursor: 'pointer', marginTop: 10 }} onClick={() => {
              window.dispatchEvent(new CustomEvent('add-action-from-alert', { detail: showActionPlan.alert }));
              setShowActionPlan(null);
            }}>Send to Action Planning Board</button>
          </div>
        </div>
      )}
    </div>
  );
};

const RecommendedActions = () => {
  const [actions, setActions] = useState<any[]>([]);
  const [approved, setApproved] = useState<Set<number>>(new Set());
  useEffect(() => {
    setActions(getRecommendedActions());
    const interval = setInterval(() => setActions(getRecommendedActions()), 30000);
    return () => clearInterval(interval);
  }, []);
  if (!actions.length) return <div style={{height:60,marginBottom:16}}>Loading...</div>;
  const handleApprove = (id: number) => {
    setApproved(prev => new Set(prev).add(id));
  };
  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: 18, marginBottom: 16, boxShadow: '0 1px 4px #eee' }}>
      <h3 style={{ color: '#2791D3', marginBottom: 10 }}>Recommended Actions</h3>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {actions.map((a: any, idx: number) => (
          <li key={idx} style={{ fontWeight: 500, fontSize: 15, marginBottom: 8, display: 'flex', alignItems: 'center', opacity: approved.has(a.id) ? 0.5 : 1 }}>
            <span style={{ marginRight: 8 }}>✔️</span>{a.action}
            {!approved.has(a.id) && (
              <button
                onClick={() => handleApprove(a.id)}
                style={{ marginLeft: 16, padding: '4px 12px', borderRadius: 5, border: 'none', background: '#28A745', color: '#fff', fontWeight: 500, cursor: 'pointer' }}
              >
                Approve
              </button>
            )}
            {approved.has(a.id) && (
              <span style={{ marginLeft: 10, color: '#28A745', fontWeight: 600 }}>Approved</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Enhanced PatientFlowPanel with TrendChart and BedUtilizationChart ---
const PatientFlowPanel = () => {
  const [data, setData] = useState<any>(null);
  const [trendData, setTrendData] = useState<TrendChartPoint[]>([]);
  const [bedDetails, setBedDetails] = useState<{ facility: string; value: number }[]>([]);
  useEffect(() => {
    setData(getPatientFlowData());
    setTrendData(generateTrendChartData());
    setBedDetails(generateBedUtilizationDetails());
    const interval = setInterval(() => {
      setData(getPatientFlowData());
      setTrendData(generateTrendChartData());
      setBedDetails(generateBedUtilizationDetails());
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  if (!data) return <div style={{height:120,marginBottom:16}}>Loading...</div>;
  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: 18, marginBottom: 16, boxShadow: '0 1px 4px #eee', minWidth: 320 }}>
      <h3 style={{ color: '#2791D3', marginBottom: 10 }}>Patient Flow (Last 7 Days)</h3>
      <div style={{ display: 'flex', gap: 18 }}>
        <div>
          <strong>Admissions:</strong>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {data.admissions.map((item: any, idx: number) => (
              <li key={idx}>{item.date}: <b>{item.value}</b></li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Discharges:</strong>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {data.discharges.map((item: any, idx: number) => (
              <li key={idx}>{item.date}: <b>{item.value}</b></li>
            ))}
          </ul>
        </div>
      </div>
      {/* Predictive trend chart for patient flow */}
      <TrendChart data={trendData} title="Admissions & Forecast" yLabel="Patients" />
      {/* Interactive bed utilization graphic */}
      <BedUtilizationChart utilization={data.bedUtilization} details={bedDetails} />
    </div>
  );
};

// --- Enhanced SustainabilityPanel with chart ---
const SustainabilityPanel = () => {
  const [data, setData] = useState<any>(null);
  const [chartData, setChartData] = useState<SustainabilityChartPoint[]>([]);
  useEffect(() => {
    setData(getSustainabilityData());
    setChartData(generateSustainabilityChartData());
    const interval = setInterval(() => {
      setData(getSustainabilityData());
      setChartData(generateSustainabilityChartData());
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  if (!data) return <div style={{height:120,marginBottom:16}}>Loading...</div>;
  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: 18, marginBottom: 16, boxShadow: '0 1px 4px #eee', minWidth: 320 }}>
      <h3 style={{ color: '#28A745', marginBottom: 10 }}>Sustainability Metrics</h3>
      <div style={{ display: 'flex', gap: 16 }}>
        <div>
          <strong>Carbon Emissions (tCO₂e):</strong>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {data.carbon.map((item: any, idx: number) => (
              <li key={idx}>{item.month}: <b>{item.value}</b></li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Medication Waste (kg):</strong>
          <div style={{ fontSize: 18 }}>{data.waste}</div>
        </div>
        <div>
          <strong>Cold Chain Efficiency:</strong>
          <div style={{ fontSize: 18 }}>{data.coldChainEfficiency}%</div>
        </div>
      </div>
      {/* Sustainability impact chart with baseline */}
      <SustainabilityChart data={chartData} title="Carbon Emissions vs Baseline" yLabel="tCO₂e" />
    </div>
  );
};

// --- Enhanced Health Trends tab with GeoHealthMap ---
const HealthTrendsPanel = () => {
  const [geoData, setGeoData] = React.useState<{ district: string; value: number }[] | null>(null);
  React.useEffect(() => {
    setGeoData(null); // Reset to loading
    const timeout = setTimeout(() => {
      setGeoData(generateGeoHealthData());
    }, 0);
    const interval = setInterval(() => setGeoData(generateGeoHealthData()), 30000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);
  if (!geoData) return <div style={{ minHeight: 220, background: '#fff', borderRadius: 10, marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>Loading map...</div>;
  return (
    <GeoHealthMap data={geoData} title="Disease Incidence by District" />
  );
};

const StaffingPanel = () => {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    setData(getStaffingData());
    const interval = setInterval(() => setData(getStaffingData()), 30000);
    return () => clearInterval(interval);
  }, []);
  if (!data) return <div style={{height:80,marginBottom:16}}>Loading...</div>;
  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: 18, marginBottom: 16, boxShadow: '0 1px 4px #eee', minWidth: 320 }}>
      <h3 style={{ color: '#FFC107', marginBottom: 10 }}>Staffing Overview</h3>
      <div style={{ display: 'flex', gap: 18 }}>
        <div><strong>Required:</strong> {data.required}</div>
        <div><strong>Available:</strong> {data.available}</div>
        <div><strong>Shortage:</strong> <span style={{ color: data.shortage > 0 ? '#c00' : '#28A745', fontWeight: 600 }}>{data.shortage}</span></div>
      </div>
    </div>
  );
};

// --- Actionable Staffing Overview Chart ---
const StaffingOverviewPanel = () => {
  const [staffing, setStaffing] = useState<{
    month: string;
    required: number;
    actual: number;
    predicted: number;
    shortage: number;
    overage: number;
  }[]>([]);
  useEffect(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = months.map((m, idx) => {
      const required = 120 + Math.floor(Math.random() * 8); // optimal
      const actual = required + Math.floor(Math.random() * 18 - 9); // +/- 9
      const predicted = required + Math.floor(Math.random() * 18 - 9); // +/- 9
      return {
        month: m,
        required,
        actual,
        predicted,
        shortage: Math.max(0, required - actual),
        overage: Math.max(0, actual - required)
      };
    });
    setStaffing(data);
    const interval = setInterval(() => {
      const data = months.map((m, idx) => {
        const required = 120 + Math.floor(Math.random() * 8);
        const actual = required + Math.floor(Math.random() * 18 - 9);
        const predicted = required + Math.floor(Math.random() * 18 - 9);
        return {
          month: m,
          required,
          actual,
          predicted,
          shortage: Math.max(0, required - actual),
          overage: Math.max(0, actual - required)
        };
      });
      setStaffing(data);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Find periods of shortage/overage for summary
  const criticals = staffing.filter(s => s.shortage > 5 || s.overage > 5);

  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: 18, marginBottom: 18, boxShadow: '0 1px 4px #eee', minWidth: 600, maxWidth: '100%' }}>
      <h3 style={{ marginBottom: 8, color: '#7b1fa2' }}>Staffing Overview</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={staffing} margin={{ top: 18, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="required" stroke="#888" strokeWidth={2} dot={false} name="Required" />
          <Line type="monotone" dataKey="actual" stroke="#2791D3" strokeWidth={2} dot={false} name="Actual" />
          <Line type="monotone" dataKey="predicted" stroke="#FFC107" strokeWidth={2} dot={false} name="Predicted" />
          {/* Understaffing area */}
          {staffing.map((s, i) => s.shortage > 0 && (
            <ReferenceLine key={i} x={s.month} stroke="#c00" strokeDasharray="2 2" label={{ value: 'Shortage', fill: '#c00', fontSize: 11, position: 'top' }} />
          ))}
          {/* Overstaffing area */}
          {staffing.map((s, i) => s.overage > 0 && (
            <ReferenceLine key={i+100} x={s.month} stroke="#28A745" strokeDasharray="2 2" label={{ value: 'Over', fill: '#28A745', fontSize: 11, position: 'top' }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {/* Insightful summary */}
      {criticals.length > 0 && (
        <div style={{ marginTop: 10, fontSize: 14 }}>
          <strong>Alerts:</strong>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {criticals.map((s, idx) => (
              <li key={idx} style={{ color: s.shortage > 0 ? '#c00' : '#28A745', fontWeight: 600 }}>
                {s.month}: {s.shortage > 0 ? `Understaffed by ${s.shortage}` : `Overstaffed by ${s.overage}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const roleOptions = [
  'Operations Manager',
  'Supply Chain Director',
  'Clinical Staff',
  'Pharmacy Leader',
  'Sustainability Officer',
  'Executive'
];

// --- Tab options with icons ---
const tabOptions = [
  { label: 'Overview', icon: '📊' },
  { label: 'Health Trends', icon: '📈' },
  { label: 'Patient Flow', icon: '🏥' },
  { label: 'Supply Chain', icon: '🚚' },
  { label: 'Sustainability', icon: '🌱' },
  { label: 'Staffing', icon: '👥' },
  { label: 'Alerts', icon: '🚨' },
  { label: 'Action Planning', icon: '📝' }
];

// --- Chart context wiring for Alert drill-down ---
const ALERT_METRIC_TO_TAB: Record<string, string> = {
  'Bed Occupancy': 'Patient Flow',
  'Medication Stock': 'Supply Chain',
  'Cold Chain Efficiency': 'Sustainability',
  'Staffing Level': 'Staffing',
  'System Uptime': 'IT',
};

// --- Sidebar navigation ---
const SidebarNav: React.FC<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
}> = ({ activeTab, setActiveTab }) => (
  <nav style={{
    width: 200,
    minWidth: 160,
    background: '#f7fafd',
    borderRight: '1px solid #e3e6ea',
    padding: '36px 0 0 0',
    height: '100vh',
    position: 'sticky',
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    zIndex: 10
  }}>
    {tabOptions.map(tab => (
      <button
        key={tab.label}
        onClick={() => setActiveTab(tab.label)}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '16px 28px',
          background: activeTab === tab.label ? '#2791D3' : 'transparent',
          color: activeTab === tab.label ? '#fff' : '#222',
          border: 'none',
          borderLeft: activeTab === tab.label ? '6px solid #1976d2' : '6px solid transparent',
          fontWeight: activeTab === tab.label ? 700 : 500,
          fontSize: 17,
          textAlign: 'left',
          cursor: 'pointer',
          outline: 'none',
          transition: 'background 0.2s, color 0.2s'
        }}
      >
        <span style={{ fontSize: 22, marginRight: 14 }}>{tab.icon}</span>
        {tab.label}
      </button>
    ))}
  </nav>
);

import ActionPlanningBoard from './ActionPlanningBoard';
import ChatbotSidebar from './ChatbotSidebar';

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [district, setDistrict] = useState('All');
  const [activeTab, setActiveTab] = useState('Overview');
  const [role, setRole] = useState(roleOptions[0]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);

  // Handle custom navigation events from child components
  useEffect(() => {
    function handleNavigate(e: Event) {
      const detail = (e as CustomEvent).detail;
      console.log('[Dashboard] Received dashboard-navigate event', detail);
      if (hydrated && detail?.tab) {
        setActiveTab(detail.tab);
        // Wait for the DOM to update with the new tab content
        setTimeout(() => {
          if (detail.scrollTo) {
            let attempts = 0;
            const maxAttempts = 10;
            const tryScroll = () => {
              const el = document.getElementById(detail.scrollTo);
              console.log('[Dashboard] Attempting scroll to', detail.scrollTo, 'found:', !!el);
              if (el) {
                const yOffset = -72; // header height offset
                const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
              } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(tryScroll, 100);
              }
            };
            tryScroll();
          }
        }, 100);
      }
    }
    window.addEventListener('dashboard-navigate', handleNavigate as EventListener);
    return () => window.removeEventListener('dashboard-navigate', handleNavigate as EventListener);
  }, [hydrated]);

  return (
    <div style={{ width: '100vw', minHeight: '100vh', overflowX: 'hidden' }}>
      <Header timeRange={timeRange} setTimeRange={setTimeRange} district={district} setDistrict={setDistrict} />
      <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%', margin: 0, padding: 0 }}>
        <div style={{
          position: 'fixed',
          top: 72, // header height in px
          left: 0,
          width: 200, // match SidebarNav width
          height: 'calc(100vh - 72px)',
          zIndex: 100,
          background: '#f7fafd',
          borderRight: '1px solid #e3e6ea',
          overflowY: 'auto',
          minHeight: 0,
          flexShrink: 0,
        }}>
          <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div style={{ flex: 1, minHeight: 'calc(100vh - 72px)', padding: '32px 40px 40px 40px', background: '#f4f7fa', margin: 0, marginTop: 72, marginLeft: 200, marginRight: 340, transition: 'margin-right 0.2s' }}>
          {/* Tab content rendering as before */}
          {activeTab === 'Overview' && (
            <>
              {/* StatusCards full width on top */}
              <div style={{ width: '100%', marginBottom: 28 }}>
                <StatusCards />
              </div>
              {/* 2-column grid for paired cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
                {/* Row 1: Admissions & Forecast | Bed Utilization */}
                <TrendChart data={generateTrendChartData()} title="Admissions & Forecast" yLabel="Patients" />
                <BedUtilizationChart utilization={getPatientFlowData().bedUtilization} details={generateBedUtilizationDetails()} />
                {/* Row 2: Recommended Actions | Disease Incidence by District */}
                <RecommendedActions />
                <GeoHealthMap data={generateGeoHealthData()} title="Disease Incidence by District" />
                {/* Row 3: Sustainability Chart | Staffing Overview Panel */}
                <SustainabilityChart data={generateSustainabilityChartData()} title="Carbon Emissions vs Baseline" yLabel="tCO₂e" />
                <StaffingOverviewPanel />
              </div>
              {/* Critical Alerts full width below */}
              <div style={{ width: '100%', marginBottom: 28 }}>
                <CriticalAlerts />
              </div>
            </>
          )}
          {activeTab === 'Health Trends' && (
            <>
              <HealthTrendCard timeRange={timeRange} district={district} />
              <SocialMediaCard timeRange={timeRange} district={district} />
              <HealthTrendsPanel />
            </>
          )}
          {activeTab === 'Patient Flow' && (
            <>
              <PatientFlowPanel />
            </>
          )}
          {activeTab === 'Supply Chain' && (
            <>
              <div id="MedicationStock-chart">
                <InventoryCard timeRange={timeRange} district={district} />
              </div>
              <MetricsCard timeRange={timeRange} district={district} />
              <GeoMapCard />
            </>
          )}
          {activeTab === 'Sustainability' && (
            <>
              <SustainabilityPanel />
              <StaffingPanel />
            </>
          )}
          {/* New Tabs: Staffing, Alerts, Action Planning */}
          {activeTab === 'Staffing' && (
            <div style={{ marginTop: 32 }}>
              <div id="StaffingLevel-chart">
                <StaffingOverviewPanel />
              </div>
            </div>
          )}
          {activeTab === 'Alerts' && (
            <div style={{ marginTop: 32 }}>
              <CriticalAlerts />
              {/* You can aggregate other alerts here as needed */}
            </div>
          )}
          {activeTab === 'Action Planning' && (
            <div style={{ marginTop: 32 }}>
              <ActionPlanningBoard />
            </div>
          )}
          {activeTab === 'IT' && (
            <div style={{ marginTop: 32 }}>
              <div id="SystemUptime-chart">
                {/* Insert relevant IT chart here */}
                <div style={{ background: '#fff', padding: 32, borderRadius: 12, textAlign: 'center', color: '#888' }}>System Uptime Chart Placeholder</div>
              </div>
            </div>
          )}
          {activeTab === 'Patient Flow' && (
            <div style={{ marginTop: 32 }}>
              <div id="BedOccupancy-chart">
                <BedUtilizationChart utilization={getPatientFlowData().bedUtilization} details={generateBedUtilizationDetails()} />
              </div>
            </div>
          )}
          {activeTab === 'Supply Chain' && (
            <div style={{ marginTop: 32 }}>
              <div id="MedicationStock-chart">
                {/* Insert relevant supply chain chart here */}
                <InventoryCard timeRange={timeRange} district={district} />
              </div>
            </div>
          )}
          {activeTab === 'Sustainability' && (
            <div style={{ marginTop: 32 }}>
              <div id="ColdChainEfficiency-chart">
                <SustainabilityPanel />
              </div>
            </div>
          )}
        </div>
        <ChatbotSidebar />
      </div>
    </div>
  );
};

export default Dashboard;
