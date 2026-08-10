import {
	DATA_KEY,
	DEFAULT_HOST,
	DEFAULT_URL,
	HTTP_PORT,
	HTTPS_PORT,
	LOOPBACK_HOSTS,
	LOOPBACK_TARGET,
	MAX_PORT,
	MIN_PORT,
	MODELS_PATH,
	NUMERIC_PORT_RE,
	PROBE_TIMEOUT_MS,
	PROTOCOL_RE,
	ROUTES,
	STORAGE_KEY,
	TRAILING_SLASHES_RE
} from '$lib/constants';
import { UrlProtocol } from '$lib/enums';

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
	static getUrl(): string {
		return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_URL;
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
				? `${UrlProtocol.HTTP}//${DEFAULT_HOST}:${port}`
				: null;
		}

		const withProtocol = PROTOCOL_RE.test(trimmed) ? trimmed : `${UrlProtocol.HTTPS}//${trimmed}`;

		try {
			const url = new URL(withProtocol);
			// new URL() accepts almost any string as a single-label hostname
			// (e.g. a port typo like "8080x"), so require a plausible host:
			// localhost, a dotted name/IP, or a bracketed IPv6 address.
			const host = url.hostname;

			if (!LOOPBACK_HOSTS.includes(host) && !host.includes('.') && !host.startsWith('[')) {
				return null;
			}

			return url.origin + (url.pathname === ROUTES.ROOT ? '' : url.pathname);
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
				return `:${url.port || (url.protocol === UrlProtocol.HTTPS ? HTTPS_PORT : HTTP_PORT)}`;
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
