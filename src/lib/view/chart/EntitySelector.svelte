<script lang="ts">
	import { defectStore } from '$lib/store/main.store';
	import Selector from '$lib/components/Selector.svelte';

	let { colors, entities, selectedEntities } = defectStore.filter.entityParams;

	$: variants = Object.keys($entities).map((value) => ({
		value,
		selected: $selectedEntities[value],
		color: $colors[value]
	}));
</script>

<Selector
	multiselect
	{variants}
	on:select={({ detail }) => {
		defectStore.filter.entityParams.selectEntities(detail);
	}}
	on:reset={defectStore.clear}
/>
