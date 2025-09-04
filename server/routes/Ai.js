const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//1
router.post("/resume-feedback", async (req, res) => {
  try {
    const { text } = req.body;
      console.log("Received text:", text);


    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // أو gpt-3.5-turbo لو بدك أخف
      messages: [
        {
          role: "user",
          content: `Analyze this resume and give structured feedback:
          Resume Text: ${text}
          Return JSON with:
          - grammar: grammar improvements
          - strengths: strong points
          - weaknesses: weak points
          - keywords: recommended keywords to add
          `,
        },
      ],
      response_format: { type: "json_object" }, 
    });

    const feedback = JSON.parse(response.choices[0].message.content);
    res.json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

//2
router.post("/job-analyze", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Analyze the following job description and return JSON with:
          Job Description: ${text}
          JSON Structure:
          - skills: key required skills
          - keywords: recommended keywords
          - suitability: a suitability rating between 0 and 100`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const analysis = JSON.parse(response.choices[0].message.content);
    res.json(analysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


//3
router.post("/dashboard-insights", async (req, res) => {
  try {
    const { stats } = req.body;
    // مثال على stats:
    // {
    //   "applied": 7,
    //   "interview": 3,
    //   "rejected": 2,
    //   "hired": 1
    // }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `You are a motivational career assistant.
          Based on the following job search stats, write a short motivational summary (max 3 sentences).
          
          Stats: ${JSON.stringify(stats)}

          Return JSON with:
          - summary: motivational text
          `,
        },
      ],
      response_format: { type: "json_object" },
    });

    const insight = JSON.parse(response.choices[0].message.content);
    res.json(insight);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/chatbot", async (req, res) => {
  try {
    const { message, conversation = [] } = req.body;

    const messages = [...conversation, { role: "user", content: message }];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    });

    const aiMessage = response.choices[0].message.content.trim();

    res.json({ message: aiMessage });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ error: error.message });
  }
});


// router.post("/dashboard-insights", async (req, res) => {
//   try {
//     const { stats } = req.body;

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "user",
//           content: `Summarize in 2 motivational sentences: ${JSON.stringify(
//             stats
//           )}`,
//         },
//       ],
//     });

//     res.json({ summary: response.choices[0].message.content });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

module.exports = router;
