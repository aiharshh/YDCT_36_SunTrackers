import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);

  // modal state
  const [showAuthModal, setShowAuthModal] = useState(false);

  // mobile menu state
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // close modal with ESC
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowAuthModal(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // optional: auto-close menu kalau resize ke desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 720) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleAnalysisClick = (e) => {
    if (!user) {
      e.preventDefault();
      setMenuOpen(false);
      setShowAuthModal(true);
    }
  };

  const goLogin = () => {
    setShowAuthModal(false);
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbarInner">
          <div className="logo" onClick={() => navigate('/home')} role="button" tabIndex={0}>
            <span className="logoIcon">⚡ </span>
            <span className="logoText">PowerWestJava</span>
          </div>

          {/* Hamburger (mobile) */}
          <button
            type="button"
            className="navToggle"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mainNav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="navToggleIcon" aria-hidden="true">☰</span>
          </button>

          {/* Overlay (mobile) */}
          <div
            className={`navOverlay ${menuOpen ? 'show' : ''}`}
            onMouseDown={closeMenu}
            aria-hidden={!menuOpen}
          />

          <div id="mainNav" className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {/* Close button inside drawer (mobile) */}
            <button type="button" className="navClose" onClick={closeMenu} aria-label="Close menu">
              ✕
            </button>

            <NavLink to="/home" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
              HOME
            </NavLink>

            <NavLink to="/planner" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
              CALCULATOR
            </NavLink>

            <NavLink to="/invest" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
              INVEST
            </NavLink>

            <NavLink to="/chat" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
              CHAT
            </NavLink>

            {/* ANALYSIS: kalau belum login -> buka modal */}
            <NavLink
              to="/analysis"
              onClick={(e) => {
                closeMenu();
                handleAnalysisClick(e);
              }}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              ANALYSIS
            </NavLink>

            {/* Login / Logout */}
            {!user ? (
              <NavLink to="/login" onClick={closeMenu} className="nav-btn">
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