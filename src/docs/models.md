# Managing models

## The catalog

The menu's **Recommended for your Mac** section shows every model size that fits your machine, with its quantization next to the name. For the full curated catalog, use **Browse models** in the menu or visit [llama.app](https://llama.app).

## Downloads

- Progress shows as a ring with pause/play inside
- Downloads survive app restarts and resume as paused rows
- Dropped connections pause the download and auto-resume when you're back online

## Installing from Hugging Face

Models can be installed via `llama://` deeplinks, for example from a model page on Hugging Face. (The legacy `llamabarn://` scheme still works.)

## Storage

Models live in the standard Hugging Face cache:

```sh
~/.cache/huggingface/hub
```

The cache is shared with llama.cpp and other Hugging Face-aware tools — a model downloaded in the app is available to `llama-cli -hf`, and vice versa.

## Sideloaded models

Models already present in the Hugging Face cache (including subdirectories) are picked up automatically, with memory requirements measured to check compatibility with your Mac.

## Loading and unloading

Models load when an API request or chat needs them and unload when idle. Model names in the menu match the IDs used in the API (`http://localhost:8080/v1/models`).
