<script lang="ts">
	// The install toast, shown right after a row fires the `llama://`
	// deeplink. Everything is up front in this one toast: the confirmation
	// (on success the app -- a menu bar app -- shows its own bubble, so
	// there's nothing to wait for) plus the fallbacks for machines with no
	// app to catch the link, which the browser can't detect itself: app
	// download and CLI command. It auto-dismisses like any toast (generous
	// duration, and sonner pauses the timer on hover, so it can't vanish
	// mid-interaction); re-clicking Install brings it back if it expires.
	//
	// Rendered via toast.custom(), which leaves styling entirely to the
	// component (sonner sets data-styled=false), so the card chrome here
	// mirrors the default toasts: popover colors, border, shadow.
	import { Copy, Check, X } from '@lucide/svelte';
	import { type Build, cliCommand } from '$lib/catalog';

	// closeToast is injected by sonner for custom components -- optional in
	// the type only so the toast.custom() call site (which passes just
	// `build`) type-checks; at render it's always provided.
	let { build, closeToast }: { build: Build; closeToast?: () => void } = $props();

	// Direct dmg download; `latest` redirects to the newest release so no
	// version is hardcoded here.
	const DOWNLOAD_URL =
		'https://github.com/ggml-org/Llama-macOS/releases/latest/download/Llama.dmg';

	// Transient check-mark feedback on the copy button. No confirmation toast
	// on top -- the check is enough, and we're already inside a toast.
	let copied = $state(false);

	async function copyCli(cmd: string) {
		await navigator.clipboard.writeText(cmd);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<div
	class="bg-popover text-popover-foreground border-border relative w-full rounded-lg border p-4 shadow-lg"
>
	<button
		type="button"
		aria-label="Close"
		onclick={closeToast}
		class="text-muted-foreground hover:text-foreground absolute top-3 right-3 cursor-pointer"
	>
		<X class="size-3.5" />
	</button>

	<p class="pr-5 text-[13px] font-medium">Sent to Llama.</p>

	<p class="text-muted-foreground mt-2 pr-5 text-[13px]">
		Don’t have Llama?
		<a href={DOWNLOAD_URL} class="text-foreground underline underline-offset-4">
			Download Llama for Mac
		</a>
	</p>

	<p class="text-muted-foreground mt-3 text-[13px]">
		Or use the
		<code class="bg-muted rounded px-1 py-0.5">llama</code> CLI:
	</p>

	<div class="bg-foreground/4 border-border mt-2 w-full overflow-hidden rounded-lg border">
		<div class="flex items-stretch justify-between">
			<code
				class="text-foreground/90 block min-w-0 flex-1 overflow-x-auto px-3 py-2 font-mono text-[12px] whitespace-nowrap"
			>
				{cliCommand(build)}
			</code>
			<button
				class="text-foreground/70 hover:text-foreground border-border flex shrink-0 cursor-pointer items-center border-l px-3"
				aria-label={copied ? 'Copied command' : 'Copy command'}
				onclick={() => copyCli(cliCommand(build))}
			>
				{#if copied}
					<Check class="size-3.5" />
				{:else}
					<Copy class="size-3.5" />
				{/if}
			</button>
		</div>
	</div>
</div>
