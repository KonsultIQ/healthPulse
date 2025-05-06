import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

export type TrendChartPoint = {
  date: string;
  actual: number;
  predicted?: number;
};

interface TrendChartProps {
  data: TrendChartPoint[];
  title: string;
  yLabel?: string;
}

const TrendChart: React.FC<TrendChartProps> = ({ data, title, yLabel }) => (
  <div style={{ background: '#fff', borderRadius: 10, padding: 18, marginBottom: 18, boxShadow: '0 1px 4px #eee' }}>
    <h3 style={{ marginBottom: 8 }}>{title}</h3>
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 18, right: 24, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" fontSize={12} />
        <YAxis fontSize={12} label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft' } : undefined} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="actual" stroke="#2791D3" strokeWidth={2} dot={false} name="Actual" />
        <Line type="monotone" dataKey="predicted" stroke="#FFC107" strokeDasharray="4 4" strokeWidth={2} dot={false} name="Predicted" />
        <ReferenceLine x={data[data.length - 2]?.date} label="Now" stroke="#888" strokeDasharray="3 3" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default TrendChart;
