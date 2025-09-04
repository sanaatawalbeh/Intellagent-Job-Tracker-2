const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const aiRoutes = require("./routes/Ai");
app.use("/api", aiRoutes);

console.log(
  "OpenAI API Key:",
  process.env.OPENAI_API_KEY ? "Loaded " : "Not found ❌"
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//Test route
app.get("/api/test", async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Hello world" }],
    });
    console.log(response.choices[0].message.content);
    res.json(response.choices[0].message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
