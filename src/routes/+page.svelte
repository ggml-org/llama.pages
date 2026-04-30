<script lang="ts">
	import { Copy, Check, ArrowUpRight } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import { MODELS, ORG_AVATARS, repoAuthor } from '$lib/models';

	const HW = 'https://huggingface.co/front/assets/hardware';
	const HARDWARE_ROWS = [
		{
			indent: 96,
			items: [
				{ name: 'Apple Silicon', img: `${HW}/apple-silicon.svg` },
				{ name: 'M Ultra', img: `${HW}/m-ultra.webp` },
				{ name: 'RTX 5090', img: `${HW}/rtx-series.webp` }
			]
		},
		{
			indent: 144,
			items: [
				{ name: 'H100', img: `${HW}/h100.webp` },
				{ name: 'MI300', img: `${HW}/mi300.webp` },
				{ name: 'RTX 4090', img: `${HW}/rtx-series.webp` }
			]
		},
		{
			indent: 60,
			items: [
				{ name: 'M Max', img: `${HW}/m-max.webp` },
				{ name: 'A100', img: `${HW}/gpu.webp` },
				{ name: 'DGX Spark', img: `${HW}/spark.webp` },
				{ name: 'T4', img: `${HW}/t4.webp` }
			]
		},
		{
			indent: 148,
			items: [
				{ name: 'Jetson', img: `${HW}/jetson.webp` },
				{ name: 'B200', img: `${HW}/h100.webp` },
				{ name: 'Intel Arc', img: `${HW}/arc.webp` }
			]
		},
		{
			indent: 64,
			items: [
				{ name: 'CPU', img: `${HW}/cpu.webp` },
				{ name: 'Radeon RX', img: `${HW}/amd-rx.webp` },
				{ name: 'M Pro', img: `${HW}/m-pro.webp` },
				{ name: 'RTX 3090', img: `${HW}/rtx-series.webp` }
			]
		}
	];

	let copied = $state(false);

	async function handleCopy() {
		navigator.clipboard.writeText('curl -fsSL https://llama.app/install.sh | bash');
		toast.success('Copied to clipboard!');
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	}
</script>

