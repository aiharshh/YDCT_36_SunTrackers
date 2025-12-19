console.log("GROQ KEY:", process.env.GROQ_API_KEY);
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
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

// =====================
// GROQ CLIENT
// =====================
if (!process.env.GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY missing");
  process.exit(1);
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// =====================
// FAKE DATABASE
// =====================
let schools = [
  { id: 1, name: "SMA 1 Bandung", district: "Bandung", target_amount: 100000000, raised_amount: 45000000 },
  { id: 2, name: "SMK 3 Bekasi", district: "Bekasi", target_amount: 150000000, raised_amount: 12000000 },
  { id: 3, name: "SDN 2 Bogor", district: "Bogor", target_amount: 50000000, raised_amount: 48000000 }
];

// =====================
// ROUTES
// =====================

// Health check
app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});

// Get projects
app.get("/api/projects", (req, res) => {
  res.json(schools);
});

// Chat endpoint (GROQ 🔥)
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages required" });
    }

    const completion = await groq.chat.completions.create({
      model: "moonshotai/kimi-k2-instruct", // FAST + FREE
      messages: messages,
      temperature: 0.7
    });

    res.json({
      assistant: completion.choices[0].message
    });

  } catch (err) {
    console.error("❌ Groq error:", err);
    res.status(500).json({
        error: "Groq API error",
        message: err.message,
        status: err.status,
        raw: err
    });
  }
});

// =====================
// START SERVER
// =====================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
