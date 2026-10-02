import express from 'express';
import axios from 'axios';

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/chat", async (req, res) => {
    const { prompt, model = "qwen2.5:0.5b" } = req.body;

    if (typeof prompt !== "string" || !prompt.trim()) {
        return res.status(400).json({ error: "A non-empty prompt is required." });
    }

    try {
        const ollamaResponse = await axios.post("http://localhost:11434/api/generate", {
            model,
            prompt,
            stream: false,
            system: `You are a precise history date assistant. 
                    Answer questions about historical events with only the date or 
                    date range, without explanations or extra facts. Use a clear 
                    format, such as "15 August 1947" or "1756-1763". 
                    If a question could refer to multiple events, 
                    ask which event they mean. If the date is uncertain or disputed, 
                    say so briefly and do not guess.`
        })

        res.json(ollamaResponse.data.response);
    } catch (error) {
        console.error("Failed to call Ollama:", error);
        res.status(502).json({ error: "Could not reach Ollama. Make sure it is running on localhost:11434." });
    }
})

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on port ${port}`));