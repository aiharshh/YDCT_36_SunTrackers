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
const https = require("https");
const http = require("http");
const { URL } = require("url");

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
// URL FETCHING UTILITY
// =====================
function fetchUrlContent(urlString) {
    return new Promise((resolve, reject) => {
        try {
            const url = new URL(urlString);
            const client = url.protocol === "https:" ? https : http;
            
            const req = client.get(url.href, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                },
                timeout: 10000
            }, (res) => {
                let data = "";
                
                // Check content type
                const contentType = res.headers["content-type"] || "";
                if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
                    return resolve({ 
                        error: false, 
                        content: null, 
                        message: "URL content is not readable text (may be an image or file)" 
                    });
                }
                
                res.on("data", (chunk) => {
                    data += chunk;
                });
                
                res.on("end", () => {
                    // Simple HTML tag removal for basic text extraction
                    const textContent = data
                        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
                        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
                        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
                        .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
                        .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
                        .replace(/<[^>]+>/g, " ")
                        .replace(/\s+/g, " ")
                        .trim();
                    
                    // Get first 3000 characters for AI context
                    const truncatedContent = textContent.substring(0, 3000);
                    
                    resolve({
                        error: false,
                        content: truncatedContent,
                        title: extractTitle(data),
                        url: urlString
                    });
                });
            });
            
            req.on("error", (err) => {
                reject(err);
            });
            
            req.on("timeout", () => {
                req.destroy();
                reject(new Error("Request timed out"));
            });
            
        } catch (err) {
            reject(err);
        }
    });
}

function extractTitle(html) {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : null;
}

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

// 3. URL fetch endpoint - users can share URLs and the AI will summarize them
app.post("/api/fetch-url", async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }
        
        // Basic URL validation
        try {
            new URL(url);
        } catch {
            return res.status(400).json({ error: "Invalid URL format" });
        }
        
        // Security: Only allow http/https
        const urlObj = new URL(url);
        if (!["http:", "https:"].includes(urlObj.protocol)) {
            return res.status(400).json({ error: "Only HTTP/HTTPS URLs are allowed" });
        }
        
        const result = await fetchUrlContent(url);
        res.json(result);
        
    } catch (err) {
        console.error("URL Fetch Error:", err.message);
        res.status(500).json({ 
            error: true, 
            message: "Failed to fetch URL: " + err.message 
        });
    }
});

// 4. Chat endpoint (Groq AI Integration)
app.post("/api/chat", async (req, res) => {
    try {
        const { messages, urlContent } = req.body;

        if (!groq) {
            return res.status(500).json({ error: "AI service not configured on server. Please check GROQ_API_KEY on Render." });
        }

        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: "Messages are required." });
        }

        // Build the system prompt with optional URL content
        let systemPrompt = `You are an expert assistant focused on solar energy systems, investments, and local West Java (Jawa Barat) policy and regulations. You also help users navigate the PowerWestJava platform.

**LANGUAGE SUPPORT:**
You can respond in both English and Bahasa Indonesia. When users communicate in Bahasa Indonesia, respond naturally in Bahasa Indonesia. When users communicate in English, respond in English.

**URL CONTENT ANALYSIS:**
If the user shares a URL and I've already fetched its content, summarize what the link is about and explain it to the user in a helpful way. Focus on extracting the key information relevant to our solar energy and West Java context.

**LINK GENERATION - VERY IMPORTANT:**
When suggesting users navigate to a page, you MUST use markdown-style links so they become clickable buttons. Use this format:
- [Go to Solar Calculator →](/planner)
- [Browse Investments →](/invest)
- [View Impact Dashboard →](/analysis)
- [Read Knowledge Articles →](/articles)
- [Go to Login →](/login)
- [View Your Profile →](/profile)
- [Return to Home →](/home)

Always include the markdown link in your response when suggesting navigation, making it easy for users to click and go directly to that page.

**PLATFORM ROUTES:**
- /home - Main landing page with hero section, featured articles, and quick actions
- /planner - Solar Calculator: Estimate solar savings, costs, payback period, CO2 reduction
- /invest - Investment Page: Browse and invest in community solar projects
- /analysis - Impact Dashboard: View real-time monitoring of solar installations (requires login)
- /articles - Knowledge Center: Educational articles about solar energy, finance, and sustainability
- /chat - AI Chat Assistant (current conversation)
- /login - User authentication page
- /profile - User profile and settings (requires login)

When users ask questions related to specific platform features, suggest the appropriate page with a markdown link and encourage them to explore. Be helpful, concise, and factual. For technical questions, recommend consulting certified solar professionals.

**CONTENT SCOPE:**
Only answer questions directly related to:
- Solar energy (system sizing, panels, inverters, batteries, costs, payback)
- Energy savings and tariff calculations
- West Java (Jawa Barat) solar policies and regulations
- Community solar investments
- Platform features and navigation
- URLs and links shared by users

If users ask about unrelated topics (movies, sports, unrelated finance, gossip, etc.), politely refuse and redirect to solar/West Java topics.`;

        // If URL content was fetched, add it to the system prompt
        if (urlContent && !urlContent.error && urlContent.content) {
            systemPrompt += `

**ADDITIONAL CONTEXT FROM SHARED URL:**
The user has shared this URL: ${urlContent.url}
${urlContent.title ? `Title: ${urlContent.title}` : ""}

Content from the URL:
---
${urlContent.content}
---

Please summarize and explain what this link is about, especially if it's related to solar energy, West Java, or topics relevant to our platform.`;

            // Add URL-specific keywords to allowlist for this response
            systemPrompt += "\n\nFor this response about the shared URL, you may discuss general content from the webpage.";
        }

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
            max_tokens: 1000
        });

        const assistantMsg = completion.choices[0].message;
        const assistantText = (assistantMsg?.content || "").toString();

        // Only apply keyword filter for non-URL content
        if (!urlContent || urlContent.error || !urlContent.content) {
            // Simple allowlist-based post-check to detect clearly off-topic responses.
            const allowKeywords = [
                "solar", "panel", "pv", "photovoltaic", "payback", "kwh", "kw",
                "inverter", "battery", "storage", "west java", "jawa barat", "policy",
                "regulation", "subsidy", "installation", "tariff", "energy", "savings",
                "invest", "investment", "capacity", "efficiency", "irradiance",
                "insolation", "system sizing", "cost", "payback period", "url", "link",
                "website", "page", "article", "document", "source", "powerwestjava"
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