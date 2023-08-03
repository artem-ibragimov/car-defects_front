<script>
	import { ROUTE_NAMES } from '$lib/store/route.store';
	import Logo from '$lib/view/Logo.svelte';
</script>

<div class="Article">
	<Logo on:click={() => window.location.assign(ROUTE_NAMES.MAIN)} />
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
