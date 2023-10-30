<script lang="ts">
	export let data: string;
	$: content = data.split('\n');
</script>

<div class="Content">
	{#each content as p}
		<p>{p}</p>
	{/each}
</div>

<style scoped>
	.Content {
	}
</style>
