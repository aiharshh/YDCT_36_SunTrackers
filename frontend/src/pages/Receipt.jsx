import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Receipt() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <div style={{padding: '50px', textAlign: 'center'}}>No Receipt Found.</div>;

  const handleDownload = () => {
    window.print(); // This opens the browser print dialog (Save as PDF)
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      {/* Receipt Card */}
      <div id="printable-receipt" style={{ 
        maxWidth: '600px', 
        margin: 'auto', 
        padding: '30px', 
        border: '2px solid #2e7d32', 
        borderRadius: '10px',
        backgroundColor: '#fff' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: '#2e7d32', margin: '0' }}>PowerTrack</h1>
          <p style={{ color: '#666' }}>Green Energy Investment Receipt</p>
        </div>

        <hr />

        <div style={{ padding: '20px 0' }}>
          <p><strong>Transaction ID:</strong> {state.transactionId}</p>
          <p><strong>Date:</strong> {state.date}</p>
          <p><strong>Investor Email:</strong> {state.userEmail}</p>
          
          <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f1f8e9', borderRadius: '5px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Project: {state.projectName}</h3>
            <h2 style={{ margin: '0', color: '#1b5e20' }}>Amount: Rp {state.amount.toLocaleString()}</h2>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '0.9rem', color: '#888' }}>
          <p>Thank you for contributing to the solar community in West Java!</p>
          <p>This is a computer-generated receipt for your virtual investment demo.</p>
        </div>
      </div>

      {/* Buttons - These will be hidden when printing */}
      <div className="no-print" style={{ textAlign: 'center', marginTop: '30px' }}>
        <button onClick={handleDownload} style={{ 
          padding: '12px 25px', 
          backgroundColor: '#2e7d32', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          marginRight: '10px',
          cursor: 'pointer'
        }}>
          Download / Print PDF
        </button>
        <button onClick={() => navigate('/invest')} style={{ 
          padding: '12px 25px', 
          backgroundColor: '#666', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Back to Dashboard
        </button>
      </div>

      {/* CSS to hide buttons during print */}
      <style>
        {`
          @media print {
            .no-print { display: none; }
            body { background: white; }
            #printable-receipt { border: none; }
          }
        `}
      </style>
    </div>
  );
}