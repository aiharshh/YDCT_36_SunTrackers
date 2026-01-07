import React, { useEffect, useRef, useState } from "react";
import "../styles/Chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI Solar Assistant for PowerWestJava.\n\nI can help you with:\n• Solar system sizing and costs\n• Investment opportunities\n• Energy savings calculations\n• West Java solar policies\n\nHow can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const boxRef = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages, loading]);

  const renderContent = (text) => {
    const lines = (text || "").split("\n");
    const blocks = [];
    let bullets = [];

    const flushBullets = () => {
      if (bullets.length) {
        blocks.push(
          <ul className="msgList" key={`ul-${blocks.length}`}>
            {bullets.map((b, idx) => (
              <li key={idx}>{b}</li>
            ))}
          </ul>
        );
        bullets = [];
      }
    };

    lines.forEach((raw) => {
      const line = raw.trimEnd();

      if (!line.trim()) {
        flushBullets();
        blocks.push(<div className="msgSpacer" key={`sp-${blocks.length}`} />);
        return;
      }

      if (line.trim().startsWith("•")) {
        bullets.push(line.replace(/^•\s?/, ""));
        return;
      }

      flushBullets();
      blocks.push(
        <p className="msgP" key={`p-${blocks.length}`}>
          {line}
        </p>
      );
    });

    flushBullets();
    return blocks;
  };

  const send = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const res = await fetch(`${apiBase}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (res.ok && data?.assistant) {
        setMessages((m) => [...m, data.assistant]);
      } else {
        const errMsg = data?.error || "Unknown error from chat endpoint";
        setMessages((m) => [...m, { role: "assistant", content: `❌ Error: ${errMsg}` }]);
      }
    } catch (err) {
      console.error("Chat request failed", err);
      setMessages((m) => [...m, { role: "assistant", content: "❌ Network error. Please try again." }]);
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const quickQuestions = [
    "How much solar panel do I need?",
    "What's the payback period?",
    "Best districts for solar in West Java?",
    "How to start investing in solar?",
  ];

  return (
    <div className="chatShell">
      <div className="chatCard">
        <div className="chatTop">
          <div className="chatTopIcon">
            <i className="bi bi-robot" />
          </div>
          <div className="chatTopText">
            <div className="chatTitle">AI Solar Assistant</div>
            <div className="chatSub">Your expert guide to renewable energy in West Java.</div>
          </div>
        </div>

        <div className="chatDivider" />

        <div className="chatBody">
          {messages.length <= 1 && (
            <>
              <div className="hintRow">
                <div className="hintBubble">
                  <i className="bi bi-lightbulb" />
                  <span>
                    Try asking about <b>'payback period'</b> or <b>'West Java regulations'</b>.
                  </span>
                </div>
              </div>

              <div className="chipRow">
                {quickQuestions.map((q, i) => (
                  <button key={i} type="button" className="chip" onClick={() => setInput(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="chatBox" ref={boxRef}>
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              const isWelcome = !isUser && i === 0;

              return (
                <div key={i} className={`msgRow ${isUser ? "user" : "ai"}`}>
                  {!isUser && (
                    <div className="avatar">
                      <i className="bi bi-robot" />
                    </div>
                  )}

                  <div className={`bubble ${isUser ? "bubbleUser" : "bubbleAi"} ${isWelcome ? "bubbleWelcome" : ""}`}>
                    {renderContent(m.content)}
                  </div>

                  {isUser && (
                    <div className="avatar avatarUser">
                      <i className="bi bi-person-fill" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="msgRow ai">
                <div className="avatar">
                  <i className="bi bi-robot" />
                </div>
                <div className="bubble bubbleAi bubbleTyping">
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

          <div className="composerCard">
            <div className="composerBar">
              <div className="composerField">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask about solar sizing, payback, investments..."
                  className="composerTextarea"
                  spellCheck={false}
                />
                <button
                  type="button"
                  className="composerMic"
                  aria-label="Mic (UI only)"
                  onClick={() => {}}
                >
                  <i className="bi bi-mic" />
                </button>
              </div>

              <button
                type="button"
                className="composerSend"
                onClick={send}
                disabled={loading || !input.trim()}
                aria-label="Send"
                title="Send"
              >
                <i className={`bi ${loading ? "bi-hourglass-split" : "bi-send-fill"}`} />
              </button>
            </div>
          </div>

          <div className="infoBar">
            <i className="bi bi-info-circle" />
            <span>
              This AI assistant provides educational information. For official advice, consult certified solar professionals.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}