import React, { useState } from "react";
import "../styles/Analysis.css";
import SchoolView from "../components/SchoolView";
import AdminView from "../components/AdminView";

export default function Analysis() {
  const [view, setView] = useState("school"); // "school" | "admin" | "dynamic" | "adminDynamic"

  const handleShare = () => {
    const currentUrl = window.location.href;

    const message =
      view === "admin" || view === "adminDynamic"
        ? `📊 West Java Government is scaling renewable energy! 331 units and counting. Track our progress: ${currentUrl}`
        : `🌿 Check out how West Java schools are hitting 69.3% Solar Independence! View the impact here: ${currentUrl}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const toggleBtnStyle = (active) => ({
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    background: active ? "white" : "transparent",
    color: active ? "#2e7d32" : "#666",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: active ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
  });

  return (
    <div className="analysisPage">
      <div className="analysisHeader">
        <div className="analysisTitleWrap">
          <h1 style={{ margin: 0 }}>📊 Impact Dashboard</h1>
          <p style={{ margin: 0 }}>Real-time monitoring of West Java&apos;s transition.</p>
        </div>

        <div className="analysisActions">
          <button onClick={handleShare} className="analysisShareBtn">
            Share to WhatsApp
          </button>

          <div className="analysisToggle">
            <button
              onClick={() => setView("school")}
              className={`analysisToggleBtn ${view === "school" ? "analysisToggleBtnActive" : ""}`}
              style={toggleBtnStyle(view === "school")}
            >
              School View
            </button>

            <button
              onClick={() => setView("admin")}
              className={`analysisToggleBtn ${view === "admin" ? "analysisToggleBtnActive" : ""}`}
              style={toggleBtnStyle(view === "admin")}
            >
              Admin View
            </button>

            <button
              onClick={() => setView("dynamic")}
              className={`analysisToggleBtn ${view === "dynamic" ? "analysisToggleBtnActive" : ""}`}
              style={toggleBtnStyle(view === "dynamic")}
            >
              S Dynamic
            </button>

            {/* ✅ tombol baru */}
            <button
              onClick={() => setView("adminDynamic")}
              className={`analysisToggleBtn ${view === "adminDynamic" ? "analysisToggleBtnActive" : ""}`}
              style={toggleBtnStyle(view === "adminDynamic")}
            >
              A Dynamic
            </button>
          </div>
        </div>
      </div>

      <div
        className="analysisCard"
        style={{
          padding: "0",
          overflow: "hidden",
          minHeight: "500px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        {view === "school" && (
          <img
            src="/dashboard-school.png"
            alt="School Analytics"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        )}

        {view === "admin" && (
          <img
            src="/dashboard-admin.png"
            alt="Government Analytics"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        )}

        {view === "dynamic" && <SchoolView />}

        {/* ✅ render AdminView dinamis */}
        {view === "adminDynamic" && <AdminView />}
      </div>

      <div
        className="analysisMeta"
        style={{
          marginTop: "15px",
          padding: "10px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          borderLeft: "5px solid #2e7d32",
        }}
      >
        <small style={{ color: "#555" }}>
          <strong>Data Meta-Tag:</strong> Source: West Java ESDM | Verification: PLN S-2 Tariff | Last Updated: Dec 2024
        </small>
      </div>
    </div>
  );
}