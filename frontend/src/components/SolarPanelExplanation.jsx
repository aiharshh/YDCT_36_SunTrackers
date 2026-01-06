import { Link } from 'react-router-dom';

export default function SolarPanelExplanation() {
  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '28px 18px 44px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <h1 style={{ margin: 0, color: '#1f3a2a', letterSpacing: '-0.02em', fontSize: '40px', fontWeight:6500 }}>
          Solar Panel Explanation
        </h1>

        <Link
          to="/"
          style={{
            textDecoration: 'none',
            fontWeight: 700,
            color: '#2e7d32',
          }}
        >
          ← Back to Home
        </Link>
      </div>

      <p style={{ color: '#475467', lineHeight: 1.65, marginTop: 10, fontSize: '16px' }}>
        Here's a simple visual to explain how sunlight is converted into electricity using solar panels.
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

      <div style={{ marginTop: 18, color: '#475467', lineHeight: 1.8 }}>
        <h2 style={{ color: '#1f3a2a', margin: '0 0 10px' }}>
            What's actually happening here?
        </h2>

        <p>
            Solar power is simpler than it looks. Here's what's going on, step by step:
        </p>

        <ul style={{ margin: '10px 0 0', paddingLeft: 18 }}>
            <li>
            <strong>Sunlight hits the panels.</strong><br />
            The sun sends light energy to Earth every day — and solar panels are designed
            to catch that light.
            </li>

            <li>
            <strong>The panels turn light into electricity.</strong><br />
            Inside the panels is a material called silicon. When sunlight touches it,
            tiny particles (called electrons) start moving — and that movement creates electricity.
            </li>

            <li>
            <strong>You can use the electricity right away.</strong><br />
            That electricity can power lights, devices, and buildings, or be sent to the
            power grid so nothing goes to waste.
            </li>
        </ul>

        <p style={{ marginTop: 12 }}>
            In short, solar panels turn free sunlight into useful energy — quietly,
            cleanly, and every day. That's why solar is a smart and sustainable choice.
        </p>
        </div>
    </div>
  );
}