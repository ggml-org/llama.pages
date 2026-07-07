<script lang="ts">
	import DocsFooterNav from '$lib/components/app/docs/DocsFooterNav.svelte';
	import DocsSidebar from '$lib/components/app/docs/DocsSidebar.svelte';
	import DocsToc from '$lib/components/app/docs/DocsToc.svelte';
	import { SITE_TITLE } from '$lib/constants/site';

	let { data } = $props();

	const Content = $derived(data.component);
	const pageKey = $derived(`${data.version}/${data.local}`);

	let article = $state<HTMLElement>();
</script>

<svelte:head>
	<title>{data.title} - {SITE_TITLE}</title>
	<link rel="alternate" type="text/markdown" href="/docs/{data.version}/{data.local}.md" />
</svelte:head>

<div class="mx-auto flex w-full max-w-7xl items-start gap-10 px-6 md:px-12">
	<aside
		class="sticky top-20 hidden max-h-[calc(100vh-6rem)] w-60 shrink-0 overflow-y-auto py-8 md:block"
	>
		<DocsSidebar version={data.version} toctree={data.toctree} active={data.local} />
	</aside>

	<main class="min-w-0 flex-1 py-8">
		<details class="border-border mb-6 rounded-md border md:hidden">
			<summary class="cursor-pointer px-3 py-2 text-sm font-medium">Documentation</summary>
			<div class="px-3 pb-3">
				<DocsSidebar version={data.version} toctree={data.toctree} active={data.local} />
			</div>
		</details>

		<article bind:this={article} class="prose max-w-none dark:prose-invert">
			<Content />
		</article>

		<DocsFooterNav version={data.version} prev={data.prev} next={data.next} />
	</main>

	<aside
		class="sticky top-20 hidden max-h-[calc(100vh-6rem)] w-52 shrink-0 overflow-y-auto py-8 xl:block"
	>
		<DocsToc {article} {pageKey} />
	</aside>
</div>
