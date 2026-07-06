// Per-brand logos, mirroring LlamaBarn's ModelLogos asset set.
// SVGs are inlined (?raw) so they inherit text color via `currentColor`.
import gemma from './logos/gemma.svg?raw';
import qwen from './logos/qwen.svg?raw';
import mistral from './logos/mistral.svg?raw';
import openai from './logos/openai.svg?raw';
import nvidia from './logos/nvidia.svg?raw';
// GLM models are made by Z.ai, so we use the Z brand logo for that brand.
import glm from './logos/glm.svg?raw';

// Keyed by the `brand` label used in catalog.json.
const byBrand: Record<string, string> = {
	Gemma: gemma,
	Qwen: qwen,
	Mistral: mistral,
	OpenAI: openai,
	NVIDIA: nvidia,
	GLM: glm
};

// Generic cube, shown for brands we have no logo for.
// Mirrors LlamaBarn's `cube.fill` fallback.
const fallback = `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.25 21 7.5v9L12 21.75 3 16.5v-9L12 2.25Zm0 2.31L5.4 8.25 12 12l6.6-3.75L12 4.56Zm-7.5 5.19v6l6.75 3.94v-6.06L4.5 9.75Zm15 0-6.75 3.88v6.06L19.5 15.75v-6Z"/></svg>`;

// Inline SVG markup for a brand's logo, falling back to a generic cube.
export function logoFor(brand: string): string {
	return byBrand[brand] ?? fallback;
}
