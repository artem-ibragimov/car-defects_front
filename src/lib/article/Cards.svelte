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
		gap: 10px;
		row-gap: 10px;
		justify-content: space-around;
		padding: 16px;
	}

	@media screen and (min-width: 500px) {
		.Cards {
			flex-direction: row;
			flex-wrap: wrap;
		}
	}
</style>
