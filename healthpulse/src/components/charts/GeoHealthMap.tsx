import React from 'react';

interface DistrictData {
  district: string;
  value: number;
}

interface GeoHealthMapProps {
  data: DistrictData[];
  title?: string;
}

// For prototype: use a placeholder map image and overlay colored markers
const districtColors = [
  '#c00', '#FFC107', '#28A745', '#2791D3', '#888', '#ff9800', '#7b1fa2', '#009688', '#e91e63', '#607d8b', '#795548', '#00bcd4', '#8bc34a', '#f44336', '#3f51b5', '#9e9e9e', '#ffeb3b', '#ff5722', '#4caf50'
];

const GeoHealthMap: React.FC<GeoHealthMapProps> = ({ data, title }) => (
  <div style={{ background: '#fff', borderRadius: 10, padding: 18, marginBottom: 18, boxShadow: '0 1px 4px #eee', minWidth: 320 }}>
    <h3 style={{ marginBottom: 8 }}>{title || 'Health Trends by District'}</h3>
    <div style={{ position: 'relative', width: '100%', height: 220, background: '#f5f5f5', borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
      <img
        src={"/dubai_map_placeholder.png"}
        alt="Dubai Map"
        style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain', opacity: 0.95 }}
      />
      {data.map((d, idx) => (
        <div
          key={d.district}
          title={`${d.district}: ${d.value}`}
          style={{
            position: 'absolute',
            left: `${10 + (idx * 5) % 80}%`,
            top: `${15 + (idx * 7) % 70}%`,
            background: districtColors[idx % districtColors.length],
            color: '#fff',
            borderRadius: '50%',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 14,
            boxShadow: '0 2px 6px #aaa',
            cursor: 'pointer',
            opacity: 0.85,
          }}
        >
          {d.value}
        </div>
      ))}
    </div>
    <div style={{ fontSize: 13, color: '#888' }}>Hover markers for district values</div>
  </div>
);

export default GeoHealthMap;
