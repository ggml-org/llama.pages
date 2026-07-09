<script lang="ts">
	import { userPrefersMode, setMode } from 'mode-watcher';
	import { Sun, Moon, Monitor } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Logo from '$lib/components/app/misc/Logo.svelte';
	import GitHubLink from '$lib/components/app/navigation/GitHubLink.svelte';

	const stars = $derived(page.data.stars as number | null | undefined);

	const NEXT_MODE = { light: 'dark', dark: 'system', system: 'light' } as const;

	function cycleMode() {
		setMode(NEXT_MODE[userPrefersMode.current]);
	}
</script>

<header
	class="sticky top-0 z-9999 mx-auto flex w-full max-w-5xl items-center justify-between p-6 backdrop-blur-md md:px-12"
>
	<a href={resolve('/')}>
		<Logo --logo-height="1.5rem" />
	</a>

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
