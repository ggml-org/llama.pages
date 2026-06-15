<script lang="ts">
	const PI_LOGO = 'https://huggingface.co/buckets/julien-c/my-training-bucket/resolve/pi-logo-dark.svg';

	const COMMANDS = [
		{ comment: '1. Serve a model', command: 'llama serve' },
		{ comment: '2. Install the pi-llama plugin', command: 'pi install git:github.com/huggingface/pi-llama' },
		{ comment: '3. Run Pi, everything is set', command: 'pi' }
	];
</script>

<div class="bg-foreground/[0.04] border-secondary relative w-full overflow-hidden rounded-xl border">
	<pre class="text-foreground/90 min-w-0 w-full overflow-x-auto p-6 pr-4 font-mono text-[14px] [scrollbar-width:thin] lg:pr-0"><code>{#each COMMANDS as { comment, command }}
<span class="opacity-50"># {comment}</span>
{command}
{/each}</code
		></pre>
	<div
		class="dark:bg-muted-foreground absolute top-4 right-4 flex size-[2.4rem] items-center justify-center rounded-md bg-white p-[0.4rem] shadow-sm"
	>
		<img src={PI_LOGO} alt="Pi" class="h-full w-auto" />
	</div>
</div>
