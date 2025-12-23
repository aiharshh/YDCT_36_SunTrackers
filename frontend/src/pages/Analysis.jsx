import React, { useState, useEffect } from 'react';
import '../App.css';

export default function Analysis() {
  const [view, setView] = useState('school');

 const handleShare = () => {
    // This grabs the actual link of your web app automatically
    const currentUrl = window.location.href; 

    const message = view === 'school' 
      ? `🌿 Check out how West Java schools are hitting 69.3% Solar Independence! View the impact here: ${currentUrl}`
      : `📊 West Java Government is scaling renewable energy! 331 units and counting. Track our progress: ${currentUrl}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="container" style={{maxWidth: '1200px'}}>
      {/* Header Section */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <div>
          <h1 style={{margin: 0, color: '#2e7d32'}}>📊 Impact Dashboard</h1>
          <p style={{margin: 0, color: '#666'}}>Real-time monitoring of West Java's transition.</p>
        </div>

        {/* Toggle & Share Actions */}
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          {/* WhatsApp Meta Feature Button */}
          <button 
            onClick={handleShare}
            style={{
              padding: '8px 16px',
              backgroundColor: '#25D366', // WhatsApp Green
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Share to WhatsApp
          </button>

          <div style={{background: '#e0e0e0', padding: '5px', borderRadius: '8px', display: 'flex', gap: '5px'}}>
            <button 
              onClick={() => setView('school')}
              style={{
                padding: '8px 16px', 
                border: 'none', 
                borderRadius: '6px', 
                background: view === 'school' ? 'white' : 'transparent',
                color: view === 'school' ? '#2e7d32' : '#666',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: view === 'school' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              School View
            </button>
            <button 
              onClick={() => setView('admin')}
              style={{
                padding: '8px 16px', 
                border: 'none', 
                borderRadius: '6px', 
                background: view === 'admin' ? 'white' : 'transparent',
                color: view === 'admin' ? '#2e7d32' : '#666',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: view === 'admin' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Admin View
            </button>
          </div>
        </div>
      </div>

      {/* The Dashboard Display Area */}
      <div className="card" style={{padding: '0', overflow: 'hidden', minHeight: '500px', border: '1px solid #ddd', borderRadius: '8px'}}>
        {view === 'school' ? (
          <img 
            src="/dashboard-school.png" 
            alt="School Analytics" 
            style={{width: '100%', height: 'auto', display: 'block'}} 
          />
        ) : (
          <img 
            src="/dashboard-admin.png" 
            alt="Government Analytics" 
            style={{width: '100%', height: 'auto', display: 'block'}} 
          />
        )}
      </div>

      {/* Meta Insight Footer */}
      <div style={{marginTop: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px', borderLeft: '5px solid #2e7d32'}}>
        <small style={{color: '#555'}}>
          <strong>Data Meta-Tag:</strong> Source: West Java ESDM | Verification: PLN S-2 Tariff | Last Updated: Dec 2024
        </small>
      </div>
    </div>
  );
}