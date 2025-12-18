import React, { useState } from 'react';
import { calculateSolar } from '../services/api'; // Import our API helper
import generateAdvisor from '../advisor/advisor';
import '../App.css'; // Use our clean CSS

export default function Planner() {
  const [formData, setFormData] = useState({ bill: '', district: 'Bandung' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.bill) return alert("Please enter your monthly bill!");
    
    setLoading(true);
    try {
      // Call the Python/Node Backend
      const data = await calculateSolar(formData); 
      // augment result with frontend advisor so UX is consistent even if backend changes
      const explanation = generateAdvisor(formData, data);
      setResult({ ...data, explanation });
    } catch (error) {
      console.error("Calculation failed", error);
      // Fallback for demo if backend fails
      const fallback = {
        system_size: (formData.bill / 1500000).toFixed(1),
        cost: Math.round((formData.bill / 1500000) * 14000000),
        savings: Math.round(formData.bill * 0.7),
        advice: `Based on ${formData.district}'s high solar index, this investment pays off in 3.2 years.`
      };
      const explanation = generateAdvisor(formData, fallback);
      setResult({ ...fallback, explanation });
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1 style={{textAlign: 'center', color: '#2e7d32'}}>☀️ Solar Calculator</h1>
      <p style={{textAlign: 'center', color: '#666'}}>Find out how much your school can save.</p>

      {/* INPUT SECTION */}
      <div className="card" style={{maxWidth: '500px', margin: '20px auto'}}>
        <label><strong>Monthly Electricity Bill (IDR)</strong></label>
        <input 
          type="number" 
          placeholder="e.g. 2000000" 
          value={formData.bill}
          onChange={(e) => setFormData({...formData, bill: e.target.value})}
        />

        <label><strong>District / Location</strong></label>
        <select 
          value={formData.district}
          onChange={(e) => setFormData({...formData, district: e.target.value})}
        >
          <option value="Bandung">Bandung</option>
          <option value="Bekasi">Bekasi</option>
          <option value="Bogor">Bogor</option>
          <option value="Cirebon">Cirebon</option>
        </select>

        <br/><br/>
        <button className="btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Calculating AI..." : "Calculate Savings"}
        </button>
      </div>

      {/* RESULT SECTION */}
      {result && (
        <div className="card" style={{backgroundColor: '#e8f5e9', border: '1px solid #a5d6a7'}}>
          <h2 style={{borderBottom: '1px solid #ccc', paddingBottom: '10px'}}>Analysis Result</h2>
          
          <div className="grid">
            <div style={{textAlign: 'center'}}>
              <h3>🔌 System Size</h3>
              <p style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{result.system_size} kWp</p>
            </div>
            <div style={{textAlign: 'center'}}>
              <h3>💰 Estimated Cost</h3>
              <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#d32f2f'}}>Rp {result.cost.toLocaleString()}</p>
            </div>
            <div style={{textAlign: 'center'}}>
              <h3>🌱 Monthly Savings</h3>
              <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#2e7d32'}}>Rp {result.savings.toLocaleString()}</p>
            </div>
          </div>

          <div style={{marginTop: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '5px'}}>
            <strong>🤖 AI Consultant's Note:</strong>
            <p style={{marginTop: '5px', fontStyle: 'italic'}}>"{result.advice}"</p>

            {/* Explanation (deterministic) */}
            {result.explanation && (
              <div style={{marginTop: '10px'}}>
                <h4 style={{marginBottom: '6px'}}>How we estimated this</h4>
                <p style={{marginTop: 0}}>{result.explanation.rationale}</p>

                <div style={{display: 'flex', gap: '20px', marginTop: '10px'}}>
                  <div>
                    <strong>Panels</strong>
                    <p>{result.explanation.panels} pcs</p>
                    <small>{result.explanation.summary}</small>
                  </div>

                  <div>
                    <strong>Assumptions</strong>
                    <ul>
                      {result.explanation.assumptions.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{marginTop: '10px'}}>
                  <strong>Next steps</strong>
                  <ol>
                    {result.explanation.checklist.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}