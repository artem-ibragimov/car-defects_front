<script lang="ts">
	export let data: string;
	$: content = data.split('\n');
</script>

<section class="Content">
	{#each content as p}
		{#if p.length < 100 && p.length > 0}
			<h3>{p}</h3>
		{/if}
		{#if p.length > 100}
			<p>{p}</p>
		{/if}
	{/each}
</section>
