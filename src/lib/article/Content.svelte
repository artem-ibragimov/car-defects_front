<script lang="ts">
	export let data: string;
	$: content = data.split('\n');
</script>

<div class="Content">
	{#each content as p}
		{#if p.length < 100}
			<h3>{p}</h3>
		{/if}
		{#if p.length > 100}
			<p>{p}</p>
		{/if}
	{/each}
</div>

<style scoped>
	.Content {
	}
</style>
