# Quickstart

Once llama.cpp is [installed](installation), you can chat with a model in a single command.

## Run your first model

Download and run a model directly from Hugging Face:

```sh
llama-cli -hf ggml-org/gemma-3-1b-it-GGUF
```

Or use a local GGUF file:

```sh
llama-cli -m my_model.gguf
```

Models with a built-in chat template automatically start in conversation mode:

```
> hi, who are you?
Hi there! I'm your helpful assistant! ...

> what is 1+1?
Easy peasy! The answer to 1+1 is... 2!
```

## Start an API server

`llama-server` exposes an OpenAI-compatible HTTP API and a built-in web UI:

```sh
llama-server -hf ggml-org/gemma-3-1b-it-GGUF
```

- Web UI: `http://localhost:8080`
- Chat completions endpoint: `http://localhost:8080/v1/chat/completions`

See the [llama-server](llama-server) page for more configuration options.

## Constrain the output with a grammar

```sh
llama-cli -m model.gguf -n 256 --grammar-file grammars/json.gbnf \
  -p 'Request: schedule a call at 8pm; Command:'

# {"appointmentTime": "8pm", "appointmentDetails": "schedule a call"}
```

The [grammars/](https://github.com/ggml-org/llama.cpp/tree/master/grammars) folder contains sample grammars; see the [GBNF Guide](https://github.com/ggml-org/llama.cpp/blob/master/grammars/README.md) to write your own.

## Next steps

- Learn how to [find and quantize models](models)
- Explore all CLI options with `llama-cli -h`
