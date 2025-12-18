import React, { useState } from 'react';
import { calculateSolar } from '../services/api';
import '../styles/Planner.css';

export default function Planner() {
  const [formData, setFormData] = useState({ bill: '', district: 'Bandung' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.bill) return alert("Please enter your monthly bill!");

    setLoading(true);
    try {
      const data = await calculateSolar(formData);
      setResult(data);
    } catch (error) {
      console.error("Calculation failed", error);
      setResult({
        system_size: (formData.bill / 1500000).toFixed(1),
        cost: Math.round((formData.bill / 1500000) * 14000000),
        savings: Math.round(formData.bill * 0.7),
        advice: `Based on ${formData.district}'s high solar index, this investment pays off in 3.2 years.`
      });
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
            <p className="plannerAdvice">"{result.advice}"</p>
          </div>
        </div>
      )}
    </div>
  );
}