import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // modal state
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // close modal with ESC
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setShowAuthModal(false);
    };
    if (showAuthModal) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showAuthModal]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleAnalysisClick = (e) => {
    if (!user) {
      e.preventDefault();
      setShowAuthModal(true);
    }
  };

  const goLogin = () => {
    setShowAuthModal(false);
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbarInner">
          <div className="logo">
            <span className="logoIcon">⚡ </span>
            <span className="logoText">PowerWestJava</span>
          </div>

          <div className="nav-links">
            <NavLink to="/home" className={({ isActive }) => (isActive ? 'active' : '')}>
              HOME
            </NavLink>
            <NavLink to="/planner" className={({ isActive }) => (isActive ? 'active' : '')}>
              CALCULATOR
            </NavLink>
            <NavLink to="/invest" className={({ isActive }) => (isActive ? 'active' : '')}>
              INVEST
            </NavLink>
            <NavLink to="/chat" className={({ isActive }) => (isActive ? 'active' : '')}>
              CHAT
            </NavLink>

            {/* ANALYSIS: kalau belum login -> buka modal */}
            <NavLink
              to="/analysis"
              onClick={handleAnalysisClick}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              ANALYSIS
            </NavLink>

            {/* Login / Logout */}
            {!user ? (
              <NavLink to="/login" className="nav-btn">
                LOGIN
              </NavLink>
            ) : (
              <button type="button" className="nav-link" onClick={handleLogout}>
                LOGOUT
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ===== Modal (custom popup) ===== */}
      {showAuthModal && (
        <div
          className="authModalOverlay"
          role="dialog"
          aria-modal="true"
          aria-label="Login required"
          onMouseDown={() => setShowAuthModal(false)}
        >
          <div className="authModal" onMouseDown={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="authModalClose"
              onClick={() => setShowAuthModal(false)}
              aria-label="Close"
            >
              ×
            </button>

            <h3 className="authModalTitle">Please sign in</h3>
            <p className="authModalText">
              You need to log in to access <strong>Analysis</strong>.
            </p>

            <div className="authModalActions">
              <button type="button" className="authBtn authBtnPrimary" onClick={goLogin}>
                Login
              </button>
              <button
                type="button"
                className="authBtn authBtnGhost"
                onClick={() => setShowAuthModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}