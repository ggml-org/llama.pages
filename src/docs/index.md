# Introduction

llama.cpp lets you run large language models locally on your laptop, desktop, or server with minimal setup and state-of-the-art performance.

With a single command you can chat with a model in your terminal, or spin up an OpenAI-compatible server with a built-in web interface:

```sh
# Chat in your terminal
llama cli -hf ggml-org/gemma-4-e4b-it-GGUF:Q4_0

# Serve an OpenAI-compatible API + web UI
llama serve -hf ggml-org/gemma-4-e4b-it-GGUF:Q4_0
```

`llama serve` starts a convenient chat UI (at the port 8080 by default, see [webui](webui)).

## How it works

llama.cpp runs models stored in the [GGUF](https://github.com/ggml-org/ggml/blob/master/docs/gguf.md) file format. GGUF is a single-file that packages the model weights, tokenizer, and metadata together. Thousands of ready-to-use GGUF models are available on [Hugging Face](https://huggingface.co/models?library=gguf&sort=trending).

On top of this core, the project ships user-facing tools: `llama cli` for the terminal, `llama server` for serving an HTTP API and web UI, plus utilities for benchmarking, quantizing, and evaluating models.

## Next steps

- [Installation](installation) — install prebuilt binaries, use a package manager, Docker, or build from source
- [Quickstart](quickstart) — download a model and run it in minutes
- [Using the CLI](cli) — chat and experiment from the terminal with `llama cli`
- [Running a server](serve) — serve models over HTTP with `llama server`
- [API server](api) — the OpenAI-compatible REST API reference
- [Web UI](webui) — the built-in browser chat interface
