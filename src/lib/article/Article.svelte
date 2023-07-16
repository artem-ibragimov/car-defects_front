<script>
	import Header from '../view/Header.svelte';
</script>

<div class="Article">
	<Header />
	<slot />
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
