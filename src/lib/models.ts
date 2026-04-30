export type Model = {
	id: string;
	slug: string;
	name: string;
	params: string;
	description: string;
};

export const ORG_AVATARS: Record<string, string> = {
	Qwen: 'https://cdn-avatars.huggingface.co/v1/production/uploads/620760a26e3b7210c2ff1943/-s1gyJfvbE1RgO5iBeNOi.png',
	google:
		'https://cdn-avatars.huggingface.co/v1/production/uploads/5dd96eb166059660ed1ee413/WtA3YYitedOr9n02eHfJe.png',
	openai:
		'https://cdn-avatars.huggingface.co/v1/production/uploads/68783facef79a05727260de3/UPX5RQxiPGA-ZbBmArIKq.png',
	'stepfun-ai':
		'https://cdn-avatars.huggingface.co/v1/production/uploads/644f7e6233ac8f46fa0b9e26/CmF2ocXhkr2UtHXgmwq7-.png'
};

export function repoAuthor(name: string) {
	return name.split('/')[0];
}

export const MODELS: Model[] = [
	{
		id: 'Qwen/Qwen3.6-27B',
		slug: 'Qwen3.6-27B',
		name: 'Qwen3.6-27B',
		params: '27B params',
		description: 'Coding & reasoning. Single-GPU sweet spot.'
	},
	{
		id: 'Qwen/Qwen3.6-35B-A3B',
		slug: 'Qwen3.6-35B-A3B',
		name: 'Qwen3.6-35B-A3B',
		params: '35B MoE · 3B active',
		description: 'MoE: 35B-class quality at 3B-class speed.'
	},
	{
		id: 'google/gemma-4-26B-A4B-it',
		slug: 'gemma-4-26B-A4B',
		name: 'Gemma-4-26B-A4B',
		params: '26B MoE · 4B active',
		description: "Google's desktop MoE. Strong reasoning, fast inference."
	},
	{
		id: 'google/gemma-4-E4B-it',
		slug: 'Gemma-4-E4B',
		name: 'Gemma-4-E4B',
		params: '4B effective',
		description: 'Tiny footprint. Runs on phones and low-end laptops.'
	},
	{
		id: 'openai/gpt-oss-20b',
		slug: 'gpt-oss-20b',
		name: 'gpt-oss-20b',
		params: '20B params',
		description: "OpenAI's open weights. Frontier reasoning, local."
	},
	{
		id: 'stepfun-ai/Step-3.5-Flash',
		slug: 'Step-3.5-Flash',
		name: 'Step-3.5-Flash',
		params: 'Flash variant',
		description: 'Snappy generalist for everyday chat and writing.'
	}
];

export function getModel(slug: string): Model | undefined {
	return MODELS.find((m) => m.slug === slug);
}
