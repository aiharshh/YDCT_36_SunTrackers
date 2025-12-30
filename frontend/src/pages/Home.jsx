// src/pages/Home.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

// NOTE: kalau kamu sudah tidak mau pakai App.css, boleh hapus.
// import '../App.css';

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleAnalysisClick = (e) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    navigate('/analysis');
  };

  const goLogin = () => {
    setShowAuthModal(false);
    navigate('/login');
  };

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#2e7d32', fontSize: '2.5rem', marginBottom: '10px' }}>
          Welcome to the Green Future
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          West Java's Platform for Energy Democracy
        </p>
      </div>

      <div className="grid">
        {/* Card 1: Calculator */}
        <div className="card" style={{ textAlign: 'center', borderTop: '5px solid #ffa000' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>☀️</div>
          <h2>Plan Solar</h2>
          <p>Calculate costs and savings for your school or home.</p>
          <br />
          <Link to="/planner">
            <button className="btn">Open Calculator</button>
          </Link>
        </div>

        {/* Card 2: Invest */}
        <div className="card" style={{ textAlign: 'center', borderTop: '5px solid #2e7d32' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💰</div>
          <h2>Invest</h2>
          <p>Fund community projects and earn green returns.</p>
          <br />
          <Link to="/invest">
            <button className="btn">Browse Projects</button>
          </Link>
        </div>

        {/* Card 3: Analysis */}
        <div className="card" style={{ textAlign: 'center', borderTop: '5px solid #1976d2' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📊</div>
          <h2>Impact Analysis</h2>
          <p>Track West Java's carbon reduction progress.</p>
          <br />

          {/* IMPORTANT: replace Link to="/analysis" dengan button check login */}
          <button
            className="btn"
            style={{ backgroundColor: '#2e7d32' }}
            onClick={handleAnalysisClick}
            type="button"
          >
            View Dashboard
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '50px', color: '#999', fontSize: '0.9rem' }}>
        <p>Logged in securely via Firebase</p>
      </div>

      {/* ===== Login Required Modal (re-use same classes) ===== */}
      {showAuthModal && (
        <div
          className="authModalOverlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowAuthModal(false)}
        >
          <div className="authModal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="authModalClose"
              onClick={() => setShowAuthModal(false)}
              aria-label="Close"
            >
              ×
            </button>

            <h2 className="authModalTitle">Please sign in</h2>
            <p className="authModalText">You need to log in to access Analysis.</p>

            <div className="authModalActions">
              <button type="button" className="authBtn authBtnPrimary" onClick={goLogin}>
                Login
              </button>
              <button type="button" className="authBtn authBtnGhost" onClick={() => setShowAuthModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}