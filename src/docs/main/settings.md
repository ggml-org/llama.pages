# Settings

Open Settings from the llama menu bar icon.

## Server port

The default port is `8080`, matching llama.cpp's `llama-server`. You can set a custom port in Settings.

## Server command

Settings shows the exact `llama-server` command the app runs for the loaded model, with syntax highlighting — useful for reproducing the same configuration from the terminal.

## Expose to network (experimental)

By default the server is only accessible from your Mac (`localhost`). This option allows connections from other devices on your local network. Only enable it if you understand the security risks.

```sh
# bind to all interfaces (0.0.0.0)
defaults write app.llama.Llama exposeToNetwork -bool YES
```

```sh
# or bind to a specific IP (e.g., for Tailscale)
defaults write app.llama.Llama exposeToNetwork -string "100.x.x.x"
```

```sh
# disable (default)
defaults delete app.llama.Llama exposeToNetwork
```

## Deeplinks

The app registers the `llama://` URL scheme, used for example to install models from Hugging Face. The legacy `llamabarn://` scheme continues to work.
