<script lang="ts">
	import { defectStore } from '$lib/store/main.store';
	import Selector from '../../components/Selector.svelte';

	let { colors, entities, selectedEntities } = defectStore.filter.entityParams;

	$: variants = Object.keys($entities).map((value) => ({
		value,
		selected: $selectedEntities[value],
		color: $colors[value]
	}));
</script>

<Selector
	column
	multiselect
	{variants}
	on:select={({ detail }) => {
		defectStore.filter.entityParams.selectEntities(detail);
	}}
	needResetButton
	on:reset={defectStore.filter.entityParams.resetEntities}
/>
