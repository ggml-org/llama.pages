import CodeCopyButton from '$lib/components/app/docs/CodeCopyButton.svelte';
import { mount, unmount } from 'svelte';

/**
 * Mounts a hover copy button onto every `<pre>` block inside the article.
 * The markdown HTML is rendered by the content component, so the buttons are
 * mounted imperatively here. Re-runs when the page changes (walks a getter so
 * reactive reads stay tracked), and tears the buttons down on cleanup.
 */
export function useCodeCopyButtons(
	getArticle: () => HTMLElement | undefined,
	getPageKey: () => string
) {
	$effect(() => {
		// Re-run when the docs page changes under the same route component.
		void getPageKey();
		const article = getArticle();

		if (!article) return;

		const buttons = [...article.querySelectorAll('pre')].map((pre) => {
			const wrapper = document.createElement('div');

			wrapper.className = 'group relative';
			pre.replaceWith(wrapper);
			wrapper.appendChild(pre);
			const button = mount(CodeCopyButton, {
				props: { getText: () => pre.innerText },
				target: wrapper
			});

			return { button, pre, wrapper };
		});

		return () => {
			for (const { button, pre, wrapper } of buttons) {
				unmount(button);

				if (wrapper.isConnected) wrapper.replaceWith(pre);
			}
		};
	});
}
