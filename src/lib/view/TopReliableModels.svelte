<script lang="ts">
	import { statStore } from '$lib/store/main.store';
	import { _ } from 'svelte-i18n';

	$: ({ state } = statStore);
	$: ({ data } = $state);

	$: itemListElement = data.map((c, i) => ({
		'@type': 'ListItem',
		position: i + 1,
		name: c.title,
		description: c.title
	}));

	$: schema = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		itemListElement
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json"> ${schema} </script>`}
</svelte:head>

<div class="TopReliableModels">
	<div class="navbar w-full">
		<h1 class="text-5xl font-bold">{$_('label.top_reliable_cars')}</h1>
	</div>
	<ul class="timeline timeline-vertical">
		{#each data as item, i}
			<li>
				{#if i != 0}
					<hr />
				{/if}
				<div
					class="tooltip tooltip-bottom timeline-start timeline-box"
					data-tip={`${$_('label.sold_cars')} - ${item.sales}\n
					${$_('label.total-defects')} - ${item.defects}`}
				>
					{i + 1}
				</div>
				<div class="timeline-middle">
					<!-- {i + 1} -->
					<hr />
				</div>
				<div class="timeline-end timeline-box">
					<a href={`/defects/${item.modelID}/${item.title.replaceAll(' ', '_')}`} target="_self">
						{item.title}</a
					>
				</div>
				<hr />
			</li>
		{/each}
	</ul>
</div>

<style scoped>
	.TopReliableModels {
		display: flex;
		flex-direction: column;
	}
	.navbar {
		position: sticky;
		top: 0;
	}
	.timeline {
		max-height: 500px;
		overflow-y: scroll;
	}
	.timeline-box:hover {
		background: oklch(var(--a));
	}
	.timeline-box {
		cursor: pointer;
		text-transform: capitalize;
	}
</style>
