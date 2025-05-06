import React, { useState, useEffect } from 'react';

// --- Types ---
type ActionFeedback = {
  rating: number;
  comment: string;
};
type ActionMetrics = {
  before: string;
  after: string;
  metric: string;
};
type Action = {
  id: number;
  title: string;
  reason: string;
  urgency: string;
  proposedBy: string;
  approvedBy: string | null;
  status: string;
  notes: string;
  feedback?: ActionFeedback | null;
  metrics?: ActionMetrics | null;
};

const STATUS_COLUMNS = [
  { key: 'proposed', label: 'Proposed', color: '#1976d2' },
  { key: 'in_progress', label: 'In Progress', color: '#FFC107' },
  { key: 'completed', label: 'Completed', color: '#28A745' },
  { key: 'blocked', label: 'Blocked', color: '#c00' }
];

const TEMPLATES = [
  {
    title: 'Flu Surge Response Plan',
    reason: 'Spike in flu admissions detected',
    urgency: 'High',
    proposedBy: 'Playbook',
  },
  {
    title: 'Supply Shortage Protocol',
    reason: 'Critical supply below threshold',
    urgency: 'Critical',
    proposedBy: 'Playbook',
  },
  {
    title: 'Heatwave Community Outreach',
    reason: 'High temperatures forecasted',
    urgency: 'Medium',
    proposedBy: 'Playbook',
  }
];

const MOCK_ACTIONS: Action[] = [
  {
    id: 1,
    title: 'Increase ER Staffing',
    reason: 'Predicted shortage next week',
    urgency: 'High',
    proposedBy: 'AI System',
    approvedBy: null,
    status: 'proposed',
    notes: '',
    feedback: null,
    metrics: null,
  },
  {
    id: 2,
    title: 'Order Extra Flu Vaccine',
    reason: 'Flu cases rising, supply at 25%',
    urgency: 'Medium',
    proposedBy: 'Supply Chain Bot',
    approvedBy: 'Ops Manager',
    status: 'in_progress',
    notes: 'Order placed, ETA 3 days',
    feedback: null,
    metrics: null,
  },
  {
    id: 3,
    title: 'Launch Heatwave Awareness',
    reason: 'Forecasted temperature spike',
    urgency: 'Low',
    proposedBy: 'AI System',
    approvedBy: null,
    status: 'proposed',
    notes: '',
    feedback: null,
    metrics: null,
  },
  {
    id: 4,
    title: 'Reduce HVAC Usage',
    reason: 'Carbon emissions above baseline',
    urgency: 'Medium',
    proposedBy: 'Sustainability Bot',
    approvedBy: 'Sustainability Officer',
    status: 'completed',
    notes: 'Implemented 2 weeks ago',
    feedback: null,
    metrics: { before: '2.1 tCO₂e/day', after: '1.7 tCO₂e/day', metric: 'Carbon Emissions' },
  },
  {
    id: 5,
    title: 'Resolve Pharmacy System Outage',
    reason: 'System down, impacting med orders',
    urgency: 'Critical',
    proposedBy: 'IT Bot',
    approvedBy: null,
    status: 'blocked',
    notes: 'Waiting for vendor response',
    feedback: null,
    metrics: null,
  },
  {
    id: 6,
    title: 'Optimize Bed Occupancy',
    reason: 'Bed occupancy above 95%',
    urgency: 'High',
    proposedBy: 'AI System',
    approvedBy: 'Ops Manager',
    status: 'completed',
    notes: 'Discharge planning improved',
    feedback: null,
    metrics: { before: '97%', after: '83%', metric: 'Bed Occupancy' },
  }
];

const getStatusColor = (status: string) => {
  const col = STATUS_COLUMNS.find(c => c.key === status);
  return col ? col.color : '#888';
};

