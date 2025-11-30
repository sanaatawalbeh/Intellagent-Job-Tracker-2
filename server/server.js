const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

// لو حابة تزبطي CORS زيادة، فيكِ تحطي origin تبع الفرونت:
const allowedOrigin =
  process.env.CLIENT_ORIGIN || "https://sanaatawalbeh.github.io";

app.use(
  cors({
    origin: allowedOrigin, // أو خليها cors() بس لو مش حابة تشددي
  })
);

app.use(express.json());

// Routes
const aiRoutes = require("./routes/Ai");
app.use("/api", aiRoutes);

// بس للتشييك:
console.log(
  "OpenAI API Key:",
  process.env.OPENAI_API_KEY ? "Loaded ✅" : "Not found ❌"
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Test route (ممكن تخليه عادي)
app.get("/api/test", async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Hello world" }],
    });

    console.log("Test reply:", response.choices[0].message.content);
    res.json(response.choices[0].message);
  } catch (error) {
    console.error("Test route error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 👈 أهم سطر عشان Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
