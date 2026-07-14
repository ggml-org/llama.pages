<script lang="ts">
	const HW = 'https://huggingface.co/front/assets/hardware';
	const HARDWARE_REELS = [
		{
			items: [
				{ name: 'Apple Silicon', img: `${HW}/apple-silicon.svg` },
				{ name: 'M Ultra', img: `${HW}/m-ultra.webp` },
				{ name: 'RTX 5090', img: `${HW}/rtx-series.webp` },
				{ name: 'CPU', img: `${HW}/cpu.webp` },
				{ name: 'Jetson', img: `${HW}/jetson.webp` }
			]
		},
		{
			items: [
				{ name: 'H100', img: `${HW}/h100.webp` },
				{ name: 'MI300', img: `${HW}/mi300.webp` },
				{ name: 'RTX 4090', img: `${HW}/rtx-series.webp` },
				{ name: 'A100', img: `${HW}/gpu.webp` },
				{ name: 'M Pro', img: `${HW}/m-pro.webp` }
			]
		},
		{
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

<div class="hardware-slots relative grid h-68 grid-cols-2 gap-3 overflow-hidden sm:grid-cols-3">
	{#each HARDWARE_REELS as reel, reelIndex (reelIndex)}
		<div class="overflow-hidden {reelIndex === 2 ? 'hidden sm:block' : ''}">
			<div class="flex flex-col gap-2 pb-2">
				{#each reel.items as hw (hw.name)}
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
		</div>
	{/each}
</div>

<style>
	/* Fade out the bottom edge so the taller third column clips gracefully */
	.hardware-slots::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1;
		height: 4rem;
		content: '';
		pointer-events: none;
		background: linear-gradient(to top, var(--background) 0%, transparent 100%);
	}
</style>
