import React, { useEffect, useMemo, useState } from "react";
import "../styles/HowInvestmentWorks.css";

export default function HowInvestmentWorks() {
  const [open, setOpen] = useState(false);

  const fullText = useMemo(
    () => `Investment Explanation:

1. Sunlight Becomes Electricity
Solar panels capture sunlight and convert it into electricity during the day. This process does not use fuel and does not produce smoke or pollution.

2. Electricity is Used by People and Businesses
The electricity produced is used by nearby homes, schools, and factories, or sent to the national power grid to support daily electricity needs

3. Electricity has Value
Just like water or mobile data, electricity has a price. Every unit of electricity produced and used creates income for the solar project.

4. Solar Projects Earn Income Every Day
As long as the sun shines and the panels work: 
Electricity is produced daily
Income is generated regularly
Operating costs stay low
Solar panels are designed to work for 20-30 years.

5. Investors Receive Returns Over Time
The income earned from selling electricity is used to:
Maintain the solar system, Pay back project costs, Provide returns to investors over many years

Why solar income is stable
☀️ Sunlight is free and available every day
⚙️ Solar systems have low maintenance needs
📅 Electricity is needed continuously by society

This makes solar projects a long-term and reliable source of income.`,
    []
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <section className="hiw">
        <div className="hiw-bar">
          <div className="hiw-steps">
            <div className="hiw-step hiw-step-1">
              <div className="hiw-step-inner">
                <div className="hiw-step-circle">1</div>
                <div className="hiw-step-text">
                  <div className="hiw-step-title">Choose a project</div>
                  <div className="hiw-step-sub">Pick a school to support</div>
                </div>
              </div>
            </div>

            <div className="hiw-line hiw-line-1" aria-hidden="true" />

            <div className="hiw-step hiw-step-2">
              <div className="hiw-step-inner">
                <div className="hiw-step-circle">2</div>
                <div className="hiw-step-text">
                  <div className="hiw-step-title">Invest</div>
                  <div className="hiw-step-sub">Start from Rp 500.000</div>
                </div>
              </div>
            </div>

            <div className="hiw-line hiw-line-2" aria-hidden="true" />

            <div className="hiw-step hiw-step-3">
              <div className="hiw-step-inner">
                <div className="hiw-step-circle">3</div>
                <div className="hiw-step-text">
                  <div className="hiw-step-title">Earn returns</div>
                  <div className="hiw-step-sub">Track progress anytime</div>
                </div>
              </div>
            </div>
          </div>

          <div className="hiw-link-row">
            <button
              type="button"
              className="hiw-link"
              onClick={() => setOpen(true)}
            >
              How Investment Works?
            </button>
          </div>
        </div>
      </section>

      {open && (
        <div
          className="hiw-modal"
          role="dialog"
          aria-modal="true"
          aria-label="How Investment Works"
        >
          <button
            type="button"
            className="hiw-modal-backdrop"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />

          <div className="hiw-modal-panel">
            <div className="hiw-modal-header">
              <div>
                <h3 className="hiw-modal-title">How Investment Works</h3>
                <p className="hiw-modal-desc">
                  A simple explanation of how solar projects generate income and
                  returns.
                </p>
              </div>

              <button
                type="button"
                className="hiw-modal-close"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="hiw-modal-body">
              <pre className="hiw-modal-text">{fullText}</pre>
            </div>

            <div className="hiw-modal-footer">
              <button
                type="button"
                className="hiw-modal-ok"
                onClick={() => setOpen(false)}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}