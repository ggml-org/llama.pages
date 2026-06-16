<script lang="ts">
	import SiteHeader from '$lib/components/app/navigation/SiteHeader.svelte';
	import HeroBanner from '$lib/components/app/content/HeroBanner.svx';
	import ShowcaseSections from '$lib/components/app/content/ShowcaseSections.svx';
	import RunYourFirstModel from '$lib/components/app/content/RunYourFirstModel.svelte';
</script>

<main class="mx-auto w-full max-w-6xl px-6 md:px-16">
	<SiteHeader />

	<HeroBanner />

	<ShowcaseSections />

	<RunYourFirstModel />
</main>
