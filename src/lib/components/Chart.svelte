<script lang="ts">
	import { Chart } from 'chart.js/auto';
	import { onMount } from 'svelte';
	import Loading from '../view/Loading.svelte';

	const COLORS = [
		'#4dc9f6',
		'#f67019',
		'#f53794',
		'#537bc4',
		'#acc236',
		'#166a8f',
		'#00a950',
		'#58595b',
		'#8549ba'
	];

	export let title: string;
	export let tooltip: string;
	export let axes: { y: string; x: string };
	export let data: Record<string, Record<string, string>> = {};
	export let loading: boolean = true;
	export let displayLegend = false;

	let chartEl: HTMLCanvasElement;
	let chart: Chart;

	$: config = {
		type: 'bar',
		data: { datasets: [] },
		options: {
			responsive: true,
			plugins: {
				title: { display: true, text: title },
				tooltip: {
					callbacks: {
						title() {
							return tooltip;
						}
					}
				},
				legend: {
					position: 'bottom',
					display: displayLegend
				}
			},
			scales: {
				x: {
					title: {
						display: true,
						text: axes.x
					}
				},
				y: {
					title: {
						display: true,
						text: axes.y
					}
				}
			}
		}
	};

	$: {
		if (chart && chart.data) {
			// @ts-ignore
			chart.data.datasets = Object.entries(data).map(([label, data], i) => ({
				label,
				data,
				borderColor: COLORS[i],
				backgroundColor: `${COLORS[i]}f0`
			}));
			chart.update();
		}
	}
	$: if (title && chart && chart.options?.plugins?.title) {
		chart.options.plugins.title.text = title;
		chart.update();
	}
	$: if (axes && chart) {
		// @ts-ignore
		chart.options.scales.x.title.text = axes.x;
		// @ts-ignore
		chart.options.scales.y.title.text = axes.y;
		chart.update();
	}
	onMount(() => {
		// @ts-ignore
		chart = new Chart(chartEl, config);
	});
</script>

<div class="Chart">
	<Loading hidden={!loading} />
	<canvas bind:this={chartEl} hidden={loading} />
</div>

<style scoped>
	.Chart {
		min-width: 400px;
		min-height: 200px;
		flex: 2 2;
		max-height: 500px;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		cursor: pointer;
	}
	@media (min-width: 500px) {
		.Chart {
			/* height: 100vh; */
		}
	}

	.Chart__items-end {
		display: flex;
		justify-content: flex-end;
	}
	.Chart__padding-y {
		padding: 0 10px;
	}
</style>
