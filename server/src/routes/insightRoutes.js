// server/src/routes/insightRoutes.js
import express from "express";
import axios from "axios";
const router = express.Router();

router.post("/", async (req, res) => {
  const { content } = req.body;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
       // or any model Groq supports
        messages: [
          { role: "system", content: "You're a writing assistant." },
          { role: "user", content: `Suggest improvements for: ${content}` },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const suggestion = response.data.choices[0].message.content;
    res.json({ suggestion });
  } catch (err) {
    console.error("Groq AI error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to get AI suggestion." });
  }
});

export default router;
