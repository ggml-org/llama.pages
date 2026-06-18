<script lang="ts">
	import '../app.css';
	import 'prismjs/themes/prism.css';
	import 'prismjs/themes/prism-dark.css';
	import { onMount } from 'svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import * as deviceStore from '$lib/stores/device/index.svelte';
	import SeoMetadata from '$lib/components/app/misc/SeoMetadata.svelte';
    import SiteHeader from '$lib/components/app/navigation/SiteHeader.svelte';

	let { children } = $props();

	onMount(() => {
		try {
			deviceStore.init();
		} catch (e) {
			console.error('[device] init failed:', e);
		}
	});
</script>

<SiteHeader />

<SeoMetadata />

<ModeWatcher />

<Toaster />

{@render children()}
