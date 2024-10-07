<script lang="ts">
	import { ROUTE_NAMES } from '$lib/store/route.store';
	import Logo from '$lib/view/Logo.svelte';
	import { _ } from 'svelte-i18n';
	import Charts from './Charts.svelte';
	import Content from './Content.svelte';
	import { PUBLIC_ORIGIN } from '$env/static/public';
	import ArticleLinks from '$lib/view/ArticleLinks.svelte';

	export let article_name: string;
	export let locale: string;

	const i18nPath = `text.article.${article_name}`;
	$: title = $_(`${i18nPath}.title`);
	$: description = $_(`${i18nPath}.description`);
	$: keywords = $_(`${i18nPath}.keywords`);
	$: content = $_(`${i18nPath}.text`);

	const date = new Date().toISOString();
	const SIZES = [320, 640, 1280];
	const poster = `${PUBLIC_ORIGIN}/assets/img/${article_name}.png`;
	$: srcset = poster
		? SIZES.map((w) => `/assets/img/${article_name}--${w}.webp ${w}w`).join(', ')
		: '';

	$: url = $_(`${i18nPath}.url`);
	$: schema = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: title,
		image: poster,
		datePublished: date,
		dateModified: date,
		articleBody: content,
		about: description
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />

	<meta name="og:title" property="og:title" content={title} />
	<meta property="og:image" content={poster} />
	<meta property="og:type" content="article" />
	<meta property="og:locale" content={locale} />
	<meta property="og:description" content={description} />

	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={poster} />

	{@html `<script type="application/ld+json"> ${schema} </script>`}
</svelte:head>

<article class="Article prose">
	<Logo on:click={() => typeof location !== 'undefined' && location.assign(ROUTE_NAMES.MAIN)} />
	<img src={poster} alt={title} {srcset} sizes="(max-width: 500px) 100vw, 70vw" />
	<h1>{title}</h1>
	{#if url !== '-'}
		<Charts lg {title} {url} />
	{/if}
	<Content data={content} />
	<!-- <Cards {cards} /> -->
	<ArticleLinks pagePath={article_name} />
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
