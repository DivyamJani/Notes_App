// server/routes/glossaryRoutes.js
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
        messages: [
          {
            role: "system",
            content: `Extract and define technical terms from the text. Return ONLY a valid JSON array of this format (no explanation, no markdown):

[
  { "term": "API", "definition": "Application Programming Interface..." },
  { "term": "React", "definition": "A JavaScript library..." }
]`,
          },
          {
            role: "user",
            content,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiText = response.data.choices?.[0]?.message?.content || "";

    // 🛠️ Try to extract JSON from mixed text
    const match = aiText.match(/\[[\s\S]*\]/); // grabs content between first "[" and last "]"
    if (!match) {
      console.error("Glossary parsing failed. Raw response:", aiText);
      return res.status(400).json({ error: "Invalid AI format", raw: aiText });
    }

    const terms = JSON.parse(match[0]);
    res.json({ terms });

  } catch (err) {
    console.error("Glossary AI Error", err);
    res.status(500).json({ error: "Glossary AI failed" });
  }
});

export default router;
