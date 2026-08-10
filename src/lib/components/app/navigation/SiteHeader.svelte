<script lang="ts">
	import { Monitor, Moon, Sun } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Logo from '$lib/components/app/misc/Logo.svelte';
	import GitHubLink from '$lib/components/app/navigation/GitHubLink.svelte';
	import { ROUTES } from '$lib/constants';
	import { setMode, userPrefersMode } from 'mode-watcher';

	const stars = $derived(page.data.stars as number | null | undefined);

	// Whether we're anywhere in the Models section (the catalog index or a family
	// detail page), which highlights the permanent "Models" nav link.
	const onModels = $derived(
		page.url.pathname === ROUTES.MODELS || page.url.pathname.startsWith(`${ROUTES.MODELS}/`)
	);

	// Whether we're anywhere in the Docs section, which highlights the permanent
	// "Docs" nav link.
	const onDocs = $derived(
		page.url.pathname === ROUTES.DOCS || page.url.pathname.startsWith(`${ROUTES.DOCS}/`)
	);

	const NEXT_MODE = { dark: 'system', light: 'dark', system: 'light' } as const;

	function cycleMode() {
		setMode(NEXT_MODE[userPrefersMode.current]);
	}
</script>

<header class="mx-auto flex w-full max-w-5xl items-center justify-between p-6 md:px-12">
	<!-- Left: the logo (home) plus permanent site nav. A vertical hairline after
	     the logo separates brand from nav, so the link doesn't read as part of
	     the wordmark. "Models" always links to the catalog and lights up while
	     you're anywhere in the section; the page itself names where you are
	     (each page leads with its own h1). -->
	<nav class="flex items-center gap-4 text-[15px]">
		<a href={resolve('/')}>
			<Logo --logo-height="1.5rem" />
		</a>

		<span aria-hidden="true" class="h-5 w-px bg-border"></span>

		<a
			href={resolve(ROUTES.MODELS)}
			aria-current={onModels ? 'page' : undefined}
			class={onModels ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}
		>
			Models
		</a>

		<a
			href={resolve(ROUTES.DOCS)}
			aria-current={onDocs ? 'page' : undefined}
			class={onDocs ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}
		>
			Docs
		</a>
	</nav>

	<div class="flex items-center gap-4">
		<GitHubLink {stars} />

		<button
			type="button"
			onclick={cycleMode}
			class="-m-1.5 inline-flex cursor-pointer items-center rounded-md p-1.5 text-foreground/70 transition-colors hover:bg-foreground/8 hover:text-foreground"
			aria-label="Theme: {userPrefersMode.current} (click to change)"
			title="Theme: {userPrefersMode.current}"
		>
			{#if userPrefersMode.current === 'light'}
				<Sun class="size-4" />
			{:else if userPrefersMode.current === 'dark'}
				<Moon class="size-4" />
			{:else}
				<Monitor class="size-4" />
			{/if}
		</button>
	</div>
</header>
