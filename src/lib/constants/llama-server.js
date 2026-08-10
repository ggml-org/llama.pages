// Constants for the local Llama server, shared by app content and (via the
// docs preprocessor in svelte.config.js) the markdown docs. Keep the port in
// one place so docs and UI can't drift.

/** Host the local llama server binds by default. */
export const DEFAULT_HOST = 'localhost';

/** Default port the llama server binds. Also interpolated into docs via {{DEFAULT_PORT}}. */
export const DEFAULT_PORT = 8080;

/** Full base URL of the default local llama server. */
export const DEFAULT_URL = `http://${DEFAULT_HOST}:${DEFAULT_PORT}`;
