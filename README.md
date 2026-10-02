# Chronicle

A small history-date chat app. Ask about a historical event in the browser and get its date from a local Qwen model through Ollama.

## Requirements

- Node.js 18.11 or newer
- Docker Desktop 

## Run locally

Install the Node dependencies and start Ollama with Docker Compose:

```powershell
npm install
docker compose up -d
docker compose exec ollama ollama pull qwen2.5:0.5b
```

Start the web server:

```powershell
npm start
```

Open [http://localhost:8000](http://localhost:8000) in your browser. The web server expects Ollama at `http://localhost:11434`.

If you already have an Ollama container named `ollama` from a previous `docker run`, stop and remove that container before starting Compose to avoid a container-name conflict. The named `ollama_data` volume stores model files; do not remove it if you want to keep them.

## Chat API

Send a `POST` request to `/chat` with a JSON body containing a non-empty `prompt`. The `model` field is optional and defaults to `qwen2.5:0.5b`.

```powershell
Invoke-RestMethod -Uri "http://localhost:8000/chat" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"prompt":"When was the Battle of Hastings?"}'
```

The response is a JSON string containing the model's answer. Invalid or empty prompts return HTTP `400`. If the server cannot reach Ollama, it returns HTTP `502`.

To stop the services, run `docker compose down`. This keeps the `ollama_data` volume and downloaded models.