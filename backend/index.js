// =====================
// ENV SETUP
// =====================
require("dotenv").config();

// =====================
// IMPORTS
// =====================
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Groq = require("groq-sdk");

// =====================
// APP SETUP
// =====================
const app = express();

// Render uses an environment variable for PORT (usually 10000)
const PORT = process.env.PORT || 5001;

// =====================
// CORS CONFIGURATION
// =====================
// Explicitly allowing your Firebase domains and Localhost
app.use(cors({
    origin: [
        "https://suntrackers-9171b.web.app",
        "https://suntrackers-9171b.firebaseapp.com",
        "http://localhost:5173"
    ],
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(bodyParser.json());

// =====================
// GROQ CLIENT
// =====================
const groqApiKey = process.env.GROQ_API_KEY;

let groq;
if (groqApiKey) {
    groq = new Groq({ apiKey: groqApiKey });
    console.log("✅ Groq Client Initialized");
} else {
    console.warn("⚠️ Warning: GROQ_API_KEY is missing from Render environment variables.");
}

// =====================
// DATA (In-Memory Database)
// =====================
let schools = [
    { id: 1, name: "SMA 1 Bandung", district: "Bandung", target_amount: 100000000, raised_amount: 45000000 },
    { id: 2, name: "SMK 3 Bekasi", district: "Bekasi", target_amount: 150000000, raised_amount: 12000000 },
    { id: 3, name: "SDN 2 Bogor", district: "Bogor", target_amount: 50000000, raised_amount: 48000000 }
];

// =====================
// ROUTES
// =====================

// 1. Health Check (Check this URL in your browser to see if server is awake)
app.get("/", (req, res) => {
    res.send("✅ West Java Solar Backend is LIVE and Running on Render!");
});

// 2. Get school projects
app.get("/api/projects", (req, res) => {
    res.json(schools);
});

// 3. Chat endpoint (Groq AI Integration)
app.post("/api/chat", async (req, res) => {
    try {
        const { messages } = req.body;

        if (!groq) {
            return res.status(500).json({ error: "AI service not configured on server. Please check GROQ_API_KEY on Render." });
        }

        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: "Messages are required." });
        }

        // Inject a system prompt to constrain the assistant to solar/West Java topics
        const systemPrompt = `You are an expert assistant focused exclusively on solar energy systems, investments, and local West Java (Jawa Barat) policy and regulations. Only answer questions that are directly related to solar energy (system sizing, panels, inverters, batteries, costs, payback, energy savings, tariffs, installation, and West Java-specific rules). If a user asks about unrelated topics (movies, trending topics, sports, unrelated finance, gossip, etc.), politely refuse and state that you only handle solar/West Java topics. Be concise, factual, and when appropriate recommend consulting a certified solar professional for final decisions.`;

        // Prepend the system message so the model is guided by it
        const messagesWithSystem = [
            { role: "system", content: systemPrompt },
            ...messages
        ];

        // Generate completion with a lower temperature to reduce creative off-topic answers
        const completion = await groq.chat.completions.create({
            model: "moonshotai/kimi-k2-instruct",
            messages: messagesWithSystem,
            temperature: 0.2,
            max_tokens: 800
        });

        const assistantMsg = completion.choices[0].message;
        const assistantText = (assistantMsg?.content || "").toString();

        // Simple allowlist-based post-check to detect clearly off-topic responses.
        // If the model's reply doesn't contain known solar/West Java keywords, refuse.
        const allowKeywords = [
            "solar",
            "panel",
            "pv",
            "photovoltaic",
            "payback",
            "kwh",
            "kw",
            "inverter",
            "battery",
            "storage",
            "west java",
            "jawa barat",
            "policy",
            "regulation",
            "subsidy",
            "installation",
            "tariff",
            "energy",
            "savings",
            "invest",
            "investment",
            "capacity",
            "efficiency",
            "irradiance",
            "insolation",
            "system sizing",
            "cost",
            "payback period"
        ];

        const textLower = assistantText.toLowerCase();
        const containsAllow = allowKeywords.some(k => textLower.includes(k));

        if (!containsAllow) {
            // Return a polite refusal instead of the off-topic assistant text
            return res.json({
                assistant: {
                    role: "assistant",
                    content: "I can only answer questions about solar energy systems, investments, and West Java (Jawa Barat) policy. Please ask a question related to those topics."
                }
            });
        }

        // If it looks on-topic, forward the assistant message
        res.json({ assistant: assistantMsg });

    } catch (err) {
        console.error("❌ Groq Error:", err.message);
        res.status(500).json({
            error: "AI Generation Failed",
            message: err.message
        });
    }
});

// =====================
// START SERVER
// =====================
app.listen(PORT, () => {
    console.log(`🚀 Server is listening on Port ${PORT}`);
});