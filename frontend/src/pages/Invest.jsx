import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import '../App.css';

export default function Invest() {
  // Dummy data for Demo (Replace with API fetch if backend is ready)
  const [projects, setProjects] = useState([
    { id: 1, name: "SMA 1 Bandung", location: "Bandung", target: 100000000, raised: 45000000, img: "https://images.unsplash.com/photo-1562774053-701939374585?w=500" },
    { id: 2, name: "SMK 3 Bekasi", location: "Bekasi", target: 150000000, raised: 12000000, img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500" },
    { id: 3, name: "SDN 2 Bogor", location: "Bogor", target: 50000000, raised: 48000000, img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500" }
  ]);

  const handleInvest = (id) => {
    // 1. Trigger Confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2e7d32', '#ffd700', '#ffffff'] // Green, Gold, White
    });

    // 2. Update Progress Bar (Simulated)
    const updatedProjects = projects.map(p => {
      if (p.id === id) {
        return { ...p, raised: p.raised + 500000 }; // Add 500k
      }
      return p;
    });
    setProjects(updatedProjects);
    alert("Thank you! You invested Rp 500,000.");
  };

  return (
    <div className="container">
      <h1 style={{textAlign: 'center', color: '#2e7d32'}}>🤝 Community Financing</h1>
      <p style={{textAlign: 'center', color: '#666', marginBottom: '30px'}}>
        Invest in local solar projects and earn green returns.
      </p>

      <div className="grid">
        {projects.map((project) => (
          <div key={project.id} className="card" style={{padding: '0', overflow: 'hidden'}}>
            {/* Project Image */}
            <div style={{height: '150px', background: `url(${project.img}) center/cover`}}></div>
            
            <div style={{padding: '20px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3 style={{margin: 0}}>{project.name}</h3>
                <span style={{fontSize: '0.8rem', background: '#e8f5e9', padding: '3px 8px', borderRadius: '10px', color: '#2e7d32'}}>
                  {project.location}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div style={{marginTop: '15px', marginBottom: '5px', fontSize: '0.9rem', color: '#555'}}>
                <span>Raised: Rp {(project.raised / 1000000).toFixed(1)} Juta</span>
                <span style={{float: 'right'}}>{Math.round((project.raised / project.target) * 100)}%</span>
              </div>
              <div style={{width: '100%', height: '10px', background: '#eee', borderRadius: '5px'}}>
                <div style={{
                  width: `${(project.raised / project.target) * 100}%`, 
                  height: '100%', 
                  background: '#2e7d32', 
                  borderRadius: '5px',
                  transition: 'width 0.5s ease'
                }}></div>
              </div>

              <br/>
              <button className="btn" onClick={() => handleInvest(project.id)}>
                Invest Rp 500.000
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}