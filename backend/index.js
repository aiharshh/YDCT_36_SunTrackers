const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// --- 1. FAKE DATABASE (In-Memory) ---
// We use this variable to store data instead of MongoDB
let schools = [
    { id: 1, name: "SMA 1 Bandung", district: "Bandung", target_amount: 100000000, raised_amount: 45000000, image: "https://placehold.co/600x400" },
    { id: 2, name: "SMK 3 Bekasi", district: "Bekasi", target_amount: 150000000, raised_amount: 12000000, image: "https://placehold.co/600x400" },
    { id: 3, name: "SDN 2 Bogor", district: "Bogor", target_amount: 50000000, raised_amount: 48000000, image: "https://placehold.co/600x400" }
];

// --- 2. API ENDPOINTS ---

// A. Solar Calculator (Same logic as before)
app.post('/api/calculate-solar', (req, res) => {
    const { bill, district } = req.body;
    
    // Logic
    const systemSize = (bill / 1444) * 0.7 / 4.0; // Simplified math
    const cost = Math.round(systemSize * 14000000);
    const savings = Math.round(bill * 0.7);

    // Deterministic explanation (no external AI)
    const panelWatt = 400; // typical panel wattage in W
    const panels = Math.max(1, Math.round((systemSize * 1000) / panelWatt));
    const paybackYears = (cost / (savings * 12)) || null;

    let advice = `Great location! ${district} has high solar potential.`;
    if (bill > 2000000) advice = `High usage detected. A ${systemSize.toFixed(1)}kWp system will maximize ROI.`;

    const explanation = {
        rationale: `Estimated system size ${systemSize.toFixed(1)} kWp is derived from your monthly bill using simplified local heuristics. This is a preliminary estimate and should be verified by a site survey.`,
        assumptions: [
            'Performance ratio (system losses) ~0.7',
            `Panel wattage assumed ${panelWatt}W`,
            'No storage (batteries) included'
        ],
        checklist: [
            'Check roof orientation & shading',
            'Request multiple installer quotes',
            'Confirm local permits and electrical capacity',
            'Plan maintenance and inverter access'
        ],
        panels: panels,
        summary: `Approx. ${panels} panels (@ ${panelWatt}W). Estimated payback ~${paybackYears ? paybackYears.toFixed(1) + ' years' : 'N/A'}.`
    };

    res.json({
        system_size: systemSize.toFixed(1),
        cost: cost,
        savings: savings,
        advice: advice,
        explanation: explanation
    });
});

// B. Get Projects
app.get('/api/projects', (req, res) => {
    res.json(schools);
});

// C. Invest in Project (Updates the "Fake Database")
app.post('/api/invest', (req, res) => {
    const { school_id, amount } = req.body;
    
    // Find school and update it
    const school = schools.find(s => s.id === parseInt(school_id));
    
    if (school) {
        school.raised_amount += parseInt(amount); // Add money
        console.log(`💰 Investment received! ${school.name} is now at Rp ${school.raised_amount}`);
        res.json({ message: "Investment successful!", updatedSchool: school });
    } else {
        res.status(404).json({ error: "School not found" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});