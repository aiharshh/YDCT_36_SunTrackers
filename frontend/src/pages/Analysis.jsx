import React, { useState } from 'react';
import '../App.css';

export default function Analysis() {
  const [view, setView] = useState('school'); // Toggle state

  return (
    <div className="container" style={{maxWidth: '1200px'}}>
      {/* Header Section */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <div>
          <h1 style={{margin: 0, color: '#2e7d32'}}>📊 Impact Dashboard</h1>
          <p style={{margin: 0, color: '#666'}}>Real-time monitoring of West Java's transition.</p>
        </div>

        {/* Toggle Buttons */}
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

      {/* The Dashboard Display Area */}
      <div className="card" style={{padding: '0', overflow: 'hidden', minHeight: '500px'}}>
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
    </div>
  );
}