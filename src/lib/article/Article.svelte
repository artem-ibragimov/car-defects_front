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
	$: date = $_(`${i18nPath}.date`);
	$: chapters = $_(`${i18nPath}.text`).split('\n## ');

	const SIZES = [320, 640];
	const poster = `${PUBLIC_ORIGIN}/assets/img/${article_name}.webp`;
	$: srcset = poster
		? SIZES.map((w) => `/assets/img/${article_name}--${w}.webp ${w}w`).join(', ')
		: '';

	$: hash = $_(`${i18nPath}.hash`);
	$: schema = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: title,
		image: poster,
		datePublished: date,
		articleBody: chapters,
		keywords,
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

<article class="Article prose bg-base-100 shadow-xl">
	<Logo on:click={() => typeof location !== 'undefined' && location.assign(ROUTE_NAMES.MAIN)} />
	<h1>{title}</h1>
	<img src={poster} alt={title} {srcset} sizes="(max-width: 500px) 100vw, 70vw" />
	{#if hash !== '-'}
		<Charts lg {title} url={hash} />
	{/if}
	<main>
		{#each chapters as chapter}
			<Content md={chapter} />
		{/each}
	</main>
	<footer>
		<!-- <Cards {cards} /> -->
		<ArticleLinks pagePath={article_name} articleAfterDate={date} />
	</footer>
</article>

<style scoped>
	.Article {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: stretch;
		margin: auto;
		padding: 16px;
		max-width: 800px;
	}
</style>
