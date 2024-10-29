<script lang="ts">
	import { PUBLIC_ORIGIN } from '$env/static/public';
	import BaseChart from '$lib/components/Chart.svelte';
	import Share from '$lib/components/Share.svelte';
	import { defectStore } from '$lib/store/main.store';
	import { ROUTE_NAMES } from '$lib/store/route.store';
	import { _ } from 'svelte-i18n';

	export let displayLegend = true;
	export let isFrameChart = false;

	$: ({ state: defectState, filter, selectedChartData } = defectStore);
	$: ({ noChartData, entities } = defectStore.filter.entityParams);
	$: ({ loading } = $defectState);
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

	$: chartURL = `${new URL(ROUTE_NAMES.CHART_ONLY, PUBLIC_ORIGIN)}${location.hash}`;
</script>

{#if !$noChartData}
	<BaseChart
		{title}
		data={$selectedChartData}
		{axes}
		{loading}
		{tooltip}
		{displayLegend}
		{isFrameChart}
	/>
	<Share value={chartURL} />
{/if}
