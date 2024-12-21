<script lang="ts">
	import { defectStore } from '$lib/store/main.store';
	import Selector from '$lib/components/Selector.svelte';

	export let className = '';

	let { colors, entities, selectedEntities } = defectStore.filter.entityParams;
	$: variants = Object.keys($entities).map((value) => ({
		value,
		selected: $selectedEntities[value],
		color: $colors[value]
	}));
</script>

<Selector
	{className}
	multiselect
	{variants}
	on:select={({ detail }) => {
		defectStore.filter.entityParams.selectEntities(detail);
	}}
	on:reset={defectStore.clear}
/>
