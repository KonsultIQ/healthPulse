import React from 'react';

const Header: React.FC<{
  timeRange: string;
  setTimeRange: (v: string) => void;
  district: string;
  setDistrict: (v: string) => void;
}> = ({ timeRange, setTimeRange, district, setDistrict }) => (
  <header>
    <div className="logo">
      <div className="logo-icon">HP</div>
      <h1>HealthPulse Dashboard</h1>
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
