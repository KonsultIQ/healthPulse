import React, { useEffect, useState } from 'react';

interface BedUtilizationChartProps {
  utilization?: number;
  details?: { facility: string; value: number }[];
}

const BedUtilizationChart: React.FC<BedUtilizationChartProps> = ({ utilization, details }) => {
  const [clientUtilization, setClientUtilization] = useState<number | undefined>(utilization);
  const [clientDetails, setClientDetails] = useState<{ facility: string; value: number }[]>(details || []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only generate random values on client after mount
    if (mounted) {
      if (utilization === undefined) {
        setClientUtilization(80 + Math.floor(Math.random() * 15));
      }
      if (!details || details.length === 0) {
        setClientDetails([
          { facility: 'Al Noor', value: 92 },
          { facility: 'City Hospital', value: 87 },
          { facility: 'Al Zahra', value: 78 },
          { facility: 'MedCare', value: 84 },
        ]);
      }
    }
  }, [utilization, details, mounted]);

  if (!mounted) return <div style={{ height: 80, marginBottom: 16 }}>Loading...</div>;

  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: 18, marginBottom: 18, boxShadow: '0 1px 4px #eee', minWidth: 320 }}>
      <h3 style={{ marginBottom: 8 }}>Bed Utilization</h3>
      <div style={{ fontSize: 26, fontWeight: 700, color: clientUtilization !== undefined && clientUtilization > 90 ? '#c00' : '#2791D3', marginBottom: 8 }}>
        {clientUtilization !== undefined ? `${clientUtilization}%` : 'Loading...'}
      </div>
      <div style={{ fontSize: 15, color: '#888', marginBottom: 6 }}>
        {clientUtilization !== undefined ? (clientUtilization > 90 ? 'Critical' : clientUtilization > 80 ? 'High' : 'Optimal') : 'Loading...'}
      </div>
      {clientDetails.length > 0 && (
        <div>
          <strong>By Facility:</strong>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 14 }}>
            {clientDetails.map((d, idx) => (
              <li key={idx}>{d.facility}: <b>{d.value}%</b></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BedUtilizationChart;
