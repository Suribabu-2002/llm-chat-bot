import express from "express";
import ollama from "ollama";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  next();
});

app.options("/stream", (req, res) => res.sendStatus(204));

app.post("/stream", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = await ollama.chat({
      model: "glm-5.1:cloud",
      messages, // full history — Ollama handles context natively
      stream: true,
      think: false,
    });

    for await (const chunk of stream) {
      const text = chunk.message.content;
      res.write(`data: ${JSON.stringify(text)}\n\n`);
    }

    res.write("data: [DONE]\n\n");
  } catch (err) {
    res.write(`data: ${JSON.stringify("[ERROR] " + err.message)}\n\n`);
  } finally {
    res.end();
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
