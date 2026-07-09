# Quickstart

Once Llama is [installed](installation), you're a couple of clicks away from chatting with a local model.

## 1. Install a model

Click the llama icon in your menu bar. The **Recommended for your Mac** section suggests models that fit your hardware — every listed model is auto-configured with optimal settings, so just click one to download it. Download progress shows as a ring with pause/play controls.

## 2. Chat

Open the built-in web UI at [http://localhost:8080](http://localhost:8080) — or open the chat UI for a model straight from its expanded details in the menu.

## 3. Use it from anywhere

Llama serves an OpenAI-compatible API, so any client can talk to it:

```sh
curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "gemma-3-4b", "messages": [{"role": "user", "content": "Hello"}]}'
```

Replace `gemma-3-4b` with any model ID from `http://localhost:8080/v1/models`.

Models load automatically when requested and unload when idle — no manual starting or stopping.

## Next steps

- Learn more about [managing models](models)
- Connect your editor or chat app via the [API server](api)
