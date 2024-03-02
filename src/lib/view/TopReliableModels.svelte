<script lang="ts">
	import { statStore, defectStore } from '$lib/store/main.store';
	import { _ } from 'svelte-i18n';

	$: ({ state } = statStore);
	$: ({ data } = $state);

	function onClick({ title, modelID }: { title: string; modelID: string }) {
		defectStore.addEntity(title, { modelID });
	}
</script>

<div class="TopReliableModels">
	<div class="navbar bg-base-100 w-full">
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
				<div class="timeline-end timeline-box" on:click={onClick(item)}>
					{item.title}
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
