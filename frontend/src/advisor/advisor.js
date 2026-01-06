// frontend/src/advisor/advisor.js
// A lightweight rule-based advisor to produce explainable recommendations
// Inputs: formData { bill, district } and result { system_size, cost, savings }

function parseNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

const SOLAR_HOURS_BY_DISTRICT = {
  Bandung: 4.5,
  Bekasi: 4.8,
  Bogor: 4.6,
  Cirebon: 5.0,
};

export function generateAdvisor(formData = {}, result = {}) {
  const bill = parseNumber(formData.bill || 0);
  const district = formData.district || 'Bandung';

  const systemSize = parseNumber(result.system_size) || Math.max(0.5, bill / 1500000);
  const cost = parseNumber(result.cost) || Math.round(systemSize * 14000000);
  const savings = parseNumber(result.savings) || Math.round(bill * 0.6);

  const panelWatt = 330; // typical panel wattage used in estimates
  const panels = Math.max(1, Math.round((systemSize * 1000) / panelWatt));

  const sunHours = SOLAR_HOURS_BY_DISTRICT[district] || 4.5;
  const performanceRatio = 0.75; // losses (inverter, temp, wiring, shading)

  const annualKWh = +(systemSize * sunHours * 365 * performanceRatio).toFixed(0);

  const rationale = `We estimated a ${systemSize} kWp system because your monthly bill of Rp ${bill.toLocaleString()} suggests that size will meaningfully offset consumption. Using a typical panel of ${panelWatt}W and average sun hours for ${district} (${sunHours} h/day), the system should produce about ${annualKWh.toLocaleString()} kWh/year.`;

  const assumptions = [
    `Panel power ≈ ${panelWatt} W (mono-crystalline)`,
    `Performance ratio (losses) ≈ ${Math.round(performanceRatio * 100)}%`,
    `Average peak sun hours ≈ ${sunHours} h/day for ${district}`,
    'No major shading on the array area',
    'Roof is structurally suitable for the estimated array',
  ];

  const checklist = [
    'Get a site survey (shading & roof strength)',
    'Confirm desired backup requirements (battery sizing) with stakeholders',
    'Obtain at least 2 installer quotes including BOM (panels, inverter, mounting)',
    'Check local subsidies or incentives that may reduce upfront cost',
  ];

  const placement = {
    recommendedMount: 'roof-mounted',
    tilt: '≈ latitude of location (adjust with installer)',
    orientation: 'orient to maximize sun exposure; installer will advise exact azimuth',
    note: 'Avoid shading from trees and nearby structures during peak sun hours',
  };

  const optimizations = [
    'Consider phased installation to spread CAPEX if budget constrained',
    'Use string inverters for smaller systems, hybrid or split inverters for battery-ready setups',
    'Negotiate a panel warranty and performance guarantee with suppliers',
  ];

  const summary = `Estimated production ${annualKWh.toLocaleString()} kWh/year - roughly offsetting ${Math.round((annualKWh / (bill === 0 ? 1 : (bill * 12 / 1500))) )}% of annual consumption (approx).`;

  return {
    rationale,
    assumptions,
    checklist,
    panels,
    summary,
    placement,
    optimizations,
  };
}

export default generateAdvisor;
