import React, { useState } from 'react';
import Header from './Header';
import HealthTrendCard from './cards/HealthTrendCard';
import GeoMapCard from './cards/GeoMapCard';
import InventoryCard from './cards/InventoryCard';
import MetricsCard from './cards/MetricsCard';
import SocialMediaCard from './cards/SocialMediaCard';
import TemperatureImpactCard from './cards/TemperatureImpactCard';
import DiseaseDistributionCard from './cards/DiseaseDistributionCard';

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [district, setDistrict] = useState('All');

  return (
    <div className="dashboard-container">
      <Header
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        district={district}
        setDistrict={setDistrict}
      />
      <div className="dashboard-grid">
        <HealthTrendCard timeRange={timeRange} district={district} />
        <DiseaseDistributionCard timeRange={timeRange} district={district} />
        <GeoMapCard />
        <InventoryCard timeRange={timeRange} district={district} />
        <MetricsCard timeRange={timeRange} district={district} />
        <SocialMediaCard timeRange={timeRange} district={district} />
        <TemperatureImpactCard timeRange={timeRange} district={district} />
      </div>
    </div>
  );
};

export default Dashboard;