<main class="mx-auto w-full max-w-5xl px-8 md:px-16">
	<SiteHeader />

	<section class="flex flex-col items-center pt-16 pb-12">
		<svg
			class="mb-16 size-56"
			xmlns="http://www.w3.org/2000/svg"
			width="363"
			height="363"
			fill="none"
			viewBox="0 0 363 363"
		>
			<path
				fill="#fe8335"
				d="M166.803 142.771c22.124-4.251 50.769 4.978 69.122 15.226l-17.462 25.774c-21.66-11.329-42.669-16.939-67.235-7.716-28.979 10.88-44.454 45.798-30.912 70.241 4.635 8.518 13.134 15.048 23.527 18.076 20.786 6.203 40.747-.104 59.342-7.766l1.968-.201c2.564 2.834 7.58 21.921 8.825 26.246-33.66 15.054-73.572 20.947-106.293.009-16.022-10.308-26.555-25.687-29.23-42.693-8.025-48.375 32.415-90.569 88.348-97.196m27.339 67.698c6.873-.116 14.006-.056 20.907-.072l-.056 16.62-20.851-.022v18.877l-20.119-.001.047-18.839-20.749-.044-.018-16.586 20.73-.043-.028-18.735 20.137-.045zm70.678-18.863-.008 18.815 20.749-.027v16.628l-20.759-.062c.065 4.062.771 16.099-1.189 18.905l-18.799.003c-.185-5.994.018-12.77.046-18.827l-20.971-.052v-16.577l20.925-.024-.046-18.793zM142.228 67.118c4.941-.365 7.235-1.02 11.126 1.434 4.784 7.857-13.56 27.164-15.38 36.736-1.988 10.495 3.232 18.363 9.102 26.768-18.669 5.564-25.682 8.761-41.546 18.783-3.891 2.893-8.433 6.745-12.27 9.821-.287-32.614 3.038-85.15 48.968-93.542m47.433 12.804c6.26-.504 14.666-2.344 18.307 2.766.046 15.246-28.998 14.13-9.809 47.073-4.941-.766-13.151-1.006-18.389-1.289-10.747.511-15.828.864-26.249 2.652 2.722-20.003 12.753-43.334 36.14-51.202"
			/>
		</svg>

		<div class="bg-foreground/[0.04] w-full max-w-2xl rounded-xl">
			<div class="flex items-center justify-between gap-4 px-6 py-5">
				<code class="text-foreground/90 font-mono text-[15px]"
					>curl -fsSL https://llama.app/install.sh | bash</code
				>
				<button
					class="text-foreground/70 hover:text-foreground cursor-pointer"
					aria-label={copied ? 'Copied command' : 'Copy command'}
					onclick={handleCopy}
				>
					{#if copied}
						<Check class="size-5" />
					{:else}
						<Copy class="size-5" />
					{/if}
				</button>
			</div>
		</div>

		<div
			class="text-foreground/60 mt-2 flex w-full max-w-2xl items-center justify-center gap-2 text-xs"
		>
			<span>
				Prefer Brew or Winget?
				<a
					href="https://github.com/ggml-org/llama.cpp/blob/master/docs/install.md"
					target="_blank"
					rel="noreferrer"
					class="font-medium underline underline-offset-4"
				>
					Package managers
				</a>
			</span>
			<span class="text-foreground/40">·</span>
			<span>
				Rather build from source?
				<a
					href="https://github.com/ggml-org/llama.cpp/blob/master/docs/build.md"
					target="_blank"
					rel="noreferrer"
					class="font-medium underline underline-offset-4"
				>
					Follow instructions
				</a>
			</span>
		</div>
	</section>

	<section class="grid grid-cols-1 items-center gap-12 pt-12 pb-12 md:grid-cols-2">
		<div class="flex flex-col gap-6">
			<h2 class="text-foreground text-2xl font-semibold tracking-tight">
				AI that lives on your computer.<br />
				Open-source, private, always local.
			</h2>
			<p class="text-foreground text-base leading-relaxed">
				Run frontier AI entirely on your machine. No API keys, no telemetry, no limits. Take AI
				back.
			</p>
		</div>
		<img src="/local-ai.png" alt="AI running on your computer" class="h-auto w-full rounded-md" />
	</section>

	<section class="grid grid-cols-1 items-center gap-12 pt-12 pb-24 md:grid-cols-2">
		<div class="relative md:order-1">
			<pre
				class="bg-foreground/[0.04] text-foreground/90 overflow-x-auto rounded-xl p-6 font-mono text-[15px]"><code
					><span class="opacity-50"># 1. Serve a model</span>
llama serve

<span class="opacity-50"># 2. Run Pi, it will autodiscover it</span>
pi</code
				></pre>
			<div
				class="absolute top-4 right-4 flex size-12 items-center justify-center rounded-md bg-white p-2 shadow-sm"
			>
				<img
					src="https://huggingface.co/buckets/julien-c/my-training-bucket/resolve/pi-logo-dark.svg"
					alt="Pi"
					class="h-full w-auto"
				/>
			</div>
		</div>
		<div class="flex flex-col gap-6">
			<h2 class="text-foreground text-2xl font-semibold tracking-tight">
				Pair it with a local coding agent.
			</h2>
			<p class="text-foreground text-base leading-relaxed">
				Run <code class="font-mono text-sm">llama serve</code>, then launch
				<a
					href="https://github.com/badlogic/pi-mono"
					target="_blank"
					rel="noreferrer"
					class="font-medium underline underline-offset-4">Pi</a
				>. It auto-discovers your local model. No config, no API keys. Files stay on your machine,
				requests never leave it.
			</p>
		</div>
	</section>

	<section class="grid grid-cols-1 items-center gap-12 pt-12 pb-24 md:grid-cols-2">
		<div class="flex flex-col gap-6">
			<h2 class="text-foreground text-2xl font-semibold tracking-tight">
				Optimized for any hardware.
			</h2>
			<p class="text-foreground text-base leading-relaxed">
				From your laptop to a cluster, llama.cpp runs on whatever you have. Same binary, same
				models, same hand-tuned kernels for every GPU and CPU.
			</p>
		</div>
		<div class="bg-foreground/[0.04] space-y-2 overflow-hidden rounded-xl p-6">
			{#each HARDWARE_ROWS as row, i (i)}
				<div class="flex flex-nowrap gap-2" style="padding-left: {row.indent}px">
					{#each row.items as hw (hw.name)}
						<span
							class="bg-background text-foreground inline-flex shrink-0 items-center gap-0.5 rounded-full py-1 pr-3 pl-1 text-sm whitespace-nowrap shadow-sm"
						>
							<img src={hw.img} alt="" class="size-6 rounded-full bg-white object-contain p-0.5" />
							{hw.name}
						</span>
					{/each}
				</div>
			{/each}
		</div>
	</section>

	<section class="pb-24">
		<h2 class="text-foreground mb-8 text-2xl font-semibold tracking-tight">Run your first model</h2>

		<div class="flex flex-col gap-2">
			{#each MODELS as model (model.slug)}
				<a
					href={resolve('/models/[model]', { model: model.slug })}
					class="group bg-foreground/[0.04] hover:bg-foreground/[0.07] flex items-center gap-2 rounded-xl px-5 py-4 transition-colors"
				>
					<img
						src={ORG_AVATARS[repoAuthor(model.id)]}
						alt="{repoAuthor(model.id)} avatar"
						class="size-4 shrink-0 rounded-md"
					/>
					<div class="flex shrink-0 items-center gap-2">
						<h3 class="text-foreground text-base font-semibold">{model.name}</h3>
						<span
							class="bg-foreground/8 text-foreground/70 rounded-md px-1.5 py-0.5 font-mono text-[11px]"
						>
							{model.params}
						</span>
					</div>
					<p class="text-foreground/70 hidden flex-1 truncate text-sm md:block">
						{model.description}
					</p>
				</a>
			{/each}
		</div>

		<div class="mt-6 flex justify-center">
			<a
				href="https://huggingface.co/models?apps=llama.cpp"
				target="_blank"
				rel="noreferrer"
				class="text-foreground/70 hover:text-foreground inline-flex items-center gap-1.5 text-sm underline underline-offset-4"
			>
				Discover more models on Hugging Face
				<ArrowUpRight class="size-3.5" />
			</a>
		</div>
	</section>
</main>
