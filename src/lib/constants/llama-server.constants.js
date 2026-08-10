// Constants for the local Llama server, shared by app content and (via the
// docs preprocessor in svelte.config.js) the markdown docs. Keep the port in
// one place so docs and UI can't drift.

/** Host the local llama server binds by default. */
export const DEFAULT_HOST = 'localhost';

/** Default port the llama server binds. Also interpolated into docs via {{DEFAULT_PORT}}. */
export const DEFAULT_PORT = 8080;

/** Full base URL of the default local llama server. */
export const DEFAULT_URL = `http://${DEFAULT_HOST}:${DEFAULT_PORT}`;

// Parsing/validation used by LlamaServerService.
const NUMERIC_PORT_RE = /^\d+$/;
const PROTOCOL_RE = /^https?:\/\//;
const TRAILING_SLASHES_RE = /\/+$/;
const HTTP_SCHEME = 'http';
const HTTPS_SCHEME = 'https';
const HTTPS_PORT = '443';
const HTTP_PORT = '80';
const MIN_PORT = 1;
const MAX_PORT = 65535;
const LOOPBACK_HOSTS = ['localhost', '127.0.0.1', '[::1]'];
const DATA_KEY = 'data';
const LOOPBACK_TARGET = 'loopback';
const PROBE_TIMEOUT_MS = 1500;

export {
	NUMERIC_PORT_RE,
	PROTOCOL_RE,
	TRAILING_SLASHES_RE,
	HTTP_SCHEME,
	HTTPS_SCHEME,
	HTTPS_PORT,
	HTTP_PORT,
	MIN_PORT,
	MAX_PORT,
	LOOPBACK_HOSTS,
	DATA_KEY,
	LOOPBACK_TARGET,
	PROBE_TIMEOUT_MS
};
