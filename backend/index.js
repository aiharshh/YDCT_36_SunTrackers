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

        const completion = await groq.chat.completions.create({
            model: "moonshotai/kimi-k2-instruct", 
            messages: messages,
            temperature: 0.7
        });

        res.json({
            assistant: completion.choices[0].message
        });

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