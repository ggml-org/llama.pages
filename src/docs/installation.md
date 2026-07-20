# Installation

There are several ways to get llama.cpp on your machine:

- Install pre-built `llama` binary
- Install with a package manager (the easiest way to stay up to date)
- Download prebuilt binaries from the releases page
- Run with Docker
- Build from source

All of them give you the same set of tools (`llama cli`, `llama serve` and others).

## Install pre-built binary

Easiest way to get started with llama.cpp CLI is as follows. This detects your platform, fetches latest version of llama binary and installs it.

```bash
curl -LsSf https://llama.app/install.sh | sh
```

Get more installation options with different package managers and platforms [here](https://github.com/ggml-org/llama.cpp/blob/master/docs/install.md).

## Verify the installation

```sh
llama cli --version
```

If this prints the version and build info, you are ready to go. Continue with the [Quickstart](quickstart) to download and run your first model. 
