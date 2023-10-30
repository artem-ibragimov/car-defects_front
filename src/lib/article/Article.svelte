<script lang="ts">
	import { PUBLIC_ORIGIN } from '$env/static/public';
	import { ROUTE_NAMES } from '$lib/store/route.store';
	import ArticleLinks from '$lib/view/ArticleLinks.svelte';
	import Logo from '$lib/view/Logo.svelte';

	export let title: string;
	export let cards: { title: string }[] = [];

	const date = new Date().toISOString();

	$: images = cards.map((c) => `${PUBLIC_ORIGIN}/assets/img/${c.title}.webp`);
	$: description = `${cards.map((c) => c.title).join(' vs ')} breakdown statistics comparison`;
	$: keywords = `car,defects,${cards.map((c) => c.title).join(',')}`;
	$: schema = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: title,
		// image: `${PUBLIC_ORIGIN}${location.pathname.split('/').pop()}.webp`,
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
	<meta property="og:type" content="article" />
	<meta property="og:locale" content="en" />
	<meta property="og:locale:alternate" content="ru" />
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<meta name="keywords" content={keywords} />

	{@html `<script type="application/ld+json"> ${schema} </script>`}
</svelte:head>

<article class="Article">
	<Logo on:click={() => window.location.assign(ROUTE_NAMES.MAIN)} />
	<h1>{title}</h1>

	<slot />

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
