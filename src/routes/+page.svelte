<script lang="ts">
	import { Copy, Check, ArrowUpRight } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import { MODELS, ORG_AVATARS, repoAuthor } from '$lib/models';

	const HW = 'https://huggingface.co/front/assets/hardware';
	const HARDWARE_REELS = [
		{
			duration: 30,
			items: [
				{ name: 'Apple Silicon', img: `${HW}/apple-silicon.svg` },
				{ name: 'M Ultra', img: `${HW}/m-ultra.webp` },
				{ name: 'RTX 5090', img: `${HW}/rtx-series.webp` },
				{ name: 'CPU', img: `${HW}/cpu.webp` },
				{ name: 'Jetson', img: `${HW}/jetson.webp` }
			]
		},
		{
			duration: 35,
			items: [
				{ name: 'H100', img: `${HW}/h100.webp` },
				{ name: 'MI300', img: `${HW}/mi300.webp` },
				{ name: 'RTX 4090', img: `${HW}/rtx-series.webp` },
				{ name: 'A100', img: `${HW}/gpu.webp` },
				{ name: 'M Pro', img: `${HW}/m-pro.webp` }
			]
		},
		{
			duration: 32,
			items: [
				{ name: 'M Max', img: `${HW}/m-max.webp` },
				{ name: 'DGX Spark', img: `${HW}/spark.webp` },
				{ name: 'T4', img: `${HW}/t4.webp` },
				{ name: 'Radeon RX', img: `${HW}/amd-rx.webp` },
				{ name: 'B200', img: `${HW}/h100.webp` },
				{ name: 'Intel Arc', img: `${HW}/arc.webp` },
				{ name: 'RTX 3090', img: `${HW}/rtx-series.webp` }
			]
		}
	];

	let copied = $state(false);
	let isWindows = $state(false);
	const installCommand = $derived(
		isWindows
			? 'irm https://llama.app/install.ps1 | iex'
			: 'curl -LsSf https://llama.app/install.sh | sh'
	);

	$effect(() => {
		isWindows = navigator.userAgent.toLowerCase().includes('windows');
	});

	async function handleCopy() {
		navigator.clipboard.writeText(installCommand);
		toast.success('Copied to clipboard!');
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	}
</script>

