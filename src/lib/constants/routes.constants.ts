// App route paths (parity with llama.cpp's ROUTES object in constants/routes.ts).
export const ROUTES = {
	/** Docs base — clients are redirected to DOCS_INDEX. */
	DOCS: '/docs',
	/** Explicit index page so relative links between markdown pages resolve. */
	DOCS_INDEX: '/docs/index',
	/** The model catalog index. */
	MODELS: '/models'
} as const;

/** API route served by the site (and the llama-server path probed for liveness). */
export const MODELS_PATH = '/v1/models';
