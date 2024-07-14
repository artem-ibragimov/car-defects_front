<script lang="ts">
	import { AVAILABLE_LOCALES } from '$lib/i18n';
	import { ROUTE_NAMES } from '$lib/store/route.store';
	import Logo from '$lib/view/Logo.svelte';
	import { _ } from 'svelte-i18n';
	import Charts from './Charts.svelte';
	import Content from './Content.svelte';
	import { PUBLIC_ORIGIN } from '$env/static/public';

	export let i18nPath: string;
	export let title: string;
	export let description: string;
	export let keywords: string;
	export let content: string;
	export let name: string;

	const date = new Date().toISOString();

	const poster = `${PUBLIC_ORIGIN}/assets/img/${name}.png`;

	$: url = $_(`${i18nPath}.url`);
	$: schema = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: title,
		// image: poster,
		datePublished: date,
		dateModified: date,
		articleBody: content,
		about: description
	});
	const SIZES = [320, 640, 1280];
	$: srcset = name ? SIZES.map((w) => `/assets/img/${name}--${w}.webp ${w}w`).join(', ') : '';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />

	<meta name="og:title" property="og:title" content={title} />
	<meta property="og:image" content={poster} />
	<meta property="og:type" content="article" />
	<meta property="og:locale" content="en" />
	{#each AVAILABLE_LOCALES as locale}
		<meta property="og:locale:alternate" content={locale} />
	{/each}
	<meta property="og:description" content={description} />

	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={poster} />

	{@html `<script type="application/ld+json"> ${schema} </script>`}
</svelte:head>

<article class="Article prose">
	<Logo on:click={() => typeof location !== 'undefined' && location.assign(ROUTE_NAMES.MAIN)} />
	<!-- <img src={poster} alt={title} {srcset} sizes="(max-width: 500px) 100vw, 70vw" /> -->
	<h1 class="">{title}</h1>
	{#if url !== '-'}
		<Charts lg {title} {url} />
	{/if}
	<Content data={content} />
	<!-- <Cards {cards} /> -->
</article>

<style scoped>
	.Article {
		padding: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: stretch;
		margin: auto;
		max-width: 920px;
	}
</style>
