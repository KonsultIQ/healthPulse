import React from 'react';

interface SocialMediaHeatmapProps {
  districtCounts: Record<string, number>;
  onDistrictClick: (district: string) => void;
}

const DUBAI_DISTRICTS = [
  'Dubai Marina',
  'Jumeirah',
  'Deira',
  'Al Barsha',
  'Bur Dubai',
  'Business Bay',
  'Downtown Dubai',
  'Palm Jumeirah',
  'Al Qusais',
  'Mirdif',
];

// Adjusted coordinates for a 100% width x 200px height map
const DISTRICT_COORDS: Record<string, { left: string; top: string }> = {
  'Dubai Marina': { left: '23%', top: '58%' },
  'Jumeirah': { left: '28%', top: '45%' },
  'Deira': { left: '35%', top: '28%' },
  'Al Barsha': { left: '33%', top: '86%' },
  'Bur Dubai': { left: '54%', top: '58%' },
  'Business Bay': { left: '34%', top: '48%' },
  'Downtown Dubai': { left: '40%', top: '52%' },
  'Palm Jumeirah': { left: '20%', top: '50%' },
  'Al Qusais': { left: '37%', top: '20%' },
  'Mirdif': { left: '42%', top: '20%' },
};

const getHeatColor = (count: number) => {
  if (count >= 7) return 'rgba(255, 69, 0, 0.85)'; // red
  if (count >= 4) return 'rgba(255, 140, 0, 0.75)'; // orange
  if (count >= 2) return 'rgba(255, 215, 0, 0.65)'; // yellow
  if (count === 1) return 'rgba(39,145,211,0.5)'; // blue
  return 'rgba(180,180,180,0.15)'; // faint/gray
};

const SocialMediaHeatmap: React.FC<SocialMediaHeatmapProps> = ({ districtCounts, onDistrictClick }) => {
  // Make the container as tall as the image's natural height (auto height)
  return (
    <div style={{ position: 'relative', width: '100%', height: 300, background: '#f5f5f5', borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
      <img
        src={"/dubai_map_placeholder.png"}
        alt="Dubai Map"
        style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain', opacity: 0.95 }}
      />
      {DUBAI_DISTRICTS.map((district) => {
        const count = districtCounts[district] || 0;
        const coords = DISTRICT_COORDS[district];
        if (!coords) return null;
        return (
          <div
            key={district}
            title={`${district}: ${count} mentions`}
            onClick={() => count > 0 && onDistrictClick(district)}
            style={{
              position: 'absolute',
              left: coords.left,
              top: coords.top,
              transform: 'translate(-50%, -50%)',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: getHeatColor(count),
              border: count > 0 ? '2px solid #fff' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: count >= 4 ? '#fff' : '#333',
              fontWeight: 700,
              fontSize: 14,
              cursor: count > 0 ? 'pointer' : 'default',
              boxShadow: count > 0 ? '0 0 12px 4px rgba(255,69,0,0.18)' : undefined,
              opacity: count > 0 ? 1 : 0.6,
              transition: 'background 0.2s',
              zIndex: 2,
            }}
          >
            {count > 0 ? count : ''}
          </div>
        );
      })}
      {/* Legend */}
      <div style={{position:'absolute',right:8,bottom:8,background:'rgba(255,255,255,0.85)',borderRadius:6,padding:'4px 10px',fontSize:12,color:'#333',zIndex:3}}>
        <span style={{marginRight:8}}><span style={{display:'inline-block',width:12,height:12,background:'rgba(255,69,0,0.85)',borderRadius:3,marginRight:2}}></span>7+</span>
        <span style={{marginRight:8}}><span style={{display:'inline-block',width:12,height:12,background:'rgba(255,140,0,0.75)',borderRadius:3,marginRight:2}}></span>4-6</span>
        <span style={{marginRight:8}}><span style={{display:'inline-block',width:12,height:12,background:'rgba(255,215,0,0.65)',borderRadius:3,marginRight:2}}></span>2-3</span>
        <span><span style={{display:'inline-block',width:12,height:12,background:'rgba(39,145,211,0.5)',borderRadius:3,marginRight:2}}></span>1</span>
      </div>
    </div>
  );
};

export default SocialMediaHeatmap;
