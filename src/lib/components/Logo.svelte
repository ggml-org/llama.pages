<script lang="ts">
	let { class: className = '' }: { class?: string } = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	class={className}
	width="256"
	height="256"
	fill="none"
	viewBox="0 0 256 256"
	aria-hidden="true"
	focusable="false"
>
	<path
		fill="#ff8236"
		d="M125.608 88.104c16.876-1.407 31.73 2.988 46.145 11.425h-.088l-11.866 21.095c-15.645-12.041-38.849-13.799-54.494-.879-25.226 20.831-23.467 68.997 15.821 69.261 10.987 0 20.303-5.187 30.323-8.614l5.274 21.006c-8.878 4.131-17.931 8.35-27.687 9.668-88.948 12.129-83.85-116.282-3.428-122.962m18.018 55.374h14.063v12.304h-14.063v14.942h-13.184v-14.942H115.5v-12.304h13.624l1.318-1.319v-14.503h13.184zm48.342-1.319 1.318 1.319h13.624v12.304h-14.942v14.942h-13.184v-14.942h-14.063v-12.304h14.063v-15.822h13.184z"
	/>
	<path
		class="logo-ear logo-ear-left"
		fill="#ff8236"
		d="M101.263 28.601c3.516-1.23 15.557-4.307 15.206 1.933s-8.702 16.964-10.723 22.765c-3.516 10.195-.264 17.227 4.57 26.104l-.088-.088C96.692 83.36 84.123 90.83 74.631 101.288c-1.758-21.27 2.989-64.25 26.632-72.687"
	/>
	<path
		class="logo-ear logo-ear-right"
		fill="#ff8236"
		d="M116.379 77.557c2.197-18.897 12.833-46.408 36.828-39.464 1.757 2.637-8.174 13.974-9.757 16.875-4.57 8.613-1.494 13.536 1.934 21.71-9.932-1.495-19.161-.264-29.005.879"
	/>
</svg>

<style>
	.logo-ear {
		transform-box: fill-box;
		transform-origin: 50% 100%;
	}

	.logo-ear-left {
		animation: logo-ear-left-wiggle 1600ms ease-in-out infinite;
	}

	.logo-ear-right {
		animation: logo-ear-right-wiggle 1600ms ease-in-out 120ms infinite;
	}

	@keyframes logo-ear-left-wiggle {
		0%,
		100% {
			transform: rotate(0deg);
		}

		30% {
			transform: rotate(-4deg);
		}

		48% {
			transform: rotate(1.6deg);
		}

		62% {
			transform: rotate(-0.8deg);
		}

		76% {
			transform: rotate(0.3deg);
		}
	}

	@keyframes logo-ear-right-wiggle {
		0%,
		100% {
			transform: rotate(0deg);
		}

		30% {
			transform: rotate(-3deg);
		}

		48% {
			transform: rotate(1.1deg);
		}

		62% {
			transform: rotate(-0.5deg);
		}

		76% {
			transform: rotate(0.2deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.logo-ear-left,
		.logo-ear-right {
			animation: none;
		}
	}
</style>
