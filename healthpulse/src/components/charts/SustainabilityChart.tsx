import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

export type SustainabilityChartPoint = {
  month: string;
  value: number;
  baseline?: number;
};

interface SustainabilityChartProps {
  data: SustainabilityChartPoint[];
  title: string;
  yLabel?: string;
}

const SustainabilityChart: React.FC<SustainabilityChartProps> = ({ data, title, yLabel }) => (
  <div style={{ background: '#fff', borderRadius: 10, padding: 18, marginBottom: 18, boxShadow: '0 1px 4px #eee' }}>
    <h3 style={{ marginBottom: 8 }}>{title}</h3>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 18, right: 24, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" fontSize={12} />
        <YAxis fontSize={12} label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft' } : undefined} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#28A745" strokeWidth={2} dot={false} name="Actual" />
        <Line type="monotone" dataKey="baseline" stroke="#888" strokeDasharray="4 4" strokeWidth={2} dot={false} name="Baseline" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default SustainabilityChart;
