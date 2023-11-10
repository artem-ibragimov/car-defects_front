<script lang="ts">
	import { DATA_PARAMS } from '$lib/store/defectFilter/dataParams.store';
	import { ROUTE_NAMES } from '$lib/store/route.store';
	import { _ } from 'svelte-i18n';
	import ChartFrame from './ChartFrame.svelte';

	export let title: string;
	export let url: string;
	export let lg = false;

	const src = `${ROUTE_NAMES.CHART_ONLY}${url}`;
</script>

<div class="Charts" class:lg>
	<ChartFrame {title} {lg} {src} />
</div>
<a href={`/${url}`} target="_blank">{$_('label.more')}</a>

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
