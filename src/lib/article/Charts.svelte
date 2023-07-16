<script>
	import { DATA_PARAMS } from '$lib/store/defectFilter/dataParams.store';
	import { ROUTE_NAMES } from '$lib/store/route.store';
	import { _ } from 'svelte-i18n';
	import ChartFrame from './ChartFrame.svelte';

	export let title;
	export let entity_params;
	export let lg = false;

	const byMileage = JSON.stringify({
		[DATA_PARAMS.BY_MILEAGE]: true,
		[DATA_PARAMS.NORMALIZE]: true
	});
	const params = `#entity_params=${entity_params}`;
	const chartOnly = `${ROUTE_NAMES.CHART_ONLY}${params}`;
	const byMileageChartOnly = `${chartOnly}&data_params=${byMileage}`;
</script>

<div class="Charts" class:lg>
	<ChartFrame {title} {lg} src={chartOnly} />
	<ChartFrame {title} {lg} src={byMileageChartOnly} />
</div>
<a href={`/${params}`} target="_blank">{$_('label.more')}</a>

<style scoped>
	.Charts {
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
	}
	.lg {
		flex-direction: column;
	}
</style>
