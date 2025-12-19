
import React, { useState, useRef, useEffect } from 'react';
import '../App.css';

export default function Chat() {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: '🌞 Hello! I\'m your AI Solar Assistant for PowerWestJava. I can help you with:\n\n• Solar system sizing and costs\n• Investment opportunities\n• Energy savings calculations\n• West Java solar policies\n\nHow can I help you today?' 
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    // scroll to bottom whenever messages change
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const res = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (res.ok && data?.assistant) {
        setMessages((m) => [...m, data.assistant]);
      } else {
        const errMsg = data?.error || 'Unknown error from chat endpoint';
        setMessages((m) => [...m, { role: 'assistant', content: `❌ Error: ${errMsg}` }]);
      }
    } catch (err) {
      console.error('Chat request failed', err);
      setMessages((m) => [...m, { role: 'assistant', content: '❌ Network error. Please try again.' }]);
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const quickQuestions = [
    "How much solar panel do I need?",
    "What's the payback period?",
    "Best districts for solar in West Java?",
    "How to start investing in solar?"
  ];

  const askQuickQuestion = (question) => {
    setInput(question);
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)'
      }}>
        <h1 style={{ margin: 0, fontSize: '2rem' }}>🤖 AI Solar Assistant</h1>
        <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>Your expert guide to renewable energy in West Java</p>
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div style={{ 
          marginBottom: '20px',
          padding: '15px',
          background: '#f8f9fa',
          borderRadius: '10px',
          border: '1px solid #e9ecef'
        }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#2e7d32' }}>💡 Quick Questions:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => askQuickQuestion(q)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #2e7d32',
                  background: 'white',
                  color: '#2e7d32',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#2e7d32';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.color = '#2e7d32';
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div style={{ 
        border: '2px solid #e0e0e0', 
        borderRadius: '15px', 
        padding: '20px', 
        height: '60vh', 
        overflowY: 'auto',
        background: '#fafafa',
        marginBottom: '20px',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ 
            margin: '12px 0', 
            textAlign: m.role === 'user' ? 'right' : 'left',
            animation: 'fadeIn 0.3s ease-in'
          }}>
            <div style={{ 
              display: 'inline-block', 
              padding: '12px 16px', 
              borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', 
              background: m.role === 'user' ? 
                'linear-gradient(135deg, #2e7d32, #4caf50)' : 
                'white',
              color: m.role === 'user' ? 'white' : '#333',
              maxWidth: '75%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: m.role === 'user' ? 'none' : '1px solid #e0e0e0'
            }}>
              <div style={{ 
                whiteSpace: 'pre-wrap', 
                lineHeight: '1.5',
                fontSize: '0.95rem'
              }}>
                {m.content}
              </div>
              <div style={{ 
                fontSize: '0.7rem', 
                marginTop: '6px', 
                opacity: 0.7,
                textAlign: m.role === 'user' ? 'right' : 'left'
              }}>
                {m.role === 'user' ? 'You' : 'AI Assistant'}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div style={{ textAlign: 'left', margin: '12px 0' }}>
            <div style={{ 
              display: 'inline-block', 
              padding: '12px 16px', 
              borderRadius: '18px 18px 18px 4px',
              background: 'white',
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '8px', height: '8px', borderRadius: '50%', background: '#2e7d32',
                  animation: 'bounce 1.4s infinite ease-in-out'
                }}></div>
                <div style={{ 
                  width: '8px', height: '8px', borderRadius: '50%', background: '#2e7d32',
                  animation: 'bounce 1.4s infinite ease-in-out 0.2s'
                }}></div>
                <div style={{ 
                  width: '8px', height: '8px', borderRadius: '50%', background: '#2e7d32',
                  animation: 'bounce 1.4s infinite ease-in-out 0.4s'
                }}></div>
                <span style={{ color: '#666', fontSize: '0.85rem' }}>AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={endRef} />
      </div>

      {/* Input Section */}
{/* Input Section */}
    <div style={{ 
        display: 'flex', 
        gap: '15px',
        alignItems: 'flex-end', /* Align items to bottom */
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0'
    }}>
    <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Ask about solar sizing, payback, investments, or West Java solar policies..."
     style={{ 
      flex: 1, 
      minHeight: '60px', /* Increased height */
      maxHeight: '120px',
      resize: 'vertical', 
      padding: '15px 18px', /* Increased padding */
      border: '2px solid #e0e0e0',
      borderRadius: '25px', /* More rounded */
      fontSize: '1rem', /* Slightly larger font */
      fontFamily: 'inherit',
      lineHeight: '1.4',
      backgroundColor: 'transparent',
      color: '#666',
    }}
    onFocus={(e) => e.target.style.borderColor = '#2e7d32'}
    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
  />
  <button 
    className="btn" 
    onClick={send} 
    disabled={loading || !input.trim()} 
    style={{ 
      minWidth: '90px', /* Increased from 10px */
      width: '90px', /* Fixed width for consistency */
      height: '90px', /* Fixed height to match textarea minHeight */
      background: input.trim() ? 'linear-gradient(135deg, #2e7d32, #4caf50)' : '#ccc',
      border: 'none',
      borderRadius: '25px', /* More rounded to match textarea */
      color: 'white',
      fontWeight: 'bold',
      fontSize: '0.9rem', /* Slightly smaller text */
      cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    {loading ? '⏳' : '🚀 Send'}
  </button>
</div>

      {/* Footer Note */}
      <div style={{ 
        marginTop: '15px', 
        color: '#666', 
        fontSize: '0.85rem',
        textAlign: 'center',
        padding: '10px',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        💡 This AI assistant provides educational information. For official advice, consult certified solar professionals.
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
