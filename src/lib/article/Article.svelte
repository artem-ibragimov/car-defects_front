<script lang="ts">
	import { ROUTE_NAMES } from '$lib/store/route.store';
	import ArticleLinks from '$lib/view/ArticleLinks.svelte';
	import Logo from '$lib/view/Logo.svelte';

	export let title: string;
	export let cards: { title: string }[] = [];

	$: description = `${cards.map((c) => c.title).join(' vs ')} breakdown statistics comparison`;
	$: keywords = `car,defects,${cards.map((c) => c.title).join(',')}`;
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
</svelte:head>

<div class="Article">
	<Logo on:click={() => window.location.assign(ROUTE_NAMES.MAIN)} />

	<slot />

	<ArticleLinks />
</div>

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
