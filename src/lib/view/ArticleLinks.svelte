<script lang="ts">
	import Card from '$lib/article/Card.svelte';
	import Cards from '$lib/article/Cards.svelte';
	import { localeStore } from '$lib/store/main.store';
	import { ROUTE_NAMES } from '$lib/store/route.store';
	import { _ } from 'svelte-i18n';

	$: ({ selected } = localeStore);
	const pagePath = typeof location !== 'undefined' ? location.pathname : '';

	$: cards = Object.entries(ROUTE_NAMES.ARTICLE).map(([name, path]) => ({
		title: $_(`text.article.${name}.title`),
		imgSrc: name,
		href: `/${$selected}${path}`,
		path
	}));
	$: if (pagePath) {
		cards = cards.filter((card) => !pagePath.includes(card.path));
	}
</script>

<div class="ArticleLinks">
	<Cards {cards} />
</div>

<style scoped>
	.ArticleLinks {
		flex: 1;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		justify-content: center;
	}
</style>
