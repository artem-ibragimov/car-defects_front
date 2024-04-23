<script>
	import { defectStore } from '$lib/store/main.store';
	import DefectsChart from '$lib/view/chart/DefectsChart.svelte';
	import { onMount } from 'svelte';
	onMount(() => {
		defectStore.client();
	});
</script>

<DefectsChart isFrameChart />
