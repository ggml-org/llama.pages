<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<title>llama.app - Official home for llama.cpp</title>

	<meta name="description" content="Official website for the llama.cpp project" />
</svelte:head>

<Toaster />

{@render children()}
