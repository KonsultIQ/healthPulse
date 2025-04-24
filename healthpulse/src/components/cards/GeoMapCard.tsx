import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import ReactMarkdown from 'react-markdown';
import Modal from '../Modal';

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
  const [modalOpen, setModalOpen] = useState(false);

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
          Review latest prediction & recommendations
        </span>
        <div
          className="alert-tag"
          style={{background:'#c00',color:'#fff',fontWeight:700,borderRadius:6,marginLeft:10,display:'flex',alignItems:'center',justifyContent:'center',minWidth:90,minHeight:28,cursor:'pointer'}}
          onClick={() => setModalOpen(true)}
        >
          Review
        </div>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 style={{marginTop:0,fontWeight:700,fontSize:'1.2rem',textAlign:'center'}}>Latest Inference Data</h2>
        <div style={{overflowX:'auto',margin:'18px 0',maxHeight:'60vh',overflowY:'auto',borderRadius:8}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:15,background:'#fff',borderRadius:8,boxShadow:'0 1px 8px #0001'}}>
            <thead>
              <tr style={{background:'#f7f7fa'}}>
                <th style={{padding:'8px 12px',border:'1px solid #eee'}}>Date</th>
                <th style={{padding:'8px 12px',border:'1px solid #eee'}}>Region</th>
                <th style={{padding:'8px 12px',border:'1px solid #eee'}}>Hospital Flu Cases</th>
                <th style={{padding:'8px 12px',border:'1px solid #eee'}}>GP Flu Cases</th>
                <th style={{padding:'8px 12px',border:'1px solid #eee'}}>Hospital Respiratory Cases</th>
                <th style={{padding:'8px 12px',border:'1px solid #eee'}}>GP Respiratory Cases</th>
                <th style={{padding:'8px 12px',border:'1px solid #eee'}}>Flu Mentions</th>
                <th style={{padding:'8px 12px',border:'1px solid #eee'}}>Predicted Demand</th>
                <th style={{padding:'8px 12px',border:'1px solid #eee',minWidth:240}}>Interpretation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{padding:'8px 12px',border:'1px solid #eee',textAlign:'center'}}>{latest?.date}</td>
                <td style={{padding:'8px 12px',border:'1px solid #eee',textAlign:'center'}}>{latest?.region}</td>
                <td style={{padding:'8px 12px',border:'1px solid #eee',textAlign:'center'}}>{latest?.hospital_flu_cases}</td>
                <td style={{padding:'8px 12px',border:'1px solid #eee',textAlign:'center'}}>{latest?.gp_flu_cases}</td>
                <td style={{padding:'8px 12px',border:'1px solid #eee',textAlign:'center'}}>{latest?.hospital_respiratory_cases}</td>
                <td style={{padding:'8px 12px',border:'1px solid #eee',textAlign:'center'}}>{latest?.gp_respiratory_cases}</td>
                <td style={{padding:'8px 12px',border:'1px solid #eee',textAlign:'center'}}>{latest?.flu_mentions}</td>
                <td style={{padding:'8px 12px',border:'1px solid #eee',textAlign:'center',fontWeight:600,color:'#2791D3'}}>{latest?.predicted_demand}</td>
                <td style={{padding:'8px 12px',border:'1px solid #eee',minWidth:240,maxWidth:360,whiteSpace:'pre-line',background:'#f7fafd'}}>
                  <ReactMarkdown
                    components={{
                      h3: ({node, ...props}) => <h4 style={{fontSize:'1.07rem',fontWeight:700,margin:'6px 0 4px',color:'#2791D3'}} {...props} />,
                      strong: ({node, ...props}) => <strong style={{color:'#222',fontWeight:600}} {...props} />, 
                      ul: ({node, ...props}) => <ul style={{margin:'4px 0 4px 18px',padding:0,color:'#444'}} {...props} />, 
                      li: ({node, ...props}) => <li style={{marginBottom:2,paddingLeft:2}} {...props} />,
                      p: (props) => <p style={{margin:'4px 0'}}>{props.children}</p>,
                    }}
                  >
                    {latest?.interpretation || ''}
                  </ReactMarkdown>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button
          style={{display:'block',margin:'28px auto 0 auto',background:'#2791D3',color:'#fff',fontWeight:600,border:'none',borderRadius:5,padding:'10px 28px',fontSize:16,cursor:'pointer',boxShadow:'0 2px 8px #2791d344'}}
          onClick={() => setModalOpen(false)}
        >
          Review and Update
        </button>
      </Modal>
    </div>
  );
};

export default GeoMapCard;
