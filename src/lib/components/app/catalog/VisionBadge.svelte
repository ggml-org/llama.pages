<script lang="ts">
	// The eye glyph marking vision-capable models. Used both on the catalog cards
	// (beside the family title) and in the detail page's size table, so the signal
	// stays consistent from grid to drawer. `class` lets each caller size/position
	// it for its context.
	let { class: cls = '' }: { class?: string } = $props();
</script>

<svg
	aria-label="vision"
	role="img"
	viewBox="0 0 16 16"
	class="size-3.5 text-sky-600 {cls}"
	fill="none"
	stroke="currentColor"
	stroke-width="1.5"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<path d="M1 8s2.5-4.5 7-4.5S15 8 15 8s-2.5 4.5-7 4.5S1 8 1 8z" />
	<circle cx="8" cy="8" r="1.75" />
</svg>
