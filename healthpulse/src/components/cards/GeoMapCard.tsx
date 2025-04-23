import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import ReactMarkdown from 'react-markdown';

const CSV_PATH = '/agentic/inferences.csv';

type InferenceRow = {
  date: string;
  region: string;
  hospital_flu_cases: string;
  gp_flu_cases: string;
  hospital_respiratory_cases: string;
  gp_respiratory_cases: string;
  flu_mentions: string;
  predicted_demand: string;
  interpretation: string;
};

const GeoMapCard: React.FC = () => {
  const [latest, setLatest] = useState<InferenceRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(CSV_PATH)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.text();
      })
      .then(csvText => {
        const parsed = Papa.parse<InferenceRow>(csvText, { header: true, skipEmptyLines: true });
        if (!parsed.data || parsed.data.length === 0) {
          setLatest(null);
          setLoading(false);
          return;
        }
        // Find the row with the latest date
        const sorted = parsed.data.sort((a, b) => {
          if (!a.date || !b.date) return 0;
          return a.date > b.date ? -1 : 1;
        });
        setLatest(sorted[0]);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  let cardContent;
  if (loading) {
    cardContent = <div style={{textAlign:'center',color:'#888'}}>Loading recommendations...</div>;
  } else if (error) {
    cardContent = <div style={{color:'#c00',textAlign:'center'}}>Error loading prediction data.</div>;
  } else if (!latest) {
    cardContent = (
      <div style={{textAlign:'center',color:'#888',padding:'24px 0'}}>
        <div style={{fontSize:40,marginBottom:8}}>🧑‍⚕️</div>
        <div>No predictions yet—your proactive insights will appear here soon!</div>
      </div>
    );
  } else {
    // Remove extra carriage returns and excess blank lines
    let cleanedInterpretation = latest.interpretation
      .replace(/(\d+\.)\s*\n+/g, '$1 ') // number-dot
      .replace(/\n{2,}/g, '\n') // collapse multiple blank lines
      .replace(/\n\s*\n/g, '\n'); // remove whitespace-only lines
    cardContent = (
      <div style={{
        padding: '0 8px',
        maxHeight: 240,
        overflowY: 'auto',
        wordBreak: 'break-word',
        whiteSpace: 'pre-line',
        fontSize: 15,
        lineHeight: 1.65,
      }}>
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h2 style={{fontSize: '1.15rem', fontWeight: 700, margin: '10px 0 6px', color: '#2791D3'}} {...props} />, 
            h2: ({node, ...props}) => <h3 style={{fontSize: '1.05rem', fontWeight: 600, margin: '8px 0 4px', color: '#1976d2'}} {...props} />, 
            h3: ({node, ...props}) => <h4 style={{fontSize: '1.01rem', fontWeight: 600, margin: '7px 0 3px', color: '#1976d2'}} {...props} />, 
            strong: ({node, ...props}) => <strong style={{color: '#333', fontWeight: 600}} {...props} />, 
            ul: ({node, ...props}) => <ul style={{marginLeft: 16, marginBottom: 0, marginTop: 0, paddingLeft: 0, color: '#444'}} {...props} />, 
            ol: ({node, ...props}) => <ol style={{marginLeft: 16, marginBottom: 0, marginTop: 0, paddingLeft: 0, color: '#444'}} {...props} />, 
            li: ({node, ...props}) => <li style={{marginBottom: 1, paddingLeft: 2}} {...props} />, 
            blockquote: ({node, ...props}) => <blockquote style={{borderLeft: '3px solid #2791D3', margin: '6px 0', padding: '3px 10px', background: '#f2f7fa', color: '#1976d2'}} {...props} />, 
            p: (props) => {
              // Remove margin if next sibling is a list
              const style: React.CSSProperties = {margin: '1px 0'};
              // Remove bottom margin if this paragraph is immediately before a list
              // (ReactMarkdown does not provide sibling info, so we keep margin minimal)
              return <p style={style}>{props.children}</p>;
            },
            code: ({node, ...props}) => <code style={{background: '#f4f4f4', padding: '1px 4px', borderRadius: 3, fontSize: '0.97em'}} {...props} />, 
          }}
        >
          {cleanedInterpretation}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div className="dashboard-card" style={{minHeight: 340}}>
      <div className="card-header">
        <h2 className="card-title">Prediction & Recommendations</h2>
      </div>
      <div className="card-content" style={{padding: '12px 0'}}>
        {cardContent}
      </div>
      <div className="card-footer">
        <span style={{color:'#c00',fontWeight:600,display:'flex',alignItems:'center',gap:6}}>
          <span style={{fontSize:22,verticalAlign:'middle'}}>⚠️</span>
          Action Required: Review latest prediction & recommendations
        </span>
        <div className="alert-tag" style={{background:'#c00',color:'#fff',fontWeight:700,borderRadius:6,padding:'2px 10px',marginLeft:10}}>Review</div>
      </div>
    </div>
  );
};

export default GeoMapCard;
