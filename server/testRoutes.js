const axios = require("axios");

const baseURL = "http://localhost:5000/api";

async function testResumeFeedback() {
  try {
    const res = await axios.post(`${baseURL}/resume-feedback`, {
      text: "Experienced software engineer with 3 years in JavaScript and Python.",
    });
    console.log("✅ Resume Feedback:", res.data);
  } catch (error) {
    console.error(
      "❌ Resume Feedback Error:",
      error.response?.data || error.message
    );
  }
}

// async function testJobAnalyze() {
//   try {
//     const res = await axios.post(`${baseURL}/job-analyze`, {
//       text: "Looking for a Data Analyst with SQL, Python, Tableau and problem-solving skills.",
//     });
//     console.log("✅ Job Analyze:", res.data);
//   } catch (error) {
//     console.error(
//       "❌ Job Analyze Error:",
//       error.response?.data || error.message
//     );
//   }
// }

// async function testDashboardInsights() {
//   try {
//     const res = await axios.post(`${baseURL}/dashboard-insights`, {
//       stats: { applied: 7, interview: 3, rejected: 2, hired: 1 },
//     });
//     console.log("✅ Dashboard Insights:", res.data);
//   } catch (error) {
//     console.error(
//       "❌ Dashboard Insights Error:",
//       error.response?.data || error.message
//     );
//   }
// }

async function test() {
  await testResumeFeedback();
//   await testJobAnalyze();
//   await testDashboardInsights();
}

test();

// router.post("/dashboard-insights", async (req, res) => {
//   try {
//     const { stats } = req.body;
//     // { applied: 7, interview: 3, rejected: 2, hired: 1 }

//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "user",
//           content: `You are a motivational career assistant.
//           Based on these stats: ${JSON.stringify(stats)}
//           Write a short motivational summary (max 3 sentences).`,
//         },
//       ],
//     });

//     const summary = response.choices[0].message.content.trim();

//     res.json({ summary });
//   } catch (error) {
//     console.error("Dashboard Insights Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

