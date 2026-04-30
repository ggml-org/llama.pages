export type ModelRepo = {
	name: string;
	quants?: string[];
};

export type Model = {
	id: string;
	slug: string;
	name: string;
	params: string;
	description: string;
	repos: ModelRepo[];
};

export const ORG_AVATARS: Record<string, string> = {
	Qwen: 'https://cdn-avatars.huggingface.co/v1/production/uploads/620760a26e3b7210c2ff1943/-s1gyJfvbE1RgO5iBeNOi.png',
	google:
		'https://cdn-avatars.huggingface.co/v1/production/uploads/5dd96eb166059660ed1ee413/WtA3YYitedOr9n02eHfJe.png',
	openai:
		'https://cdn-avatars.huggingface.co/v1/production/uploads/68783facef79a05727260de3/UPX5RQxiPGA-ZbBmArIKq.png',
	'stepfun-ai':
		'https://cdn-avatars.huggingface.co/v1/production/uploads/644f7e6233ac8f46fa0b9e26/CmF2ocXhkr2UtHXgmwq7-.png',
	unsloth:
		'https://cdn-avatars.huggingface.co/v1/production/uploads/62ecdc18b72a69615d6bd857/E4lkPz1TZNLzIFr_dR273.png',
	'ggml-org':
		'https://cdn-avatars.huggingface.co/v1/production/uploads/63148d3b996c52bf0142cdbe/HXyNkyB0_nHI5WDNdiKHZ.png',
	bartowski:
		'https://cdn-avatars.huggingface.co/v1/production/uploads/6435718aaaef013d1aec3b8b/XKf-8MA47tjVAM6SCX0MP.jpeg',
	'lmstudio-community':
		'https://cdn-avatars.huggingface.co/v1/production/uploads/64445e5f1bc692d87b27e183/Quwh3tlKXa1y7aduVfxZi.png',
	ubergarm:
		'https://cdn-avatars.huggingface.co/v1/production/uploads/65d3e4b45bea2700d1f7b89e/xJhcJFQlo-_TvAPbCxyqE.jpeg'
};

export function repoAuthor(name: string) {
	return name.split('/')[0];
}

export const DEFAULT_QUANTS = ['Q4_0', 'Q4_K_M', 'Q5_K_M', 'Q6_K', 'Q8_0'];

export const MODELS: Model[] = [
	{
		id: 'Qwen/Qwen3.6-27B',
		slug: 'Qwen3.6-27B',
		name: 'Qwen3.6-27B',
		params: '27B params',
		description: 'Coding & reasoning. Single-GPU sweet spot.',
		repos: [
			{ name: 'unsloth/Qwen3.6-27B-GGUF', quants: DEFAULT_QUANTS },
			{ name: 'bartowski/Qwen_Qwen3.6-27B-GGUF', quants: DEFAULT_QUANTS },
			{ name: 'lmstudio-community/Qwen3.6-27B-GGUF', quants: DEFAULT_QUANTS },
			{ name: 'ggml-org/Qwen3.6-27B-GGUF', quants: DEFAULT_QUANTS }
		]
	},
	{
		id: 'Qwen/Qwen3.6-35B-A3B',
		slug: 'Qwen3.6-35B-A3B',
		name: 'Qwen3.6-35B-A3B',
		params: '35B MoE · 3B active',
		description: 'MoE: 35B-class quality at 3B-class speed.',
		repos: [
			{ name: 'unsloth/Qwen3.6-35B-A3B-GGUF', quants: DEFAULT_QUANTS },
			{ name: 'bartowski/Qwen_Qwen3.6-35B-A3B-GGUF', quants: DEFAULT_QUANTS },
			{ name: 'lmstudio-community/Qwen3.6-35B-A3B-GGUF', quants: DEFAULT_QUANTS }
		]
	},
	{
		id: 'google/gemma-4-26B-A4B-it',
		slug: 'gemma-4-26B-A4B',
		name: 'Gemma-4-26B-A4B',
		params: '26B MoE · 4B active',
		description: "Google's desktop MoE. Strong reasoning, fast inference.",
		repos: [
			{ name: 'unsloth/gemma-4-26B-A4B-it-GGUF', quants: DEFAULT_QUANTS },
			{ name: 'ggml-org/gemma-4-26B-A4B-it-GGUF', quants: DEFAULT_QUANTS },
			{ name: 'bartowski/google_gemma-4-26B-A4B-it-GGUF', quants: DEFAULT_QUANTS },
			{ name: 'lmstudio-community/gemma-4-26B-A4B-it-GGUF', quants: DEFAULT_QUANTS }
		]
	},
	{
		id: 'google/gemma-4-E4B-it',
		slug: 'Gemma-4-E4B',
		name: 'Gemma-4-E4B',
		params: '4B effective',
		description: 'Tiny footprint. Runs on phones and low-end laptops.',
		repos: [
			{ name: 'unsloth/gemma-4-E4B-it-GGUF', quants: DEFAULT_QUANTS },
			{ name: 'bartowski/google_gemma-4-E4B-it-GGUF', quants: DEFAULT_QUANTS },
			{ name: 'lmstudio-community/gemma-4-E4B-it-GGUF', quants: DEFAULT_QUANTS }
		]
	},
	{
		id: 'openai/gpt-oss-20b',
		slug: 'gpt-oss-20b',
		name: 'gpt-oss-20b',
		params: '20B params',
		description: "OpenAI's open weights. Frontier reasoning, local.",
		repos: [
			{ name: 'unsloth/gpt-oss-20b-GGUF', quants: DEFAULT_QUANTS },
			{ name: 'ggml-org/gpt-oss-20b-GGUF', quants: DEFAULT_QUANTS },
			{ name: 'lmstudio-community/gpt-oss-20b-GGUF', quants: DEFAULT_QUANTS },
			{ name: 'bartowski/openai_gpt-oss-20b-GGUF', quants: DEFAULT_QUANTS }
		]
	},
	{
		id: 'stepfun-ai/Step-3.5-Flash',
		slug: 'Step-3.5-Flash',
		name: 'Step-3.5-Flash',
		params: 'Flash variant',
		description: 'Snappy generalist for everyday chat and writing.',
		repos: [
			{ name: 'bartowski/stepfun-ai_Step-3.5-Flash-GGUF', quants: DEFAULT_QUANTS },
			{ name: 'ggml-org/Step-3.5-Flash-GGUF', quants: DEFAULT_QUANTS },
			{ name: 'ubergarm/Step-3.5-Flash-GGUF', quants: DEFAULT_QUANTS }
		]
	}
];

export function getModel(slug: string): Model | undefined {
	return MODELS.find((m) => m.slug === slug);
}
