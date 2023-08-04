<script lang="ts">
	import Card from '$lib/article/Card.svelte';

	export let cards: { title: string; text: string }[] = [];
</script>

<div class="Cards">
	{#each cards as card}
		<Card title={card.title} imgSrc={card.title}>{card.text}</Card>
	{/each}
</div>

<style scoped>
	.Cards {
		display: flex;
		flex-direction: column;
		gap: 16px;
		row-gap: 16px;
		justify-content: space-between;
		padding: 16px 0;
	}

	@media screen and (min-width: 500px) {
		.Cards {
			flex-direction: row;
			flex-wrap: wrap;
		}
	}
</style>
