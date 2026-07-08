# API server

While Llama is running, it serves an [OpenAI API](https://github.com/openai/openai-openapi) compatible HTTP server at:

```
http://localhost:8080/v1
```

## Examples

List installed models:

```sh
curl http://localhost:8080/v1/models
```

Chat with a model (assuming it's installed):

```sh
curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "gemma-3-4b", "messages": [{"role": "user", "content": "Hello"}]}'
```

The requested model loads automatically and unloads when idle.

## Connecting apps

Point any OpenAI-compatible client at `http://localhost:8080/v1` (no API key required):

- **Chat UIs** — Chatbox, Open WebUI, BoltAI ([instructions](https://github.com/ggml-org/Llama-macOS/discussions/40))
- **Editors** — VS Code, Zed, Xcode ([instructions](https://github.com/ggml-org/Llama-macOS/discussions/43))
- **CLI tools** — OpenCode ([instructions](https://github.com/ggml-org/Llama-macOS/discussions/44)), Claude Code ([instructions](https://github.com/ggml-org/Llama-macOS/discussions/45))

## Web UI

A built-in web UI is available at [http://localhost:8080](http://localhost:8080).

## Full reference

The server is powered by llama.cpp's `llama-server` — see the complete [API reference](https://github.com/ggml-org/llama.cpp/tree/master/tools/server#api-endpoints) for all endpoints and parameters. The exact server command in use is shown in [Settings](settings).
