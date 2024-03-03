<script lang="ts">
	import Main from '$lib/view/Main.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const name = data.name[0].toUpperCase() + data.name.slice(1);
	const title = `${name} Problems on Car-Defects.com`;
	const description = `Find the most common issues based on ${name} owner complaints`;
	const keywords = `${name.split(' ').join(',')}car,defects,reliability,statistics`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="og:title" property="og:title" content={title} />
	<meta property="og:url" content={data.url.toString()} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta name="keywords" content={keywords} />
</svelte:head>

<Main />
