import { Link } from 'react-router-dom';
import '../App.css'; // Make sure styling is applied

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbarInner">
        <div className="logo">
          <span className="logoIcon">⚡ </span>
          <span className="logoText">PowerWestJava</span>
        </div>
        <div className="nav-links">
          <Link to="/home">HOME</Link>
          <Link to="/planner">CALCULATOR</Link>
          <Link to="/invest">INVEST</Link>
          <Link to="/analysis" className="nav-btn">ANALYSIS</Link>
        </div>
      </div>
    </nav>
  );
}