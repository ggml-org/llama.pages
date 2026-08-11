<script lang="ts">
	import { HeroBanner, RunYourFirstModel } from '$lib/components/app';
	import ShowcaseSections from '$lib/components/app/content/ShowcaseSections.svx';
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';
</script>

<svelte:head>
	<title>{SITE_TITLE}</title>
	<meta name="description" content={SITE_DESCRIPTION} />
</svelte:head>

<main class="mx-auto w-full max-w-5xl px-6 md:px-12">
	<HeroBanner />

	<ShowcaseSections />

	<RunYourFirstModel />
</main>
