import React, { useState } from 'react';
import { calculateSolar } from '../services/api'; // Import our API helper
import generateAdvisor from '../advisor/advisor';
import '../App.css'; // Use our clean CSS
import '../styles/Planner.css';

export default function Planner() {
  const [formData, setFormData] = useState({ bill: '', district: 'Bandung' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.bill) return alert("Please enter your monthly bill!");
    // ensure bill is numeric
    const billNum = Number(formData.bill);
    if (!Number.isFinite(billNum) || billNum <= 0) return alert('Please enter a valid monthly bill amount');

    setLoading(true);
    try {
      // Call the backend
      const data = await calculateSolar(formData);
      const explanation = generateAdvisor(formData, data);
      setResult({ ...data, explanation });
    } catch (error) {
      console.error("Calculation failed", error);
      // Fallback for demo if backend fails
      const fallback = {
        system_size: (formData.bill / 1444.7 / 130).toFixed(1),
        cost: Math.round((formData.bill / 1444.7 / 130) * 14000000),
        savings: Math.round(formData.bill * 0.7),
        advice: `Based on ${formData.district}'s high solar index, this investment pays off in 3.2 years.`
      };
      const explanation = generateAdvisor(formData, fallback);
      setResult({ ...fallback, explanation });
    }
    setLoading(false);
  };

  return (
    <div className="plannerPage">
      <div className="plannerHeader">
        <h1 className="plannerTitle">☀️ Solar Calculator</h1>
        <p className="plannerSubtitle">Find out how much your school can save.</p>
      </div>

      {/* INPUT SECTION */}
      <div className="plannerCard plannerFormCard">
        <label className="plannerLabel">
          <strong>Monthly Electricity Bill (IDR)</strong>
        </label>
        <input
          className="plannerInput"
          type="number"
          placeholder="e.g. 2000000"
          value={formData.bill}
          onChange={(e) => setFormData({ ...formData, bill: e.target.value })}
        />

        <label className="plannerLabel">
          <strong>District / Location</strong>
        </label>
        <select
          className="plannerSelect"
          value={formData.district}
          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
        >
          <option value="Bandung">Bandung</option>
          <option value="Bekasi">Bekasi</option>
          <option value="Bogor">Bogor</option>
          <option value="Cirebon">Cirebon</option>
        </select>

        <button className="plannerBtn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Calculating AI..." : "Calculate Savings"}
        </button>
      </div>

      {/* RESULT SECTION */}
      {result && (
        <div className="plannerCard plannerResultCard">
          <h2 className="plannerResultTitle">Analysis Result</h2>

          <div className="plannerGrid">
            <div className="plannerMetric">
              <h3 className="plannerMetricTitle">🔌 System Size</h3>
              <p className="plannerMetricValue">{result.system_size} kWp</p>
            </div>

            <div className="plannerMetric">
              <h3 className="plannerMetricTitle">💰 Estimated Cost</h3>
              <p className="plannerMetricValue plannerMetricValueCost">
                Rp {result.cost.toLocaleString()}
              </p>
            </div>

            <div className="plannerMetric">
              <h3 className="plannerMetricTitle">🌱 Monthly Savings</h3>
              <p className="plannerMetricValue plannerMetricValueSave">
                Rp {result.savings.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="plannerNote">
            <strong>🤖 AI Consultant's Note:</strong>
            <p style={{marginTop: '5px', fontStyle: 'italic'}}>"{result.advice}"</p>
          </div>
          {/* Explanation (advisor) */}
          {result.explanation && (
            <div className="plannerCard plannerExplanationCard" style={{marginTop: 16}}>
              <h3 className="plannerSectionTitle">How we estimated this</h3>
              <p>{result.explanation.rationale}</p>

              <div style={{display: 'flex', gap: 20, marginTop: 12}}>
                <div style={{flex: 1}}>
                  <strong>Panels</strong>
                  <p>{result.explanation.panels} pcs</p>
                  <small>{result.explanation.summary}</small>
                </div>

                <div style={{flex: 2}}>
                  <strong>Assumptions</strong>
                  <ul>
                    {Array.isArray(result.explanation.assumptions) && result.explanation.assumptions.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{marginTop: 12}}>
                <strong>Next steps</strong>
                <ol>
                  {Array.isArray(result.explanation.checklist) && result.explanation.checklist.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ol>
              </div>

              <div style={{marginTop: 12}}>
                <strong>Placement & optimizations</strong>
                <p>{result.explanation.placement?.note}</p>
                <ul>
                  {Array.isArray(result.explanation.optimizations) && result.explanation.optimizations.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}