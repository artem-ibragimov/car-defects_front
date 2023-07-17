<script lang="ts">
	import { DATA_PARAMS } from '$lib/store/defectFilter/dataParams.store';
	import { defectStore } from '$lib/store/main.store';
	import Selector from '$lib/components/Selector.svelte';

	$: ({ params } = defectStore.filter.dataParams);
	$: variants = [
		{
			label: 'label.norm',
			selected: $params && $params.norm,
			value: DATA_PARAMS.NORMALIZE
		},
		{
			label: 'label.total',
			selected: $params && $params.total,
			value: DATA_PARAMS.TOTAL
		}
	];
</script>

<Selector {variants} on:select />
