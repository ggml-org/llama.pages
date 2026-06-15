<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { MODELS, ORG_AVATARS, repoAuthor } from '$lib/models';
</script>

<section class="py-24">
	<h2 class="text-foreground mb-8 text-2xl font-semibold">Run your first model</h2>

	<div class="flex flex-col gap-2">
		{#each MODELS as model (model.slug)}
			<a
				href={resolve('/models/[model]', { model: model.slug })}
				class="group bg-foreground/[0.04] hover:bg-foreground/[0.07] flex items-center gap-2 rounded-xl px-5 py-4 transition-colors"
			>
				<img
					src={ORG_AVATARS[repoAuthor(model.id)]}
					alt="{repoAuthor(model.id)} avatar"
					class="size-4 shrink-0 rounded-md"
				/>
				<div class="flex shrink-0 items-center gap-2">
					<h3 class="text-foreground text-base font-semibold">{model.name}</h3>
					<span
						class="bg-foreground/8 text-foreground/70 rounded-md px-1.5 py-0.5 font-mono text-[9px] sm:text-[11px]"
					>
						{model.params}
					</span>
				</div>
				<p class="text-foreground/70 hidden flex-1 truncate text-sm md:block">
					{model.description}
				</p>
			</a>
		{/each}
	</div>

	<div class="mt-6 flex justify-center">
		<a
			href="https://huggingface.co/models?apps=llama.cpp"
			target="_blank"
			rel="noreferrer"
			class="text-foreground/70 hover:text-foreground inline-flex items-center gap-1.5 text-sm underline underline-offset-4"
		>
			Discover more models on Hugging Face
			<ArrowUpRight class="size-3.5" />
		</a>
	</div>
</section>
