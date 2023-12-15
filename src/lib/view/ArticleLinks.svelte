<script lang="ts">
	import { PUBLIC_ORIGIN } from '$env/static/public';
	import Cards from '$lib/article/Cards.svelte';
	import { localeStore } from '$lib/store/main.store';
	import { ROUTE_NAMES } from '$lib/store/route.store';
	import { _ } from 'svelte-i18n';

	export let random = false;
	export let pagePath: string = '';

	$: ({ selected } = localeStore);

	$: cards = Object.entries(ROUTE_NAMES.ARTICLE)
		.sort(() => (random ? Math.random() - 0.5 : -1))
		.map(([name, path]) => ({
			title: $_(`text.article.${name}.title`),
			imgSrc: name,
			href: `/articles/${$selected}${path}`,
			path
		}))
		.filter((card) => (pagePath ? !card.path.includes(pagePath) : true))
		.slice(0, 4);

	$: itemListElement = cards.map((c, i) => ({
		'@type': 'ListItem',
		position: i + 1,
		name: c.title,
		item: `${PUBLIC_ORIGIN}${c.href}`,
		image: `${PUBLIC_ORIGIN}${c.imgSrc}.webp`
	}));

	$: schema = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json"> ${schema} </script>`}
</svelte:head>

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
