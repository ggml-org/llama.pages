<script lang="ts">
	// Non-Mac counterpart of the Mac install flow: the row's "Run…" button
	// opens this modal with the build's CLI command. A modal rather than a
	// toast because off-Mac the command *is* the payoff of the click -- the
	// user asked to see it, so it belongs center stage, not in a corner.
	//
	// Sheet-style content: the title echoes exactly which build was clicked
	// (with quantizations expanded, neighboring rows differ only by quant, so
	// the confirmation guards against copying the wrong one), and the footer
	// answers the newcomer's actual next question -- "I don't have the llama
	// command" -- with a link home, where the CLI install command is front
	// and center.
	//
	// Built on the native <dialog> element: focus trapping, Escape-to-close
	// and the backdrop come for free, no dialog dependency needed.
	import { Copy, Check, X } from '@lucide/svelte';
	import { type Build, type Size, cliCommand, displaySize, minMemForBuild } from '$lib/catalog';

	// The build being run plus its size (for the title), or null when the
	// dialog is closed. Owned by the page (bindable) so closing the dialog
	// clears it there too.
	let { run = $bindable() }: { run: { build: Build; size: Size } | null } = $props();

	let dialog = $state<HTMLDialogElement | null>(null);

	// Open/close the native dialog as `run` comes and goes.
	$effect(() => {
		if (!dialog) return;
		if (run && !dialog.open) dialog.showModal();
		if (!run && dialog.open) dialog.close();
	});

	// The byline under the title: quant, download size, and memory bar --
	// the same facts as the table row, echoed so the dialog stands alone.
	const byline = $derived.by(() => {
		if (!run) return '';
		const parts = [];
		if (run.build.quant) parts.push(run.build.quant.toUpperCase());
		if (run.build.sizeBytes) parts.push(displaySize(run.build.sizeBytes));
		const mem = minMemForBuild(run.build);
		if (mem) parts.push(`requires ${mem} GB+ memory`);
		return parts.join(' · ');
	});

	// Transient check-mark feedback on the copy button, same convention as the
	// homepage install snippet.
	let copied = $state(false);

	async function copyCli(cmd: string) {
		await navigator.clipboard.writeText(cmd);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<!-- onclose catches every way out (Escape, close button) and syncs `run`;
     clicking the backdrop closes too -- a click straight on the <dialog>
     element can only be the backdrop, since the inner div covers the rest. -->
<dialog
	bind:this={dialog}
	onclose={() => (run = null)}
	onclick={(e) => e.target === dialog && dialog?.close()}
	class="bg-background text-foreground m-auto w-full max-w-xl rounded-2xl p-0 shadow-xl backdrop:bg-black/10"
>
	{#if run}
		<div class="relative px-8 pt-8 pb-7">
			<button
				type="button"
				aria-label="Close"
				onclick={() => dialog?.close()}
				class="text-muted-foreground hover:text-foreground absolute top-4 right-4 cursor-pointer"
			>
				<X class="size-4" />
			</button>

			<h2 class="text-[17px] font-semibold tracking-tight">Run {run.size.name}</h2>
			{#if byline}
				<p class="text-muted-foreground mt-1 text-[13px] tabular-nums">{byline}</p>
			{/if}

			<p class="text-muted-foreground mt-5 text-[13px]">In your terminal:</p>

			<div class="bg-foreground/4 border-secondary mt-2 w-full overflow-hidden rounded-xl border">
				<div class="flex items-stretch justify-between">
					<code
						class="text-foreground/90 block min-w-0 flex-1 overflow-x-auto px-4 py-3 text-left font-mono text-[13px] whitespace-nowrap"
					>
						{cliCommand(run.build)}
					</code>
					<button
						class="text-foreground/70 hover:text-foreground border-secondary flex shrink-0 cursor-pointer items-center border-l px-4"
						aria-label={copied ? 'Copied command' : 'Copy command'}
						onclick={() => run && copyCli(cliCommand(run.build))}
					>
						{#if copied}
							<Check class="size-4" />
						{:else}
							<Copy class="size-4" />
						{/if}
					</button>
				</div>
			</div>

			<p class="text-muted-foreground mt-4 text-[13px]">
				Downloads the model on first run, then serves it locally.
			</p>
			<p class="text-muted-foreground mt-1 text-[13px]">
				Don’t have the CLI?
				<a href="/" class="text-foreground underline underline-offset-4">Install it first</a>.
			</p>
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