const ActionPlanningBoard: React.FC = () => {
  const [actions, setActions] = useState<Action[]>(MOCK_ACTIONS);
  const [showTemplates, setShowTemplates] = useState(false);
  const [nextId, setNextId] = useState(7);

  // Listen for "add-action-from-alert" event
  useEffect(() => {
    function handleAddActionFromAlert(e: Event) {
      const customEvent = e as CustomEvent;
      const alert = customEvent.detail;
      if (!alert) return;
      setActions(prev => [
        {
          id: nextId,
          title: alert.suggestedAction || alert.message || 'Action from Alert',
          reason: alert.message || '',
          urgency: alert.severity === 'critical' ? 'Critical' : 'High',
          proposedBy: 'Alert System',
          approvedBy: null,
          status: 'proposed',
          notes: alert.context || '',
          feedback: null,
          metrics: alert.metric && alert.value !== undefined && alert.threshold !== undefined ? {
            before: `${alert.value}`,
            after: `${alert.threshold}`,
            metric: alert.metric
          } : null,
        },
        ...prev
      ]);
      setNextId(id => id + 1);
    }
    window.addEventListener('add-action-from-alert', handleAddActionFromAlert);
    return () => {
      window.removeEventListener('add-action-from-alert', handleAddActionFromAlert);
    };
  }, [nextId]);

  // Move action to a new status
  const moveAction = (id: number, newStatus: string) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  // Add note/comment
  const addNote = (id: number, note: string) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, notes: note } : a));
  };

  // Approve action
  const approveAction = (id: number) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, approvedBy: 'You', status: 'in_progress' } : a));
  };

  // Reject action
  const rejectAction = (id: number) => {
    setActions(prev => prev.filter(a => a.id !== id));
  };

  // Delegate action (for demo, just add note)
  const delegateAction = (id: number) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, notes: (a.notes ? a.notes + '\n' : '') + 'Delegated to another user.' } : a));
  };

  // Feedback: set rating and comment
  const setFeedback = (id: number, rating: number, comment: string) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, feedback: { rating, comment } } : a));
  };

  // Add action from template
  const addFromTemplate = (template: any) => {
    setActions(prev => [
      {
        id: nextId,
        title: template.title,
        reason: template.reason,
        urgency: template.urgency,
        proposedBy: template.proposedBy,
        approvedBy: null,
        status: 'proposed',
        notes: '',
        feedback: null,
        metrics: null,
      },
      ...prev
    ]);
    setNextId(id => id + 1);
    setShowTemplates(false);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Templates & Playbooks Button */}
      <button
        style={{ marginBottom: 18, padding: '6px 18px', borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
        onClick={() => setShowTemplates(true)}
      >
        Templates & Playbooks
      </button>
      {/* Templates Modal */}
      {showTemplates && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}
          onClick={() => setShowTemplates(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            style={{ background: '#fff', borderRadius: 10, padding: 28, minWidth: 340, boxShadow: '0 2px 12px #aaa', position: 'relative' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowTemplates(false)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                fontSize: 20,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#888',
                fontWeight: 700
              }}
            >
              ×
            </button>
            <h3 style={{ marginBottom: 16, color: '#1976d2' }}>Quick-Action Templates</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {TEMPLATES.map((tpl, idx) => (
                <li key={idx} style={{ marginBottom: 14 }}>
                  <button
                    style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #1976d2', background: '#f4f7fa', color: '#1976d2', fontWeight: 600, cursor: 'pointer', fontSize: 15, width: '100%', textAlign: 'left' }}
                    onClick={() => addFromTemplate(tpl)}
                  >
                    <div style={{ fontWeight: 700, marginBottom: 2 }}>{tpl.title}</div>
                    <div style={{ fontSize: 13, color: '#555' }}>{tpl.reason}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>Urgency: {tpl.urgency}</div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 24, width: '100%', overflowX: 'auto', minHeight: 340 }}>
        {STATUS_COLUMNS.map(col => (
          <div key={col.key} style={{ flex: 1, minWidth: 260, maxWidth: 340, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 12, color: col.color, letterSpacing: 1 }}>{col.label}</div>
            <div style={{ background: '#f6fafd', borderRadius: 10, minHeight: 220, padding: 8, boxShadow: '0 1px 3px #e3e6ea', overflowY: 'auto', maxHeight: 520 }}>
              {actions.filter(a => a.status === col.key).map(action => (
                <div key={action.id} style={{ background: '#fff', borderRadius: 8, marginBottom: 16, padding: 16, boxShadow: '0 1px 4px #eee', borderLeft: `5px solid ${getStatusColor(action.status)}`, wordBreak: 'break-word', overflow: 'hidden' }}>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{action.title}</div>
                  <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>{action.reason}</div>
                  <div style={{ fontSize: 13, marginBottom: 8 }}>
                    <span style={{ fontWeight: 500, color: '#888', marginRight: 8 }}>Urgency:</span>
                    <span style={{ color: action.urgency === 'Critical' ? '#c00' : action.urgency === 'High' ? '#d97706' : '#1976d2', fontWeight: 600 }}>{action.urgency}</span>
                  </div>
                  <div style={{ fontSize: 13, marginBottom: 4 }}>
                    <span style={{ color: '#888' }}>Proposed by:</span> {action.proposedBy}
                  </div>
                  {action.approvedBy && (
                    <div style={{ fontSize: 13, marginBottom: 4 }}>
                      <span style={{ color: '#888' }}>Approved by:</span> {action.approvedBy}
                    </div>
                  )}
                  <textarea
                    style={{ width: '100%', minHeight: 38, borderRadius: 6, border: '1px solid #e3e6ea', marginTop: 8, fontSize: 13, padding: 6, resize: 'vertical', boxSizing: 'border-box' }}
                    placeholder="Add note/comment..."
                    value={action.notes}
                    onChange={e => addNote(action.id, e.target.value)}
                  />
                  {/* Impact Feedback Loop for completed actions */}
                  {col.key === 'completed' && (
                    <div style={{ marginTop: 12, background: '#f7fafd', borderRadius: 8, padding: 10, border: '1px solid #e3e6ea' }}>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: '#1976d2' }}>Impact Feedback</div>
                      {action.metrics && (
                        <div style={{ fontSize: 13, color: '#444', marginBottom: 6 }}>
                          <span style={{ fontWeight: 500 }}>{action.metrics.metric}:</span>{' '}
                          <span style={{ color: '#c00', fontWeight: 600 }}>Before: {action.metrics.before}</span>{' → '}
                          <span style={{ color: '#28A745', fontWeight: 600 }}>After: {action.metrics.after}</span>
                        </div>
                      )}
                      {!action.feedback ? (
                        <>
                          <div style={{ fontSize: 13, marginBottom: 6 }}>How effective was this action?</div>
                          <select
                            style={{ padding: '4px 10px', borderRadius: 5, border: '1px solid #e3e6ea', marginBottom: 6 }}
                            defaultValue=""
                            onChange={e => setFeedback(action.id, parseInt(e.target.value), action.feedback?.comment || '')}
                          >
                            <option value="" disabled>Rate effectiveness</option>
                            <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                            <option value={4}>⭐⭐⭐⭐ Good</option>
                            <option value={3}>⭐⭐⭐ Fair</option>
                            <option value={2}>⭐⭐ Poor</option>
                            <option value={1}>⭐ Ineffective</option>
                          </select>
                          <textarea
                            style={{ width: '100%', minHeight: 32, borderRadius: 5, border: '1px solid #e3e6ea', fontSize: 13, padding: 5, marginBottom: 6 }}
                            placeholder="Add feedback..."
                            value={action.feedback?.comment || ''}
                            onChange={e => setFeedback(action.id, action.feedback?.rating || 0, e.target.value)}
                          />
                        </>
                      ) : (
                        <div style={{ fontSize: 13, color: '#28A745', marginTop: 6 }}>
                          <span style={{ fontWeight: 500 }}>Thank you for your feedback!</span><br/>
                          <span>Rating: {action.feedback.rating} / 5</span><br/>
                          <span>Comment: {action.feedback.comment}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                    {col.key === 'proposed' && (
                      <>
                        <button onClick={() => approveAction(action.id)} style={{ background: '#28A745', color: '#fff', border: 'none', borderRadius: 5, padding: '5px 12px', fontWeight: 600, cursor: 'pointer' }}>Approve</button>
                        <button onClick={() => rejectAction(action.id)} style={{ background: '#c00', color: '#fff', border: 'none', borderRadius: 5, padding: '5px 12px', fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                        <button onClick={() => delegateAction(action.id)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 5, padding: '5px 12px', fontWeight: 600, cursor: 'pointer' }}>Delegate</button>
                      </>
                    )}
                    {/* Move actions between columns */}
                    {STATUS_COLUMNS.filter(s => s.key !== col.key).map(s => (
                      <button key={s.key} onClick={() => moveAction(action.id, s.key)} style={{ background: s.color, color: '#fff', border: 'none', borderRadius: 5, padding: '5px 10px', fontWeight: 500, fontSize: 13, cursor: 'pointer', marginBottom: 4 }}>{s.label}</button>
                    ))}
                  </div>
                </div>
              ))}
              {actions.filter(a => a.status === col.key).length === 0 && (
                <div style={{ color: '#bbb', fontSize: 14, textAlign: 'center', marginTop: 40 }}>No actions</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionPlanningBoard;
