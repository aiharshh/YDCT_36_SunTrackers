import React, { useState, useEffect } from 'react';
import '../styles/Analysis.css';

export default function Analysis() {
  const [view, setView] = useState('school');

  const handleShare = () => {
    const currentUrl = window.location.href;

    const message = view === 'school'
      ? `🌿 Check out how West Java schools are hitting 69.3% Solar Independence! View the impact here: ${currentUrl}`
      : `📊 West Java Government is scaling renewable energy! 331 units and counting. Track our progress: ${currentUrl}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="analysisPage">
      {/* Header Section */}
      <div className="analysisHeader">
        <div className="analysisTitleWrap">
          <h1 style={{margin: 0}}>📊 Impact Dashboard</h1>
          <p style={{margin: 0}}>Real-time monitoring of West Java&apos;s transition.</p>
        </div>

        {/* Toggle & Share Actions */}
        <div className="analysisActions">
          {/* WhatsApp Meta Feature Button */}
          <button
            onClick={handleShare}
            className="analysisShareBtn"
          >
            Share to WhatsApp
          </button>

          <div className="analysisToggle" >
            <button
              onClick={() => setView('school')}
              className={`analysisToggleBtn ${view === 'school' ? 'analysisToggleBtnActive' : ''}`}
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
              className={`analysisToggleBtn ${view === 'admin' ? 'analysisToggleBtnActive' : ''}`}
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
      <div
        className="analysisCard"
        style={{padding: '0', overflow: 'hidden', minHeight: '500px', border: '1px solid #ddd', borderRadius: '8px'}}
      >
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
      <div
        className="analysisMeta"
        style={{marginTop: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px', borderLeft: '5px solid #2e7d32'}}
      >
        <small style={{color: '#555'}}>
          <strong>Data Meta-Tag:</strong> Source: West Java ESDM | Verification: PLN S-2 Tariff | Last Updated: Dec 2024
        </small>
      </div>
    </div>
  );
}