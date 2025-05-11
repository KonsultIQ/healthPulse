import React, { useState } from 'react';

const ChatbotSidebar: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [botBuffer, setBotBuffer] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const sendMessage = async (retryCount = 0, maxRetries = 3) => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setBotBuffer('');
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/completion', {
        method: 'POST',
        body: JSON.stringify({ text: input }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 0) {
          throw new Error('CORS error: Could not connect to the backend. Check if the server is running and CORS is enabled.');
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setBotBuffer(fullText); 
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: fullText }]);
      setBotBuffer('');
    } catch (err: any) {
      if (retryCount < maxRetries && err.message.includes('CORS')) {
        setTimeout(() => sendMessage(retryCount + 1, maxRetries), 1000);
        return;
      }
      const errorMessage = err.message.includes('CORS')
        ? 'Could not connect to the backend. Please ensure the server is running at http://localhost:8000 and CORS is enabled.'
        : `Failed to fetch response: ${err.message}`;
      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: `Error: ${errorMessage}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside
      style={{
        position: 'fixed',
        top: 72,
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
      <div
        style={{
          padding: '18px 20px',
          borderBottom: '1px solid #e3e6ea',
          background: '#f7fafd',
          fontWeight: 700,
          fontSize: 18,
        }}
      >
        🩺 Healthcare Assistant
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
          fontSize: 15,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: 10,
              color: msg.sender === 'user' ? '#222' : '#0074D9',
            }}
          >
            <b>{msg.sender === 'user' ? 'You' : 'Assistant'}:</b> {msg.text}
          </div>
        ))}
        {botBuffer && (
          <div style={{ color: '#0074D9', marginBottom: 10 }}>
            <b>Assistant:</b> {botBuffer}
            <span style={{ animation: 'blink 1s step-end infinite' }}>|</span>
          </div>
        )}
        {isLoading && !botBuffer && (
          <div style={{ color: '#0074D9', marginBottom: 10 }}>
            <b>Assistant:</b> Processing...
          </div>
        )}
        {error && (
          <div style={{ color: '#DC3545', marginBottom: 10 }}>
            <b>Error:</b> {error}
            <button
              onClick={() => sendMessage()}
              style={{ marginLeft: 10, color: '#0074D9', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Retry
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          padding: 12,
          borderTop: '1px solid #e3e6ea',
          background: '#fafbfc',
        }}
      >
        <input
          type="text"
          value={input}
          placeholder="Ask about FluVax inventory or predictions..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          style={{
            width: '100%',
            padding: 10,
            borderRadius: 6,
            border: '1px solid #e3e6ea',
            fontSize: 15,
          }}
          disabled={isLoading}
        />
      </div>

      {/* Inline CSS for blinking cursor */}
      <style>
        {`
          @keyframes blink {
            50% { opacity: 0; }
          }
        `}
      </style>
    </aside>
  );
};

export default ChatbotSidebar;