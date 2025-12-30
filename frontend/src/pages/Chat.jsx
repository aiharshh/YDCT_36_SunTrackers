import React, { useState, useRef, useEffect } from 'react';
import '../styles/Chat.css';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "🌞 Hello! I'm your AI Solar Assistant for PowerWestJava. I can help you with:\n\n• Solar system sizing and costs\n• Investment opportunities\n• Energy savings calculations\n• West Java solar policies\n\nHow can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const boxRef = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    // Jangan auto-scroll pas pertama kali masuk halaman
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    // Auto-scroll hanya di dalam chatBox (bukan window)
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
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
    'How much solar panel do I need?',
    "What's the payback period?",
    'Best districts for solar in West Java?',
    'How to start investing in solar?',
  ];

  const askQuickQuestion = (q) => setInput(q);

  return (
    <div className="chatPage">
      <div className="chatHeader">
        <h1 className="chatHeaderTitle">🤖 AI Solar Assistant</h1>
        <p className="chatHeaderSub">Your expert guide to renewable energy in West Java</p>
      </div>

      {messages.length <= 1 && (
        <div className="chatQuick">
          <p className="chatQuickTitle">💡 Quick Questions:</p>
          <div className="chatQuickGrid">
            {quickQuestions.map((q, i) => (
              <button key={i} type="button" className="chatPill" onClick={() => askQuickQuestion(q)}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PASANG ref DI SINI */}
      <div className="chatBox" ref={boxRef}>
        {messages.map((m, i) => (
          <div key={i} className={`chatRow ${m.role === 'user' ? 'isUser' : 'isAssistant'}`}>
            <div className="chatBubble">
              <div className="chatText">{m.content}</div>
              <div className="chatMeta">{m.role === 'user' ? 'You' : 'AI Assistant'}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="chatRow isAssistant">
            <div className="chatBubble chatTyping">
              <div className="dots">
                <span />
                <span />
                <span />
              </div>
              <span className="typingText">AI is thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="chatComposer">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about solar sizing, payback, investments, or West Java solar policies..."
          className="chatInput"
        />
        <button
          type="button"
          className="chatSend"
          onClick={send}
          disabled={loading || !input.trim()}
          aria-label="Send"
        >
          {loading ? '⏳' : '🚀'}
        </button>
      </div>

      <div className="chatFooter">
        💡 This AI assistant provides educational information. For official advice, consult certified solar professionals.
      </div>
    </div>
  );
}