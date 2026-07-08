# Introduction

llama.cpp enables LLM inference with minimal setup and state-of-the-art performance on a wide range of hardware — locally and in the cloud.

## Highlights

- Plain C/C++ implementation without any dependencies
- Apple Silicon is a first-class citizen — optimized via ARM NEON, Accelerate and Metal frameworks
- AVX, AVX2, AVX512 and AMX support for x86 architectures
- 1.5-bit, 2-bit, 3-bit, 4-bit, 5-bit, 6-bit, and 8-bit integer quantization for faster inference and reduced memory use
- Custom CUDA kernels for running LLMs on NVIDIA GPUs (support for AMD GPUs via HIP and Moore Threads GPUs via MUSA)
- Vulkan and SYCL backend support
- CPU+GPU hybrid inference to partially accelerate models larger than the total VRAM capacity

The llama.cpp project is the main playground for developing new features for the [ggml](https://github.com/ggml-org/ggml) library.

## Supported backends

| Backend | Target devices    |
| ------- | ----------------- |
| Metal   | Apple Silicon     |
| CUDA    | NVIDIA GPU        |
| HIP     | AMD GPU           |
| Vulkan  | GPU               |
| SYCL    | Intel GPU         |
| MUSA    | Moore Threads GPU |
| CANN    | Ascend NPU        |
| OpenCL  | Adreno GPU        |
| WebGPU  | All               |
| BLAS    | All               |
| RPC     | All               |

See the [build guide](https://github.com/ggml-org/llama.cpp/blob/master/docs/build.md) for how to enable each backend.

## Ecosystem

- [llama-server](llama-server) — OpenAI-compatible HTTP server with a built-in web UI
- [llama.vscode](https://github.com/ggml-org/llama.vscode) — VS Code extension for local FIM completions
- [llama.vim](https://github.com/ggml-org/llama.vim) — Vim/Neovim plugin for local FIM completions
- Thousands of [GGUF models on Hugging Face](https://huggingface.co/models?library=gguf&sort=trending) ready to run

## Next steps

- [Install llama.cpp](installation) on your machine
- Run your first model in the [Quickstart](quickstart)
