<script>
	import Spinner from '$lib/components/Spinner.svelte';
	export let hidden = false;
</script>

<div class="Loading" class:Loading-hidden={hidden}><Spinner /></div>

<style scoped>
	.Loading {
		flex: 1;
		display: flex;
		justify-content: center;
		align-content: center;
		height: 300px;
	}
	.Loading-hidden {
		display: none;
	}
</style>
