<script lang="ts">
	export let data: string;
	$: content = data.split('\n');
</script>

<main class="Content">
	{#each content as p}
		{#if p.length < 100}
			<h3>{p}</h3>
		{/if}
		{#if p.length > 100}
			<section>{p}</section>
		{/if}
	{/each}
</main>

<style scoped>
	.Content {
	}
</style>
