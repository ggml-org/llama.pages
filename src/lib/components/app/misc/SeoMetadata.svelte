<script lang="ts">
	import {
		SITE_URL,
		SITE_TITLE,
		SITE_DESCRIPTION,
		OG_IMAGE_PATH,
		OG_IMAGE_ALT
	} from '$lib/constants/site';
	import iconLight from '$lib/assets/icon-light.svg?url';
	import iconDark from '$lib/assets/icon-light.svg?url';

	function updateFavicon() {
		const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
		if (link) {
			link.href = dark ? iconDark : iconLight;
		}
	}

	$effect(() => {
		const mql = window.matchMedia('(prefers-color-scheme: dark)');

		function handleChange() {
			updateFavicon();
		}

		mql.addEventListener('change', handleChange);
		updateFavicon();

		return () => {
			mql.removeEventListener('change', handleChange);
		};
	});
</script>

<svelte:head>
    <link rel="icon" href={iconLight} />

	<title>{SITE_TITLE}</title>
    <meta name="description" content={SITE_DESCRIPTION} />

	<meta property="og:type" content="website" />
	<meta property="og:title" content={SITE_TITLE} />
	<meta property="og:description" content={SITE_DESCRIPTION} />
	<meta property="og:url" content={SITE_URL} />
	<meta property="og:image" content={OG_IMAGE_PATH} />
	<meta property="og:image:alt" content={OG_IMAGE_ALT} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={SITE_TITLE} />
	<meta name="twitter:description" content={SITE_DESCRIPTION} />
	<meta name="twitter:image" content={OG_IMAGE_PATH} />
</svelte:head>
