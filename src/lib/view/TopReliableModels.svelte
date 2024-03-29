<script lang="ts">
	import { PUBLIC_ORIGIN } from '$env/static/public';
	import { statStore } from '$lib/store/main.store';
	import { _ } from 'svelte-i18n';

	$: ({ state } = statStore);
	$: ({ data } = $state);

	$: items = data.map((v) => ({
		...v,
		url: `${PUBLIC_ORIGIN}/defects/${v.modelID}/${v.title.replaceAll(' ', '_')}`
	}));

	$: itemListElement = items.map((c, i) => ({
		'@type': 'ListItem',
		position: i + 1,
		name: c.title,
		item: c.url
	}));

	$: schema = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement
	});
</script>

<svelte:head>
	{#if itemListElement.length !== 0}
		{@html `<script type="application/ld+json"> ${schema} </script>`}
	{/if}
</svelte:head>

<div class="TopReliableModels">
	<div class="navbar w-full bg-base-200">
		<h1 class="text-5xl font-bold">{$_('label.top_reliable_cars')}</h1>
	</div>
	<ul class="timeline timeline-vertical">
		{#each items as item, i}
			<li>
				{#if i != 0}
					<hr />
				{/if}
				<!-- <div
					class="tooltip tooltip-bottom timeline-start timeline-box"
					data-tip={`${$_('label.sold_cars')} - ${item.sales}\n
					${$_('label.total-defects')} - ${item.defects}`}
				>
					{i + 1}
				</div> -->
				<div
					class="tooltip tooltip-bottom timeline-middle"
					data-tip={`${$_('label.sold_cars')} - ${item.sales}\n
					${$_('label.total-defects')} - ${item.defects}`}
				>
					{i + 1}
					<hr />
				</div>
				<div class="timeline-end timeline-box">
					<a href={item.url} target="_self"> {item.title}</a>
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
		z-index: 10;
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
