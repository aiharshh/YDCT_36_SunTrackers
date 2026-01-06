import { Link } from 'react-router-dom';

export default function SolarPanelExplanation() {
  const stepCard = {
    background: '#ffffff',
    border: '1px solid rgba(16, 24, 40, 0.08)',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 10px 24px rgba(16, 24, 40, 0.06)',
  };

  const stepTitle = {
    margin: 0,
    color: '#1f3a2a',
    fontSize: 16,
    letterSpacing: '-0.01em',
  };

  const stepBadge = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    fontWeight: 700,
    color: '#2e7d32',
    background: 'rgba(46, 125, 50, 0.10)',
    padding: '6px 10px',
    borderRadius: 999,
    marginBottom: 10,
  };

  const smallMuted = {
    margin: 0,
    color: '#667085',
    lineHeight: 1.65,
    fontSize: 14,
  };

  const anchorStyle = {
    textDecoration: 'none',
    fontWeight: 700,
    color: '#2e7d32',
    background: 'rgba(46, 125, 50, 0.10)',
    padding: '8px 12px',
    borderRadius: 999,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  };

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '28px 18px 44px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <h1
          style={{
            margin: 0,
            color: '#1f3a2a',
            letterSpacing: '-0.02em',
            fontSize: 40,
            fontWeight: 750,
          }}
        >
          Solar Panel Explanation
        </h1>

        <Link to="/" style={{ textDecoration: 'none', fontWeight: 700, color: '#2e7d32' }}>
          ← Back to Home
        </Link>
      </div>

      <p style={{ color: '#475467', lineHeight: 1.65, marginTop: 10, fontSize: 16 }}>
        Here's a simple visual to explain how sunlight is converted into electricity - and how it connects
        to the school and PLN grid in West Java.
      </p>

      <div
        style={{
          marginTop: 16,
          borderRadius: 18,
          overflow: 'hidden',
          border: '1px solid rgba(16, 24, 40, 0.08)',
          boxShadow: '0 12px 30px rgba(16, 24, 40, 0.10)',
          background: '#fff',
        }}
      >
        <img
          src="/SolarPanelExplanation.jpeg"
        //   src="/SolarExplanation.png"
          alt="Solar panel explanation diagram"
          style={{ width: '100%', display: 'block' }}
        />
      </div>

      <div style={{ marginTop: 18 }}>
        <h2 style={{ color: '#1f3a2a', margin: '0 0 10px' }}>How solar works</h2>
        <p style={{ margin: 0, color: '#475467', lineHeight: 1.75, fontSize: '14px' }}>
          Click a step to jump to the explanation:
        </p>

        <div
          style={{
            marginTop: 12,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <a href="#step1-generation" style={anchorStyle}>
            1) Generation
          </a>
          <a href="#step2-inversion" style={anchorStyle}>
            2) Inversion (DC → AC)
          </a>
          <a href="#step3-consumption" style={anchorStyle}>
            3) Self-Consumption
          </a>
          <a href="#step4-pln-grid" style={anchorStyle}>
            4) PLN Grid
          </a>
        </div>
      </div>

      <div style={{ marginTop: 18, color: '#475467', lineHeight: 1.8 }}>
        <p style={{ marginTop: 12, marginBottom: 16 }}>
          Solar power is simpler than it looks. Here's the real flow used in schools - designed to prioritize{' '}
          <strong>self-consumption</strong> (using solar power directly first), because exporting to the grid may not
          always reduce bills for every tariff.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
          <div id="step1-generation" style={stepCard}>
            <div style={stepBadge}>1 Generation - The “Energy Source”</div>
            <h3 style={stepTitle}>Sunlight hits the panels</h3>
            <p style={{ ...smallMuted, marginTop: 8 }}>
              The sun sends light energy every day. Solar panels are built to capture that light and start generating
              electrical power from it. This is the clean energy source - no fuel, no smoke, no noise.
            </p>
          </div>

          <div id="step2-inversion" style={stepCard}>
            <div style={stepBadge}>2 Inversion - The “Heart” of the system</div>
            <h3 style={stepTitle}>DC becomes usable AC electricity</h3>
            <p style={{ ...smallMuted, marginTop: 8 }}>
              Solar panels produce electricity in a form called <strong>DC</strong>. But school buildings use{' '}
              <strong>AC</strong> power (the same type used by most devices). The <strong>inverter</strong> converts DC
              into safe, usable AC - so the school can actually use the solar power.
            </p>
          </div>

          <div id="step3-consumption" style={stepCard}>
            <div style={stepBadge}>3 Consumption - The “Benefit”</div>
            <h3 style={stepTitle}>The school uses solar first (self-consumption)</h3>
            <p style={{ ...smallMuted, marginTop: 8 }}>
              The most important rule: the school uses the solar electricity <strong>first</strong>. This reduces how
              much electricity the school needs to buy from PLN. In simple terms: more solar used directly = lower bill.
            </p>
          </div>

          <div id="step4-pln-grid" style={stepCard}>
            <div style={stepBadge}>4 PLN Grid - The “Safety Net”</div>
            <h3 style={stepTitle}>Extra energy can flow to the grid, and PLN supports when solar is low</h3>
            <p style={{ ...smallMuted, marginTop: 8 }}>
              Solar production changes (clouds, rain, late afternoon). The PLN grid acts as a safety net:
              when solar is not enough, PLN supplies power. When the school has extra solar power, it may flow to the
              grid depending on system rules. This keeps electricity stable and reliable for the school.
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 16,
            background: 'rgba(46, 125, 50, 0.06)',
            border: '1px solid rgba(46, 125, 50, 0.12)',
          }}
        >
          <p style={{ margin: 0, color: '#475467', lineHeight: 1.75 }}>
            <strong>Summary:</strong> Solar turns free sunlight into electricity. The inverter makes it usable, the
            school consumes it first (biggest bill impact), and PLN ensures reliability as the backup grid connection.
            That's why solar is a smart and sustainable choice for schools in West Java.
          </p>
        </div>
      </div>
    </div>
  );
}