# Introduction

llama.cpp enables LLM inference with minimal setup and state-of-the-art performance on a wide range of hardware — locally and in the cloud.

## What is llama.cpp?

The main goal of llama.cpp is to run large language models with a plain C/C++ implementation, without any external dependencies.

- Apple Silicon is a first-class citizen — optimized via ARM NEON, Accelerate and Metal frameworks
- AVX, AVX2, AVX512 and AMX support for x86 architectures
- 1.5-bit, 2-bit, 3-bit, 4-bit, 5-bit, 6-bit, and 8-bit integer quantization for faster inference and reduced memory use
- Custom CUDA kernels for running LLMs on NVIDIA GPUs (support for AMD GPUs via HIP and Moore Threads GPUs via MUSA)
- Vulkan and SYCL backend support
- CPU+GPU hybrid inference to partially accelerate models larger than the total VRAM capacity

## Supported models

llama.cpp supports a large number of model architectures, including LLaMA, Mistral, Qwen, Gemma, Phi and many more. Models are distributed in the [GGUF](https://github.com/ggml-org/ggml/blob/master/docs/gguf.md) file format.

### Where to find models

Thousands of pre-quantized GGUF models are available on [Hugging Face](https://huggingface.co/models?library=gguf).

## Next steps

Head over to the [Installation](installation) page to get llama.cpp running on your machine.
