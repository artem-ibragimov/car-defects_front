<script lang="ts">
	import { appCsr } from '$lib/store/main.store';
	import DefectsChart from '$lib/view/chart/DefectsChart.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	appCsr(data.states);
</script>

<DefectsChart isFrameChart />
