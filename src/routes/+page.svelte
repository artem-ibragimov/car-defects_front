<script lang="ts">
	import Main from '$lib/view/Main.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	const title = 'Car-Defects - A Car Service Calls Statistics';
	const description =
		'Car-Defects.com - A Car Service Calls Statistics: Statistics of Defects by Age and Car Mileage';
	const keywords = `car,defects,reliability,comparison,statistics`;
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

<Main noChartData />
