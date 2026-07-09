# Installation

## Homebrew

```sh
brew install --cask llama-app
```

## Direct download

Download `Llama.dmg` from the [releases page](https://github.com/ggml-org/Llama-macOS/releases), open it and drag Llama into your Applications folder.

## The llama.cpp engine

Llama shares one llama.cpp install with your command line:

- If you already have llama.cpp (via Homebrew or the [install script](https://llama.app)), the app uses it.
- If the app installs it, `llama-cli` and `llama-server` become available in your terminal too.

The llama.cpp build in use is shown in the footer of the app's menu.

## Updates

Llama updates automatically. Release notes for every version are published on the [releases page](https://github.com/ggml-org/Llama-macOS/releases).

## Uninstall

Quit Llama, delete the app from Applications, and optionally remove downloaded models from the Hugging Face cache at `~/.cache/huggingface/hub`.
