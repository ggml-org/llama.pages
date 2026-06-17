<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { MODELS, ORG_AVATARS, repoAuthor } from '$lib/models';
</script>

<section class="py-24">
	<h2 class="text-foreground mb-8 text-2xl font-semibold">Run your first model</h2>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each MODELS as model (model.slug)}
			<a
				href={resolve('/models/[model]', { model: model.slug })}
				class="group border-foreground/6 bg-foreground/2 hover:border-foreground/12 hover:bg-foreground/4 relative flex flex-col justify-between rounded-2xl border p-6 transition-all"
			>
				<div class="flex items-start gap-3">
					<img
						src={ORG_AVATARS[repoAuthor(model.id)]}
						alt="{repoAuthor(model.id)} avatar"
						class="mt-0.5 size-8 shrink-0 rounded-lg object-cover {repoAuthor(model.id).includes(
							'openai'
						)
							? 'dark:invert'
							: ''}"
					/>
					<div class="min-w-0 flex-1">
						<h3 class="text-foreground truncate text-base font-semibold">{model.name}</h3>
						<span
							class="bg-foreground/5 text-foreground/60 mt-1 inline-flex rounded-md px-2 py-0.5 font-mono text-[10px] sm:text-xs"
						>
							{model.params}
						</span>
					</div>
				</div>
				<p class="text-foreground/60 mt-4 text-sm leading-relaxed">{model.description}</p>
				<div
					class="text-foreground/40 group-hover:text-foreground/70 mt-4 flex items-center gap-1.5 text-xs transition-colors"
				>
					Run model
					<ArrowUpRight
						class="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
					/>
				</div>
			</a>
		{/each}
	</div>

	<div class="mt-6 flex justify-center">
		<a
			href="https://huggingface.co/models?apps=llama.cpp"
			target="_blank"
			rel="noreferrer"
			class="text-foreground/70 hover:text-foreground inline-flex items-center gap-1.5 text-sm underline underline-offset-4 transition-colors"
		>
			Discover more models on Hugging Face
			<ArrowUpRight class="size-3.5" />
		</a>
	</div>
</section>
