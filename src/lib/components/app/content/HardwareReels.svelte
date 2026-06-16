<script lang="ts">
	const HW = 'https://huggingface.co/front/assets/hardware';
	const HARDWARE_REELS = [
		{
			duration: 30,
			items: [
				{ name: 'Apple Silicon', img: `${HW}/apple-silicon.svg` },
				{ name: 'M Ultra', img: `${HW}/m-ultra.webp` },
				{ name: 'RTX 5090', img: `${HW}/rtx-series.webp` },
				{ name: 'CPU', img: `${HW}/cpu.webp` },
				{ name: 'Jetson', img: `${HW}/jetson.webp` }
			]
		},
		{
			duration: 35,
			items: [
				{ name: 'H100', img: `${HW}/h100.webp` },
				{ name: 'MI300', img: `${HW}/mi300.webp` },
				{ name: 'RTX 4090', img: `${HW}/rtx-series.webp` },
				{ name: 'A100', img: `${HW}/gpu.webp` },
				{ name: 'M Pro', img: `${HW}/m-pro.webp` }
			]
		},
		{
			duration: 32,
			items: [
				{ name: 'M Max', img: `${HW}/m-max.webp` },
				{ name: 'DGX Spark', img: `${HW}/spark.webp` },
				{ name: 'T4', img: `${HW}/t4.webp` },
				{ name: 'Radeon RX', img: `${HW}/amd-rx.webp` },
				{ name: 'B200', img: `${HW}/h100.webp` },
				{ name: 'Intel Arc', img: `${HW}/arc.webp` },
				{ name: 'RTX 3090', img: `${HW}/rtx-series.webp` }
			]
		}
	];
</script>

<div
	class="hardware-slots relative grid h-[17rem] grid-cols-2 gap-3 overflow-hidden sm:grid-cols-3"
>
	{#each HARDWARE_REELS as reel, reelIndex (reelIndex)}
		<div
			class="overflow-hidden {reelIndex === 2 ? 'hidden sm:block' : ''}"
			style="--reel-duration: {reel.duration}s; --reel-delay: -{reelIndex * 2}s"
		>
			<div class="hardware-reel-track flex flex-col">
				{#each [0, 1] as copyIndex (copyIndex)}
					<div class="flex flex-col gap-2 pb-2" aria-hidden={copyIndex === 1}>
						{#each reel.items as hw (copyIndex + hw.name)}
							<div
								class="text-foreground bg-foreground/6 flex min-h-12 items-center gap-2.5 rounded-md px-3 py-2.5 text-sm whitespace-nowrap"
							>
								<img
									src={hw.img}
									alt=""
									class="dark:bg-foreground/8 size-7 shrink-0 rounded-md bg-white object-contain p-1"
								/>
								<span>{hw.name}</span>
							</div>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>

<style>
	.hardware-slots::before,
	.hardware-slots::after {
		position: absolute;
		right: 0;
		left: 0;
		z-index: 1;
		height: 4rem;
		content: '';
		pointer-events: none;
	}

	.hardware-slots::before {
		top: 0;
		background: linear-gradient(to bottom, var(--background) 0%, transparent 100%);
	}

	.hardware-slots::after {
		bottom: 0;
		background: linear-gradient(to top, var(--background) 0%, transparent 100%);
	}

	.hardware-reel-track {
		animation: hardware-reel-spin var(--reel-duration) linear var(--reel-delay) infinite;
	}

	@keyframes hardware-reel-spin {
		from {
			transform: translateY(0);
		}

		to {
			transform: translateY(-50%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hardware-reel-track {
			animation: none;
		}
	}
</style>
