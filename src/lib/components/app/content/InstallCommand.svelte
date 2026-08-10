<script lang="ts">
	import { Check, Copy } from '@lucide/svelte';
	import { deviceInfo } from '$lib/stores/device/index.svelte';
	import { toast } from 'svelte-sonner';

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

<div class="w-full max-w-2xl">
	<div class="w-full overflow-hidden rounded-xl border border-secondary bg-foreground/4">
		<div class="flex items-stretch justify-between">
			<code
				class="block min-w-0 flex-1 overflow-x-auto p-4 font-mono text-[15px] whitespace-nowrap text-foreground/90"
			>
				{installCommand}
			</code>

			<button
				class="flex shrink-0 cursor-pointer items-center border-l border-secondary px-4 text-foreground/70 hover:text-foreground"
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
		class="mt-2 flex w-full flex-col items-center justify-center gap-1 text-xs text-foreground/60 sm:flex-row sm:gap-2"
	>
		<span>
			Prefer Brew or Winget?
			<a
				href="https://github.com/ggml-org/llama.cpp/blob/master/docs/install.md"
				target="_blank"
				rel="noreferrer"
				class="font-medium underline underline-offset-4 hover:text-foreground"
			>
				Package managers
			</a>
		</span>

		<span class="hidden text-foreground/40 sm:inline">·</span>

		<span>
			Rather build from source?
			<a
				href="https://github.com/ggml-org/llama.cpp/blob/master/docs/build.md"
				target="_blank"
				rel="noreferrer"
				class="font-medium underline underline-offset-4 hover:text-foreground"
			>
				Follow instructions
			</a>
		</span>
	</div>
</div>
