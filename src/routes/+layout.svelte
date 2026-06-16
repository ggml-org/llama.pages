<script lang="ts">
	import '../app.css';
	import 'prismjs/themes/prism.css';
	import 'prismjs/themes/prism-dark.css';
	import { onMount } from 'svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import * as deviceStore from '$lib/stores/device/index.svelte';
	import { SITE_TITLE, SITE_DESCRIPTION } from '$lib/constants/site';
	import SeoMetadata from '$lib/components/app/misc/SeoMetadata.svelte';
	import iconLight from '$lib/assets/icon-light.svg?url';
	import iconDark from '$lib/assets/icon-dark.svg?url';

	let { children } = $props();

	onMount(() => {
		try {
			deviceStore.init();
		} catch (e) {
			console.error('[device] init failed:', e);
		}
	});

	function updateFavicon() {
		const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
		if (link) {
			link.href = dark ? iconDark : iconLight;
		}
	}

	$effect(() => {
		const mql = window.matchMedia('(prefers-color-scheme: dark)');

		function handleChange() {
			updateFavicon();
		}

		mql.addEventListener('change', handleChange);
		updateFavicon();

		return () => {
			mql.removeEventListener('change', handleChange);
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={iconLight} />

	<title>{SITE_TITLE}</title>

	<meta name="description" content={SITE_DESCRIPTION} />
</svelte:head>

<SeoMetadata />

<ModeWatcher />
<Toaster />

{@render children()}
