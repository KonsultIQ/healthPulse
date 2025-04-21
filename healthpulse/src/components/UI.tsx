import React from 'react';

export const Card: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <div style={{ background: '#fff', borderRadius: 8, padding: 20, margin: 8, boxShadow: '0 2px 8px #eee' }}>
    <h2 style={{ fontSize: 18, marginBottom: 12 }}>{title}</h2>
    <div>{children}</div>
  </div>
);

export const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>{children}</div>
);

export const Col: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ flex: 1 }}>{children}</div>
);
