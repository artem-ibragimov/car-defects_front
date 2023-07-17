<script lang="ts">
	import { DATA_PARAMS } from '$lib/store/defectFilter/dataParams.store';
	import { defectStore } from '$lib/store/main.store';
	import Selector from '$lib/components/Selector.svelte';

	$: ({ params } = defectStore.filter.dataParams);
	$: variants = [
		{
			label: 'label.by_age',
			selected: $params && $params.by_age,
			value: DATA_PARAMS.BY_AGE
		},
		{
			label: 'label.by_mileage',
			selected: $params && $params.by_mileage,
			value: DATA_PARAMS.BY_MILEAGE
		}
	];
</script>

<Selector {variants} on:select />
