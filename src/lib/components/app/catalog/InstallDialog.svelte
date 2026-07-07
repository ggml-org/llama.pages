<script lang="ts">
	// Install modal: opened by the "Install in Llama" buttons in the sizes
	// table. The button fires the `llama://` deeplink and this dialog shows
	// the static fallbacks -- app download and CLI command -- so no browser
	// heuristics are needed to detect whether the app is installed. Users
	// with the app see it open and dismiss this; users without it see what
	// to do.
	//
	// Built on the native <dialog> element: focus trapping, Escape-to-close
	// and the backdrop come for free, no dialog dependency needed.
	import { Copy, Check, X } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { type Build, cliCommand } from '$lib/catalog';

	// The build being installed, or null when the dialog is closed. Owned by
	// the page (bindable) so closing the dialog clears it there too.
	let { build = $bindable() }: { build: Build | null } = $props();

	let dialog = $state<HTMLDialogElement | null>(null);

	// Open/close the native dialog as `build` comes and goes.
	$effect(() => {
		if (!dialog) return;
		if (build && !dialog.open) dialog.showModal();
		if (!build && dialog.open) dialog.close();
	});

	// Direct dmg download; `latest` redirects to the newest release so no
	// version is hardcoded here.
	const DOWNLOAD_URL =
		'https://github.com/ggml-org/Llama-macOS/releases/latest/download/Llama.dmg';

	// Transient check-mark feedback on the copy button, same convention as the
	// homepage install snippet.
	let copied = $state(false);

	async function copyCli(cmd: string) {
		await navigator.clipboard.writeText(cmd);
		toast.success('Copied to clipboard!');
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<!-- onclose catches every way out (Escape, close button) and syncs `build`;
     clicking the backdrop closes too -- a click straight on the <dialog>
     element can only be the backdrop, since the inner div covers the rest. -->
<dialog
	bind:this={dialog}
	onclose={() => (build = null)}
	onclick={(e) => e.target === dialog && dialog?.close()}
	class="bg-background text-foreground m-auto w-full max-w-md rounded-2xl p-0 shadow-xl backdrop:bg-black/10"
>
	{#if build}
		<div class="relative flex flex-col items-center px-8 pt-12 pb-10 text-center">
			<button
				type="button"
				aria-label="Close"
				onclick={() => dialog?.close()}
				class="text-muted-foreground hover:text-foreground absolute top-4 right-4 cursor-pointer"
			>
				<X class="size-4" />
			</button>

			<h2 class="text-2xl font-semibold tracking-tight">Launching Llama…</h2>

			<!-- Spinner: reassures that the handoff to the app is in flight. It
			     never resolves here -- the app opening (or the user reading the
			     fallbacks below) is the resolution. -->
			<div
				aria-hidden="true"
				class="border-muted-foreground/30 border-t-muted-foreground mt-8 h-8 w-8 animate-spin rounded-full border-2"
			></div>

			<p class="text-muted-foreground mt-10 text-[15px]">
				Don’t have Llama?
				<a href={DOWNLOAD_URL} class="text-foreground underline underline-offset-4">
					Download the app
				</a>
				for Mac.
			</p>

			<p class="text-muted-foreground mt-10 text-[13px]">
				Or download the model using the
				<code class="bg-muted rounded px-1.5 py-0.5">llama</code> CLI:
			</p>

			<div class="bg-foreground/4 border-secondary mt-3 w-full overflow-hidden rounded-xl border">
				<div class="flex items-stretch justify-between">
					<code
						class="text-foreground/90 block min-w-0 flex-1 overflow-x-auto px-4 py-3 text-left font-mono text-[13px] whitespace-nowrap"
					>
						{cliCommand(build)}
					</code>
					<button
						class="text-foreground/70 hover:text-foreground border-secondary flex shrink-0 cursor-pointer items-center border-l px-4"
						aria-label={copied ? 'Copied command' : 'Copy command'}
						onclick={() => build && copyCli(cliCommand(build))}
					>
						{#if copied}
							<Check class="size-4" />
						{:else}
							<Copy class="size-4" />
						{/if}
					</button>
				</div>
			</div>
		</div>
	{/if}
</dialog>

<style>
	/* Quick fade (plus a slight rise) on open and close. Native <dialog>
	   toggles `display`, which normally can't transition; `allow-discrete`
	   plus `@starting-style` make both directions animate in modern browsers,
	   and older ones just get the previous instant toggle. */
	dialog,
	dialog::backdrop {
		opacity: 0;
		transition:
			opacity 0.15s ease,
			transform 0.15s ease,
			overlay 0.15s allow-discrete,
			display 0.15s allow-discrete;
	}

	dialog {
		transform: translateY(4px);
	}

	dialog[open],
	dialog[open]::backdrop {
		opacity: 1;
	}

	dialog[open] {
		transform: translateY(0);
	}

	/* Where the open transition starts from: matches the closed state. */
	@starting-style {
		dialog[open],
		dialog[open]::backdrop {
			opacity: 0;
		}

		dialog[open] {
			transform: translateY(4px);
		}
	}
</style>
