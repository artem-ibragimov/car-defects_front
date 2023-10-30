<script lang="ts">
	import { PUBLIC_ORIGIN } from '$env/static/public';
	import { ROUTE_NAMES } from '$lib/store/route.store';
	import ArticleLinks from '$lib/view/ArticleLinks.svelte';
	import Logo from '$lib/view/Logo.svelte';
	import { _ } from 'svelte-i18n';
	import Content from './Content.svelte';
	import Charts from './Charts.svelte';
	import Cards from './Cards.svelte';

	export let i18nPath: string;
	export let title: string;
	export let content: string;
	export let name: keyof typeof ROUTE_NAMES.ARTICLE;
	export let cards: { title: string }[] = [];

	const date = new Date().toISOString();

	$: images = cards.map((c) => `${PUBLIC_ORIGIN}/assets/img/${c.title}.webp`);
	const poster = `${PUBLIC_ORIGIN}/assets/img/${name}.webp`;
	$: description = `${cards.map((c) => c.title).join(' vs ')} breakdown statistics comparison`;
	$: keywords = `car,defects,${cards.map((c) => c.title).join(',')}`;
	$: cards = JSON.parse($_(`${i18nPath}.cards`));
	$: entity_params = $_(`${i18nPath}.entity_params`);
	$: schema = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: title,
		image: poster,
		images,
		datePublished: date,
		dateModified: date,
		articleBody: description,
		about: description
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="og:title" property="og:title" content={title} />
	<meta name="og:image" property="og:image" content={poster} />
	<meta property="og:type" content="article" />
	<meta property="og:locale" content="en" />
	<meta property="og:locale:alternate" content="ru" />
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<meta name="keywords" content={keywords} />

	{@html `<script type="application/ld+json"> ${schema} </script>`}
</svelte:head>

<article class="Article">
	<Logo on:click={() => typeof location !== 'undefined' && location.assign(ROUTE_NAMES.MAIN)} />
	<h1>{title}</h1>
	<Cards {cards} />
	<Content data={content} />
	<Charts lg {title} {entity_params} />

	<ArticleLinks />
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
