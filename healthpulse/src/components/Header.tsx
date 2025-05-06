import React from 'react';

const Header: React.FC<{
  timeRange: string;
  setTimeRange: (v: string) => void;
  district: string;
  setDistrict: (v: string) => void;
}> = ({ timeRange, setTimeRange, district, setDistrict }) => (
  <header style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    zIndex: 110,
    background: '#fff',
    boxShadow: '0 2px 8px #eee',
    borderBottom: '1px solid #e3e6ea',
    minHeight: 72,
    display: 'flex',
    alignItems: 'center',
    padding: '0 32px',
    maxWidth: '100vw',
    boxSizing: 'border-box',
  }}>
    <div className="logo">
      <div className="logo-icon">HP</div>
      <h1>HealthPulse</h1>
    </div>
    <div className="dashboard-controls">
      <select
        id="timeRangeSelector"
        value={timeRange}
        onChange={e => setTimeRange(e.target.value)}
      >
        <option value="7d">Last 7 Days</option>
        <option value="30d">Last 30 Days</option>
        <option value="90d">Last 90 Days</option>
      </select>
      <select
        id="districtSelector"
        value={district}
        onChange={e => setDistrict(e.target.value)}
      >
        <option value="All">All Districts</option>
        <option value="Deira">Deira</option>
        <option value="Bur Dubai">Bur Dubai</option>
        <option value="Al Barsha">Al Barsha</option>
        <option value="Jumeirah">Jumeirah</option>
        <option value="Dubai Marina">Dubai Marina</option>
      </select>
    </div>
  </header>
);

export default Header;
