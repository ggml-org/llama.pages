<script lang="ts">
	import { Copy, Check } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { deviceInfo } from '$lib/stores/device/index.svelte';

	let copied = $state(false);

	const installCommand = $derived(
		deviceInfo.isWindows
			? 'irm https://llama.app/install.ps1 | iex'
			: 'curl -LsSf https://llama.app/install.sh | sh'
	);

	async function handleCopy() {
		navigator.clipboard.writeText(installCommand);
		toast.success('Copied to clipboard!');
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	}
</script>

<section class="flex flex-col items-center gap-16 py-24 md:py-48">
	<div class="flex flex-col items-center gap-8 text-center">
		<h1 class="text-foreground text-2xl leading-tight font-semibold sm:text-4xl">
			AI that lives on {deviceInfo.osName}.<br class="hidden md:inline" />
			Open-source, private & always local.
		</h1>

		<p class="text-foreground/70 max-w-xl text-lg leading-relaxed">
			Run frontier AI entirely on your machine. No API keys, no telemetry, no limits. Own your
			models and conversation data.
		</p>
	</div>

	<div class="w-full max-w-2xl">
		<div class="bg-foreground/[0.04] border-secondary w-full overflow-hidden rounded-xl border">
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
			class="text-foreground/60 mt-2 flex w-full flex-col items-center justify-center gap-1 text-xs sm:flex-row sm:gap-2"
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
	</div>
</section>
