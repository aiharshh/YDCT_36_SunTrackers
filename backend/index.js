// =====================
// ENV SETUP
// =====================
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log('Loaded environment from .env');
} else {
    dotenv.config();
    console.warn('No .env found in backend; proceeding without env file');
}

// =====================
// IMPORTS
// =====================
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

// =====================
// APP SETUP
// =====================
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

// =====================
// OPENAI CLIENT
// =====================
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY is missing');
}

// =====================
// RATE LIMITER (IN-MEMORY)
// =====================
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 min
const RATE_LIMIT_MAX = 60;
const rateLimitMap = new Map();

// =====================
// FAKE DATABASE
// =====================
let schools = [
    { id: 1, name: "SMA 1 Bandung", district: "Bandung", target_amount: 100000000, raised_amount: 45000000, image: "https://placehold.co/600x400" },
    { id: 2, name: "SMK 3 Bekasi", district: "Bekasi", target_amount: 150000000, raised_amount: 12000000, image: "https://placehold.co/600x400" },
    { id: 3, name: "SDN 2 Bogor", district: "Bogor", target_amount: 50000000, raised_amount: 48000000, image: "https://placehold.co/600x400" }
];

// =====================
// API ENDPOINTS
// =====================

// A. Solar Calculator
app.post('/api/calculate-solar', (req, res) => {
    const { bill, district } = req.body;

    const systemSize = (bill / 1444) * 0.7 / 4.0;
    const cost = Math.round(systemSize * 14000000);
    const savings = Math.round(bill * 0.7);

    const panelWatt = 400;
    const panels = Math.max(1, Math.round((systemSize * 1000) / panelWatt));
    const paybackYears = (cost / (savings * 12)) || null;

    let advice = `Great location! ${district} has high solar potential.`;
    if (bill > 2000000) advice = `High usage detected. A ${systemSize.toFixed(1)}kWp system will maximize ROI.`;

    res.json({
        system_size: systemSize.toFixed(1),
        cost,
        savings,
        advice,
        explanation: {
            rationale: `Estimated system size ${systemSize.toFixed(1)} kWp is derived from simplified heuristics.`,
            assumptions: [
                'Performance ratio ~0.7',
                `Panel wattage ${panelWatt}W`,
                'No batteries included'
            ],
            checklist: [
                'Check roof shading',
                'Get installer quotes',
                'Confirm permits',
                'Plan maintenance'
            ],
            panels,
            summary: `Approx. ${panels} panels. Payback ~${paybackYears ? paybackYears.toFixed(1) + ' years' : 'N/A'}`
        }
    });
});

// B. Get Projects
app.get('/api/projects', (req, res) => {
    res.json(schools);
});

// C. Invest
app.post('/api/invest', (req, res) => {
    const { school_id, amount } = req.body;

    const school = schools.find(s => s.id === parseInt(school_id));
    if (!school) {
        return res.status(404).json({ error: 'School not found' });
    }

    school.raised_amount += parseInt(amount);
    console.log(`💰 Investment: ${school.name} → Rp ${school.raised_amount}`);

    res.json({ message: 'Investment successful!', updatedSchool: school });
});

// =====================
// D. CHAT ENDPOINT (FINAL FIX — NO CONTENT TYPES)
// =====================
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'messages must be a non-empty array' });
        }

        // ---- Convert chat history into plain text prompt
        const prompt = messages
            .slice(-15)
            .map(m => {
                // Handle both string + array content safely
                if (Array.isArray(m.content)) {
                    const textBlock = m.content.find(c => typeof c.text === 'string');
                    return `${m.role}: ${textBlock?.text || ''}`;
                }
                return `${m.role}: ${String(m.content)}`;
            })
            .join('\n');

        // ---- OpenAI call (PLAIN TEXT INPUT)
        const response = await openai.responses.create({
            model: "gpt-4.1-mini",
            input: prompt
        });

        res.json({
            assistant: {
                role: "assistant",
                content: response.output_text
            }
        });

    } catch (err) {
        console.error('❌ Chat error FULL:', err);
        res.status(500).json({
            error: 'OpenAI API error',
            details: err.message
        });
    }
});

// =====================
// START SERVER
// =====================
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});