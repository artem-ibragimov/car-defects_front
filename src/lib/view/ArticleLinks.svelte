<script lang="ts">
	import { PUBLIC_ORIGIN } from '$env/static/public';
	import Cards from '$lib/article/Cards.svelte';
	import { localeStore } from '$lib/store/main.store';
	import { ROUTE_NAMES } from '$lib/store/route.store';
	import { _, t } from 'svelte-i18n';

	export let random = false;
	export let pagePath: string = '';
	export let articleAfterDate: string = '';

	const dateAfter = new Date(articleAfterDate).getTime();
	$: ({ lang } = localeStore);

	$: cards = Object.entries(
		ROUTE_NAMES.ARTICLE[($lang as keyof typeof ROUTE_NAMES.ARTICLE) || 'en']
	)
		.sort(([_, article]) =>
			random ? Math.random() - 0.5 : dateAfter - new Date(article.date).getTime()
		)
		.map(([name, article]) => ({
			title: article.title,
			date: article.date,
			text: article.cars.map((c) => `#${c}`).join(' '),
			keywords: article.keywords,
			name,
			imgSrc: name,
			href: `/articles/${$lang}/${name}`
		}))
		.filter(({ name }) => name !== pagePath)
		.slice(0, 4);

	$: itemListElement = cards.map((c, i) => ({
		'@type': 'ListItem',
		position: i + 1,
		name: c.title,
		description: c.text,
		keywords: c.keywords,
		item: `${PUBLIC_ORIGIN}${c.href}`
	}));

	$: schema = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement
	});
</script>

<svelte:head>
	{#if itemListElement.length !== 0}
		{@html `<script type="application/ld+json"> ${schema} </script>`}
	{/if}
</svelte:head>

<Cards {cards} />
