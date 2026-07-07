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

<div class="flex w-full">
	<aside
		class="sticky top-20 hidden h-[calc(100vh-5rem)] w-[19rem] shrink-0 overflow-y-auto px-7 py-6 lg:block"
	>
		<DocsSidebar version={data.version} toctree={data.toctree} active={data.local} />
	</aside>

	<div class="flex min-h-screen w-full min-w-0 grow gap-x-8 px-4 pt-6 lg:pt-10 lg:pr-10 lg:pl-16">
		<main class="mx-auto w-full max-w-xl min-w-0 pb-10 xl:w-[calc(100%-28rem)] 2xl:max-w-2xl">
			<details class="border-border mb-6 rounded-md border lg:hidden">
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
			class="sticky top-20 hidden max-h-[calc(100vh-6rem)] w-[19rem] shrink-0 self-start overflow-y-auto pb-4 pl-10 xl:block"
		>
			<DocsToc {article} {pageKey} />
		</aside>
	</div>
</div>
