<script lang="ts">
	interface Heading {
		id: string;
		text: string;
		level: number;
	}

	interface Props {
		article: HTMLElement | undefined;
		/** Changes when the rendered page changes, triggering a heading rescan. */
		pageKey: string;
	}

	let { article, pageKey }: Props = $props();

	let headings = $state<Heading[]>([]);
	let activeId = $state('');

	$effect(() => {
		void pageKey;
		if (!article) {
			headings = [];
			return;
		}
		headings = [...article.querySelectorAll<HTMLElement>('h2[id], h3[id]')].map((el) => ({
			id: el.id,
			text: el.textContent ?? '',
			level: el.tagName === 'H2' ? 2 : 3
		}));
	});

	$effect(() => {
		if (headings.length === 0) return;

		function onScroll() {
			let current = headings[0].id;
			for (const heading of headings) {
				const el = document.getElementById(heading.id);
				if (el && el.getBoundingClientRect().top <= 120) current = heading.id;
			}
			activeId = current;
		}

		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

{#if headings.length > 0}
	<nav aria-label="On this page" class="flex flex-col gap-2 text-sm">
		<span class="text-foreground/80 font-semibold">On this page</span>

		{#each headings as heading (heading.id)}
			<a
				href="#{heading.id}"
				class="transition-colors {heading.level === 3 ? 'pl-4' : ''} {activeId === heading.id
					? 'text-accent font-medium'
					: 'text-foreground/60 hover:text-foreground'}"
			>
				{heading.text}
			</a>
		{/each}
	</nav>
{/if}
