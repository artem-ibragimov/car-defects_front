<script lang="ts">
	import { PUBLIC_ORIGIN } from '$env/static/public';
	import { searchStore, statStore } from '$lib/store/main.store';
	import { _ } from 'svelte-i18n';

	$: ({ state } = statStore);
	$: ({ data } = $state);

	$: ({ state: searchState } = searchStore);
	$: ({ query } = $searchState);

	$: items = data.map((v) => ({
		...v,
		filtered: query && v.title.toLowerCase().includes(query),
		url: `${PUBLIC_ORIGIN}/defects/${v.modelID}/${v.title.replaceAll(' ', '_')}`
	}));

	let container: HTMLUListElement;
	$: if (query) {
		let targetEl = container && (container.querySelector('.matched') as HTMLLIElement);
		if (targetEl) {
			container.scrollTop = targetEl.offsetTop + container.clientHeight / 2;
		}
	}
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
		<h2 class="text-5xl font-bold">{$_('label.top_reliable_cars')}</h2>
	</div>
	<ul class="timeline timeline-vertical" bind:this={container}>
		{#each items as item, i}
			<li>
				{#if i !== 0}
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
				<div class="timeline-end timeline-box" class:matched={item.filtered}>
					<a href={item.url} target="_self"> {item.title}</a>
				</div>
				{#if i !== items.length - 1}
					<hr />
				{/if}
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
		max-height: 400px;
		overflow-y: scroll;
		scroll-behavior: smooth;
	}
	.timeline-box:hover,
	.matched {
		background: oklch(var(--a));
	}
	.timeline-box {
		cursor: pointer;
		text-transform: capitalize;
	}
</style>
