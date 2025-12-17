import { Link } from 'react-router-dom';
import '../App.css';

export default function Home() {
  return (
    <div className="container">
      <div style={{textAlign: 'center', marginBottom: '40px'}}>
        <h1 style={{color: '#2e7d32', fontSize: '2.5rem', marginBottom: '10px'}}>
          Welcome to the Green Future
        </h1>
        <p style={{color: '#666', fontSize: '1.1rem'}}>
          West Java's Platform for Energy Democracy
        </p>
      </div>

      <div className="grid">
        {/* Card 1: Calculator */}
        <div className="card" style={{textAlign: 'center', borderTop: '5px solid #ffa000'}}>
          <div style={{fontSize: '3rem', marginBottom: '10px'}}>☀️</div>
          <h2>Plan Solar</h2>
          <p>Calculate costs and savings for your school or home.</p>
          <br/>
          <Link to="/planner">
            <button className="btn">Open Calculator</button>
          </Link>
        </div>

        {/* Card 2: Invest */}
        <div className="card" style={{textAlign: 'center', borderTop: '5px solid #2e7d32'}}>
          <div style={{fontSize: '3rem', marginBottom: '10px'}}>💰</div>
          <h2>Invest</h2>
          <p>Fund community projects and earn green returns.</p>
          <br/>
          <Link to="/invest">
            <button className="btn">Browse Projects</button>
          </Link>
        </div>

        {/* Card 3: Analysis (NEW) */}
        <div className="card" style={{textAlign: 'center', borderTop: '5px solid #1976d2'}}>
          <div style={{fontSize: '3rem', marginBottom: '10px'}}>📊</div>
          <h2>Impact Analysis</h2>
          <p>Track West Java's carbon reduction progress.</p>
          <br/>
          <Link to="/analysis">
            <button className="btn" style={{backgroundColor: '#1976d2'}}>
              View Dashboard
            </button>
          </Link>
        </div>
      </div>
      
      {/* Footer / User Info */}
      <div style={{textAlign: 'center', marginTop: '50px', color: '#999', fontSize: '0.9rem'}}>
        <p>Logged in securely via Firebase</p>
      </div>
    </div>
  );
}