<script lang="ts">
	import { PUBLIC_ORIGIN } from '$env/static/public';
	import Card from '$lib/article/Card.svelte';

	export let cards: { title: string; text?: string; imgSrc: string; href?: string }[] = [];

	$: itemListElement = cards.map((c, i) => ({
		'@type': 'ListItem',
		position: i + 1,
		name: c.title,
		description: c.text,
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
	{#if itemListElement.length !== 0}
		{@html `<script type="application/ld+json"> ${schema} </script>`}
	{/if}
</svelte:head>

{#if cards.length > 0}
	<nav class="Cards grid gap-4 grid-cols-1 md:grid-cols-2">
		{#each cards as card, i}
			<Card
				lazy={i > 1}
				title={card.title}
				href={card.href}
				text={card.text}
				imgSrc={card.imgSrc}
			/>
		{/each}
	</nav>
{/if}
