# Installation

There are several ways to install llama.cpp, depending on your platform and preferences.

| Install via | Windows | Mac | Linux |
| ----------- | ------- | --- | ----- |
| conda-forge | ✅      | ✅  | ✅    |
| Winget      | ✅      |     |       |
| Homebrew    |         | ✅  | ✅    |
| MacPorts    |         | ✅  |       |
| Nix         |         | ✅  | ✅    |

## Homebrew (macOS / Linux)

```sh
brew install llama.cpp
```

The formula is automatically updated with new llama.cpp releases.

## Winget (Windows)

```sh
winget install llama.cpp
```

## conda-forge (Windows, macOS, Linux)

conda-forge provides builds for CUDA (Windows and Linux), Vulkan (Windows and Linux) and Apple Metal (macOS):

```sh
conda install -c conda-forge llama-cpp
```

## MacPorts (macOS)

```sh
sudo port install llama.cpp
```

## Nix (macOS / Linux)

```sh
nix profile install nixpkgs#llama-cpp
```

## Docker

Official images are available for CPU and GPU backends — see the [Docker documentation](https://github.com/ggml-org/llama.cpp/blob/master/docs/docker.md).

```sh
docker run -v /path/to/models:/models ghcr.io/ggml-org/llama.cpp:light -m /models/model.gguf -p "Hello"
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

Enable a GPU backend by passing the corresponding CMake flag, for example `-DGGML_METAL=ON` on Apple Silicon or `-DGGML_CUDA=ON` for NVIDIA GPUs. See the full [build guide](https://github.com/ggml-org/llama.cpp/blob/master/docs/build.md) for all backends and options.

## Verify the installation

```sh
llama-cli --version
```
