import { STORAGE_KEY } from '$lib/constants/docs';
import { DEFAULT_HOST, DEFAULT_PORT, DEFAULT_URL } from '$lib/constants/llama-server';

const NUMERIC_PORT_RE = /^\d+$/;
const PROTOCOL_RE = /^https?:\/\//;
const TRAILING_SLASHES_RE = /\/+$/;
const HTTP_SCHEME = 'http';
const HTTPS_SCHEME = 'https';
const HTTPS_PORT = '443';
const HTTP_PORT = '80';
const MIN_PORT = 1;
const MAX_PORT = 65535;
const LOOPBACK_HOSTS: string[] = ['localhost', '127.0.0.1', '[::1]'];
const MODELS_PATH = '/v1/models';
const DATA_KEY = 'data';
const LOOPBACK_TARGET = 'loopback';
const PROBE_TIMEOUT_MS = 1500;

/**
 * Client for the user's Llama server (the local menu bar app by default, or
 * any self-hosted llama-server) from the docs pages.
 *
 * Detection is ADVISORY ONLY — a failed probe never hard-blocks navigation,
 * because it is ambiguous: the server may be down, on another port, or the
 * browser may have blocked the request (e.g. Chrome 142+ gates local
 * requests behind the Local Network Access permission).
 * See https://github.com/ggml-org/llama.pages/pull/30#discussion_r3551723116
 */
export class LlamaServerService {
	static readonly DEFAULT_URL = DEFAULT_URL;
	static readonly DEFAULT_PORT = DEFAULT_PORT;

	static getUrl(): string {
		return localStorage.getItem(STORAGE_KEY) ?? LlamaServerService.DEFAULT_URL;
	}

	static saveUrl(base: string): void {
		localStorage.setItem(STORAGE_KEY, base);
	}

	/**
	 * Accepts a bare port or a URL ("llama.example.com",
	 * "https://llama.example.com"); returns a normalized base URL, or null.
	 */
	static parseInput(input: string): string | null {
		const trimmed = input.trim().replace(TRAILING_SLASHES_RE, '');

		if (!trimmed) return null;

		if (NUMERIC_PORT_RE.test(trimmed)) {
			const port = Number(trimmed);

			return port >= MIN_PORT && port <= MAX_PORT
				? `${HTTP_SCHEME}://${DEFAULT_HOST}:${port}`
				: null;
		}

		const withProtocol = PROTOCOL_RE.test(trimmed) ? trimmed : `${HTTPS_SCHEME}://${trimmed}`;

		try {
			const url = new URL(withProtocol);
			// new URL() accepts almost any string as a single-label hostname
			// (e.g. a port typo like "8080x"), so require a plausible host:
			// localhost, a dotted name/IP, or a bracketed IPv6 address.
			const host = url.hostname;

			if (!LOOPBACK_HOSTS.includes(host) && !host.includes('.') && !host.startsWith('[')) {
				return null;
			}

			return url.origin + (url.pathname === '/' ? '' : url.pathname);
		} catch {
			return null;
		}
	}

	static isLoopback(base: string): boolean {
		try {
			const { hostname } = new URL(base);

			return LOOPBACK_HOSTS.includes(hostname);
		} catch {
			return false;
		}
	}

	/** ':8080' for a local server, the hostname for a remote one. */
	static label(base: string): string {
		try {
			const url = new URL(base);

			if (LlamaServerService.isLoopback(base)) {
				return `:${url.port || (url.protocol === `${HTTPS_SCHEME}:` ? HTTPS_PORT : HTTP_PORT)}`;
			}

			return url.hostname;
		} catch {
			return base;
		}
	}

	static async probe(base: string): Promise<boolean> {
		try {
			const init: RequestInit & { targetAddressSpace?: 'loopback' } = {
				signal: AbortSignal.timeout(PROBE_TIMEOUT_MS)
			};

			// Marks the request as intentionally targeting loopback for Chrome's
			// Local Network Access permission model.
			if (LlamaServerService.isLoopback(base)) init.targetAddressSpace = LOOPBACK_TARGET;

			const res = await fetch(`${base}${MODELS_PATH}`, init);

			if (!res.ok) return false;

			const body = await res.json();

			return Array.isArray(body?.[DATA_KEY]);
		} catch {
			return false;
		}
	}
}
