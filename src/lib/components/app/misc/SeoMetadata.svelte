<script lang="ts">
	import {
		SITE_URL,
		SITE_TITLE,
		SITE_DESCRIPTION,
		OG_IMAGE_PATH,
		OG_IMAGE_ALT
	} from '$lib/constants/site';
</script>

<svelte:head>
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
