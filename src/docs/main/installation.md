# Installation

There are several ways to install llama.cpp, depending on your platform and preferences.

## Package managers

### Homebrew (macOS / Linux)

```sh
brew install llama.cpp
```

### winget (Windows)

```sh
winget install llama.cpp
```

## Pre-built binaries

Pre-built binaries for every release are available on the [releases page](https://github.com/ggml-org/llama.cpp/releases).

## Build from source

Clone the repository and build with CMake:

```sh
git clone https://github.com/ggml-org/llama.cpp
cd llama.cpp
cmake -B build
cmake --build build --config Release
```

### Backend options

Enable a GPU backend by passing the corresponding CMake flag, for example `-DGGML_METAL=ON` on Apple Silicon or `-DGGML_CUDA=ON` for NVIDIA GPUs.

## Verify the installation

Run a quick sanity check:

```sh
llama-cli --version
```
