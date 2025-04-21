import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', visits: 120 },
  { name: 'Tue', visits: 98 },
  { name: 'Wed', visits: 110 },
  { name: 'Thu', visits: 150 },
  { name: 'Fri', visits: 87 },
  { name: 'Sat', visits: 99 },
  { name: 'Sun', visits: 130 },
];

const Chart: React.FC = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="visits" stroke="#8884d8" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

export default Chart;
