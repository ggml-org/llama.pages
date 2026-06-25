<script lang="ts">
	import { userPrefersMode, setMode } from 'mode-watcher';
	import { Sun, Moon, Monitor, ChevronRight } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Logo from '$lib/components/app/misc/Logo.svelte';
	import GitHubLink from '$lib/components/app/navigation/GitHubLink.svelte';
	import type { FamilyGroup } from '$lib/catalog';

	const stars = $derived(page.data.stars as number | null | undefined);

	// Whether we're anywhere in the Models section (the catalog index or a family
	// detail page), which is what turns the header's left side into a breadcrumb.
	const onModels = $derived(
		page.url.pathname === '/models' || page.url.pathname.startsWith('/models/')
	);

	// On a family detail page the loaded group gives us the open model's name, the
	// last crumb in the trail. Undefined elsewhere (incl. the catalog index).
	const group = $derived(page.data.group as FamilyGroup | undefined);

	const NEXT_MODE = { light: 'dark', dark: 'system', system: 'light' } as const;

	function cycleMode() {
		setMode(NEXT_MODE[userPrefersMode.current]);
	}
</script>

<header class="mx-auto flex w-full max-w-5xl items-center justify-between p-6 md:px-12">
	<!-- Left: a breadcrumb trail. It starts as just the logo (home) and grows a
	     crumb at a time as you descend: "Models" once you're in the catalog, then
	     the open family's name on a detail page. Crumbs are separated by a subtle
	     chevron. -->
	<nav aria-label="Breadcrumb" class="flex items-center gap-2 text-base">
		<a href={resolve('/')}>
			<Logo --logo-height="1.5rem" />
		</a>

		{#if onModels}
			<ChevronRight class="text-foreground/30 size-4" aria-hidden="true" />
			<a
				href="/models"
				aria-current={group ? undefined : 'page'}
				class="transition-colors {group
					? 'text-foreground/70 hover:text-foreground'
					: 'text-foreground'}"
			>
				Models
			</a>
		{/if}

		{#if group}
			<ChevronRight class="text-foreground/30 size-4" aria-hidden="true" />
			<span aria-current="page" class="text-foreground">{group.family}</span>
		{/if}
	</nav>

	<div class="flex items-center gap-4">
		<GitHubLink {stars} />

		<button
			type="button"
			onclick={cycleMode}
			class="text-foreground/70 hover:text-foreground hover:bg-foreground/8 -m-1.5 inline-flex cursor-pointer items-center rounded-md p-1.5 transition-colors"
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
