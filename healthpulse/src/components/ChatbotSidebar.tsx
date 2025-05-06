import React from 'react';

const ChatbotSidebar: React.FC = () => {
  return (
    <aside
      style={{
        position: 'fixed',
        top: 72, // header height
        right: 0,
        width: 340,
        height: 'calc(100vh - 72px)',
        background: '#fff',
        borderLeft: '1px solid #e3e6ea',
        boxShadow: '0 0 12px #e3e6ea',
        zIndex: 105,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '18px 20px', borderBottom: '1px solid #e3e6ea', background: '#f7fafd', fontWeight: 700, fontSize: 18 }}>
        🩺 Feel The Pulse...
      </div>
      {/* Placeholder for chatbot UI */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, color: '#888', fontSize: 15 }}>
        <div style={{ marginBottom: 18 }}>
          <b>General View</b><br />
          Use this assistant for semantic search and conversation about your dashboard data.
        </div>
        <div style={{ color: '#bbb', fontStyle: 'italic' }}>
          (Chatbot UI coming soon...)
        </div>
      </div>
      <div style={{ padding: 12, borderTop: '1px solid #e3e6ea', background: '#fafbfc' }}>
        <input
          type="text"
          placeholder="Type a message..."
          style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e3e6ea', fontSize: 15 }}
          disabled
        />
      </div>
    </aside>
  );
};

export default ChatbotSidebar;
