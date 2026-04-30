<script lang="ts">
	import { Play, Check, ArrowUpRight } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import { ORG_AVATARS, repoAuthor } from '$lib/models';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const model = $derived(data.model);
	const repos = $derived(data.repos);

	let selectedQuants = $state<Record<string, string>>({});

	function quantFor(repo: { id: string; quants: string[] }) {
		return selectedQuants[repo.id] ?? repo.quants[0] ?? 'Q4_0';
	}

	let copiedRepo = $state<string | null>(null);

	async function copyToClipboard(text: string) {
		if (navigator.clipboard?.writeText) {
			try {
				await navigator.clipboard.writeText(text);
				return true;
			} catch {
				// fall through to legacy
			}
		}
		const ta = document.createElement('textarea');
		ta.value = text;
		ta.style.position = 'fixed';
		ta.style.opacity = '0';
		document.body.appendChild(ta);
		ta.select();
		const ok = document.execCommand('copy');
		document.body.removeChild(ta);
		return ok;
	}

	async function copyCommand(repo: string, quant: string) {
		const cmd = `llama-server -hf ${repo}:${quant}`;
		// TODO: should be  `llama serve -hf ${repo}:${quant}`
		const ok = await copyToClipboard(cmd);
		if (!ok) {
			toast.error('Could not copy to clipboard');
			return;
		}
		toast.success('Copied to clipboard!', {
			description: cmd,
			descriptionClass:
				'!mt-1.5 !block !rounded-md !bg-foreground/[0.06] !px-2 !py-1.5 !font-mono !text-xs !text-foreground !opacity-100'
		});
		copiedRepo = repo;
		setTimeout(() => {
			if (copiedRepo === repo) copiedRepo = null;
		}, 2000);
	}
</script>

<svelte:head>
	<title>{model.name} · llama.app</title>
</svelte:head>

<main class="mx-auto w-full max-w-5xl px-8 md:px-16">
	<SiteHeader />

	<section class="pt-16 pb-12">
		<img
			src={ORG_AVATARS[repoAuthor(model.id)]}
			alt="{repoAuthor(model.id)} avatar"
			class="mb-3 size-10 rounded-md"
		/>
		<h1 class="text-foreground text-2xl font-semibold tracking-tight">{model.name}</h1>
		<div class="mt-1.5 mb-3">
			<span
				class="bg-foreground/8 text-foreground/70 inline-block rounded-md px-1.5 py-0.5 font-mono text-xs"
			>
				{model.params}
			</span>
		</div>
		<p class="text-foreground/80 text-base">{model.description}</p>
	</section>

	<section class="pb-24">
		<div
			class="divide-foreground/10 border-foreground/10 bg-foreground/[0.02] w-full divide-y rounded-2xl border"
		>
			{#each repos as repo (repo.id)}
				<div class="flex items-center justify-between gap-4 px-3.5 py-3">
					<div class="flex items-center gap-2.5">
						<img
							src={repo.avatarUrl}
							alt="{repo.author} avatar"
							class="size-5 shrink-0 {repo.authorType === 'user' ? 'rounded-full' : 'rounded-sm'}"
						/>
						<code class="text-foreground font-mono text-sm">{repo.id}</code>
						<a
							href="https://huggingface.co/{repo.id}"
							target="_blank"
							rel="noreferrer"
							aria-label="Open {repo.id} on Hugging Face"
							class="text-foreground/60 hover:bg-foreground/10 hover:text-foreground inline-flex h-6 items-center gap-1 rounded-md bg-gray-200/60 px-1.5 transition-colors"
						>
							<img
								src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg"
								alt=""
								class="size-3.5"
								aria-hidden="true"
							/>
							<ArrowUpRight class="size-3" />
						</a>
					</div>
					{#if repo.quants.length > 0}
						<div class="flex h-7 items-center gap-2">
							<select
								value={quantFor(repo)}
								onchange={(e) => (selectedQuants[repo.id] = e.currentTarget.value)}
								class="bg-foreground/10 text-foreground hover:bg-foreground/15 h-7 cursor-pointer rounded-md px-2 text-xs font-medium"
							>
								{#each repo.quants as q (q)}
									<option value={q}>{q}</option>
								{/each}
							</select>
							<button
								type="button"
								onclick={() => copyCommand(repo.id, quantFor(repo))}
								class="bg-foreground text-background hover:bg-foreground/90 flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs font-medium"
							>
								{#if copiedRepo === repo.id}
									<Check class="size-3" />
									Copied
								{:else}
									<Play class="size-3" />
									Run
								{/if}
							</button>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</section>
</main>
