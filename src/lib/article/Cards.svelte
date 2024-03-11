<script lang="ts">
	import { PUBLIC_ORIGIN } from '$env/static/public';
	import Card from '$lib/article/Card.svelte';

	export let cards: { title: string; text?: string; imgSrc?: string; href?: string }[] = [];

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
	{@html `<script type="application/ld+json"> ${schema} </script>`}
</svelte:head>

{#if cards.length > 0}
	<div class="Cards">
		{#each cards as card, i}
			<Card
				lazy={i > 1}
				title={card.title}
				imgSrc={card.imgSrc || card.title}
				href={card.href}
				text={card.text}
			/>
		{/each}
	</div>
{/if}

<style scoped>
	.Cards {
		display: flex;
		flex-direction: column;
		gap: 16px;
		row-gap: 16px;
		justify-content: space-around;
		padding: 16px 0;
	}

	@media screen and (min-width: 500px) {
		.Cards {
			flex-direction: row;
			flex-wrap: wrap;
		}
	}
</style>
