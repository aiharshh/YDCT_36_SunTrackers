import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/Home.css';

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
    <div className="homeContainer">
      <div className="homeHeader">
        <h1 className="homeTitle">Welcome to the Green Future</h1>
        <p className="homeSubtitle">West Java&apos;s Platform for Energy Democracy</p>
      </div>

      <section className="solarHero" aria-label="How Solar Power Works">
        <div className="solarHeroOverlay" />
        <div className="solarHeroContent">
          <h2 className="solarHeroTitle">How Solar Power Works</h2>
          <p className="solarHeroText">
            Discover how solar panels convert sunlight into clean energy.
          </p>

          <Link to="/solarExplanation" className="solarHeroCta">
            Learn More <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <div className="homeGrid">
        <div className="homeCard homeCard--orange">
          <div className="homeCardIcon" aria-hidden="true">
            ☀️
          </div>
          <h2 className="homeCardTitle">Plan Solar</h2>
          <p className="homeCardText">Calculate costs and savings for your school or home.</p>

          <Link to="/planner">
            <button className="homeBtn" type="button">
              Open Calculator
            </button>
          </Link>
        </div>

        <div className="homeCard homeCard--green">
          <div className="homeCardIcon" aria-hidden="true">
            💰
          </div>
          <h2 className="homeCardTitle">Invest</h2>
          <p className="homeCardText">Fund community projects and earn green returns.</p>

          <Link to="/invest">
            <button className="homeBtn" type="button">
              Browse Projects
            </button>
          </Link>
        </div>

        <div className="homeCard homeCard--blue">
          <div className="homeCardIcon" aria-hidden="true">
            📊
          </div>
          <h2 className="homeCardTitle">Impact Analysis</h2>
          <p className="homeCardText">Track West Java's carbon reduction progress visually.</p>

          <button className="homeBtn homeBtn--primary" onClick={handleAnalysisClick} type="button">
            View Dashboard
          </button>
        </div>
      </div>

      <div className="homeFooter">
        <p>Logged in securely via Firebase</p>
      </div>

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
              x
            </button>

            <h2 className="authModalTitle">Please sign in</h2>
            <p className="authModalText">You need to log in to access Analysis.</p>

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
    </div>
  );
}