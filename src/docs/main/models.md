# Obtaining models

llama.cpp requires models in the [GGUF](https://github.com/ggml-org/ggml/blob/master/docs/gguf.md) file format.

## Download from Hugging Face

The [Hugging Face](https://huggingface.co) platform hosts [thousands of GGUF models](https://huggingface.co/models?library=gguf&sort=trending) compatible with llama.cpp. Any of them can be downloaded and run directly with the `-hf <user>/<model>[:quant]` argument:

```sh
llama-cli -hf ggml-org/gemma-3-1b-it-GGUF
```

```sh
# pick a specific quantization
llama-cli -hf ggml-org/gemma-3-1b-it-GGUF:Q8_0
```

Downloaded models are stored in the standard Hugging Face cache directory, so they are shared with other Hugging Face tools. Set the `MODEL_ENDPOINT` environment variable to download from a different Hugging Face-compatible endpoint.

## Convert to GGUF

Models in other formats can be converted with the `convert_*.py` scripts in the [llama.cpp repository](https://github.com/ggml-org/llama.cpp), or with online tools:

- [GGUF-my-repo](https://huggingface.co/spaces/ggml-org/gguf-my-repo) — convert to GGUF and quantize weights to smaller sizes
- [GGUF-my-LoRA](https://huggingface.co/spaces/ggml-org/gguf-my-lora) — convert LoRA adapters to GGUF
- [GGUF editor](https://huggingface.co/spaces/CISCai/gguf-editor) — edit GGUF metadata in the browser

## Quantization

Quantization reduces model size and memory use at a small cost in quality. llama.cpp supports 1.5-bit through 8-bit integer quantization; common choices are `Q4_K_M` (good balance) and `Q8_0` (near-lossless). Quantize an existing GGUF with:

```sh
llama-quantize model-f16.gguf model-q4_k_m.gguf Q4_K_M
```

To learn more, read the [quantization documentation](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md).