<main class="mx-auto w-full max-w-5xl px-6 md:px-16">
	<SiteHeader />

	<section class="flex flex-col items-center pt-16 pb-12">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="mb-10 size-42"
			width="256"
			height="256"
			fill="none"
			viewBox="0 0 256 256"
			><path
				fill="#FF7529"
				d="M125.608 88.104c16.876-1.407 31.73 2.988 46.145 11.425h-.088l-11.866 21.095c-15.645-12.041-38.849-13.799-54.494-.879-25.226 20.831-23.467 68.997 15.821 69.261 10.987 0 20.303-5.187 30.323-8.614l5.274 21.006c-8.878 4.131-17.931 8.35-27.687 9.668-88.948 12.129-83.85-116.282-3.428-122.962m18.018 55.374h14.063v12.304h-14.063v14.942h-13.184v-14.942H115.5v-12.304h13.624l1.318-1.319v-14.503h13.184zm48.342-1.319 1.318 1.319h13.624v12.304h-14.942v14.942h-13.184v-14.942h-14.063v-12.304h14.063v-15.822h13.184zM101.263 28.601c3.516-1.23 15.557-4.307 15.206 1.933s-8.702 16.964-10.723 22.765c-3.516 10.195-.264 17.227 4.57 26.104l-.088-.088C96.692 83.36 84.123 90.83 74.631 101.288c-1.758-21.27 2.989-64.25 26.632-72.687m15.116 48.956c2.197-18.897 12.833-46.408 36.828-39.464 1.757 2.637-8.174 13.974-9.757 16.875-4.57 8.613-1.494 13.536 1.934 21.71-9.932-1.495-19.161-.264-29.005.879"
			/></svg
		>

		<div
			class="bg-foreground/[0.04] border-secondary w-full max-w-2xl overflow-hidden rounded-xl border"
		>
			<div class="flex items-stretch justify-between">
				<code
					class="text-foreground/90 block min-w-0 flex-1 overflow-x-auto p-4 font-mono text-[15px] whitespace-nowrap"
					>{installCommand}</code
				>
				<button
					class="text-foreground/70 hover:text-foreground border-secondary flex shrink-0 cursor-pointer items-center border-l px-4"
					aria-label={copied ? 'Copied command' : 'Copy command'}
					onclick={handleCopy}
				>
					{#if copied}
						<Check class="size-4" />
					{:else}
						<Copy class="size-4" />
					{/if}
				</button>
			</div>
		</div>

		<div
			class="text-foreground/60 mt-2 flex w-full max-w-2xl flex-col items-center justify-center gap-1 text-xs sm:flex-row sm:gap-2"
		>
			<span>
				Prefer Brew or Winget?
				<a
					href="https://github.com/ggml-org/llama.cpp/blob/master/docs/install.md"
					target="_blank"
					rel="noreferrer"
					class="hover:text-foreground font-medium underline underline-offset-4"
				>
					Package managers
				</a>
			</span>
			<span class="text-foreground/40 hidden sm:inline">·</span>
			<span>
				Rather build from source?
				<a
					href="https://github.com/ggml-org/llama.cpp/blob/master/docs/build.md"
					target="_blank"
					rel="noreferrer"
					class="hover:text-foreground font-medium underline underline-offset-4"
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
			<p class="text-foreground/70 text-base leading-relaxed">
				Run frontier AI entirely on your machine. No API keys, no telemetry, no limits. Take AI
				back.
			</p>
		</div>
		<img
			src="/local-ai.png"
			alt="AI running on your computer"
			class="h-auto w-full rounded-xl dark:hidden"
		/>
		<img
			src="/local-ai-dark.png"
			alt="AI running on your computer"
			class="hidden h-auto w-full rounded-xl dark:block"
		/>
	</section>

	<section class="grid grid-cols-1 items-center gap-12 pt-12 pb-24 md:grid-cols-2">
		<div
			class="bg-foreground/[0.04] border-secondary relative overflow-hidden rounded-xl border md:order-1"
		>
			<pre class="text-foreground/90 overflow-x-auto p-6 pr-4 font-mono text-[14px] lg:pr-0 [scrollbar-width:thin]"><code
					><span class="opacity-50"># 1. Serve a model</span>
llama serve

<span class="opacity-50"># 2. Install the pi-llama plugin</span>
pi install git:github.com/huggingface/pi-llama

<span class="opacity-50"># 3. Run Pi, everything is set</span>
pi</code
				></pre>
			<div
				class="dark:bg-muted-foreground absolute top-4 right-4 flex size-[2.4rem] items-center justify-center rounded-md bg-white p-[0.4rem] shadow-sm"
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
			<p class="text-foreground/70 text-base leading-relaxed">
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
			<p class="text-foreground/70 text-base leading-relaxed">
				From your laptop to a cluster, llama.cpp runs on whatever you have. Same binary, same
				models, same hand-tuned kernels for every GPU and CPU.
			</p>
		</div>
		<div
			class="hardware-slots relative grid h-[17rem] grid-cols-2 gap-3 overflow-hidden sm:grid-cols-3"
		>
			{#each HARDWARE_REELS as reel, reelIndex (reelIndex)}
				<div
					class="overflow-hidden {reelIndex === 2 ? 'hidden sm:block' : ''}"
					style="--reel-duration: {reel.duration}s; --reel-delay: -{reelIndex * 2}s"
				>
					<div class="hardware-reel-track flex flex-col">
						{#each Array(2) as _, copyIndex (copyIndex)}
							<div class="flex flex-col gap-2 pb-2" aria-hidden={copyIndex === 1}>
								{#each reel.items as hw (copyIndex + hw.name)}
									<div
										class="text-foreground bg-foreground/6 flex min-h-12 items-center gap-2.5 rounded-md px-3 py-2.5 text-sm whitespace-nowrap"
									>
										<img
											src={hw.img}
											alt=""
											class="dark:bg-foreground/8 size-7 shrink-0 rounded-md bg-white object-contain p-1"
										/>
										<span>{hw.name}</span>
									</div>
								{/each}
							</div>
						{/each}
					</div>
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
							class="bg-foreground/8 text-foreground/70 rounded-md px-1.5 py-0.5 font-mono text-[9px] sm:text-[11px]"
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

<style>
	.hardware-slots::before,
	.hardware-slots::after {
		position: absolute;
		right: 0;
		left: 0;
		z-index: 1;
		height: 4rem;
		content: '';
		pointer-events: none;
	}

	.hardware-slots::before {
		top: 0;
		background: linear-gradient(to bottom, var(--background) 0%, transparent 100%);
	}

	.hardware-slots::after {
		bottom: 0;
		background: linear-gradient(to top, var(--background) 0%, transparent 100%);
	}

	.hardware-reel-track {
		animation: hardware-reel-spin var(--reel-duration) linear var(--reel-delay) infinite;
	}

	@keyframes hardware-reel-spin {
		from {
			transform: translateY(0);
		}

		to {
			transform: translateY(-50%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hardware-reel-track {
			animation: none;
		}
	}
</style>
