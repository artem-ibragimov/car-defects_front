<script lang="ts">
	import BaseChart from '$lib/components/Chart.svelte';
	import { defectStore } from '$lib/store/main.store';
	import { _ } from 'svelte-i18n';

	export let displayLegend = true;
	export let isFrameChart = false;

	$: ({ state: defectState, filter, selectedChartData } = defectStore);
	$: ({ loading } = $defectState);
	$: ({ noChartData } = defectStore.filter.entityParams);

	$: ({ params: selectedData } = filter.dataParams);
	$: ({ by_age, by_mileage, norm, total } = isFrameChart
		? filter.dataParams.getDataParams()
		: $selectedData);
	$: type = (by_age && 'by_age') || (by_mileage && 'by_mileage');
	$: normal = (norm && 'norm') || (total && 'total');
	$: tooltip = $_(`label.chart.${type}.${normal}.tooltip`);
	$: title = $_(`label.chart.${type}.${normal}.title`);
	$: axes = {
		y: $_(`label.chart.${type}.y`),
		x: $_(`label.chart.${type}.x`)
	};
</script>

{#if !$noChartData}
	<BaseChart
		{title}
		data={$selectedChartData}
		{axes}
		{tooltip}
		{loading}
		{displayLegend}
		{isFrameChart}
	/>
{/if}
