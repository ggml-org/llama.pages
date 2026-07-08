# llama-server

A lightweight, [OpenAI API](https://github.com/openai/openai-openapi) compatible HTTP server for serving LLMs, with a built-in web UI.

## Start the server

```sh
llama-server -m model.gguf --port 8080
```

- Web UI: `http://localhost:8080`
- Chat completions: `http://localhost:8080/v1/chat/completions`

Use it with any OpenAI client:

```sh
curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello!"}]}'
```

## Common configurations

### Multiple users and parallel decoding

```sh
# up to 4 concurrent requests, each with 4096 max context
llama-server -m model.gguf -c 16384 -np 4
```

### Speculative decoding

```sh
# the draft.gguf model should be a small variant of the target model.gguf
llama-server -m model.gguf -md draft.gguf
```

### Serve an embedding model

```sh
llama-server -m model.gguf --embedding --pooling cls -ub 8192
```

### Multimodal

`llama-server` supports multimodal models — see the [multimodal documentation](https://github.com/ggml-org/llama.cpp/blob/master/docs/multimodal.md).

## Learn more

- [Full server documentation](https://github.com/ggml-org/llama.cpp/tree/master/tools/server)
- [REST API changelog](https://github.com/ggml-org/llama.cpp/issues/9291)
- [Guide: using the llama.cpp web UI](https://github.com/ggml-org/llama.cpp/discussions/16938)
