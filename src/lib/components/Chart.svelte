<script lang="ts">
	// import { type Chart } from 'chart.js/auto';
	import { tick } from 'svelte';
	import Loading from '../view/Loading.svelte';

	const COLORS = [
		'#4dc9f6',
		'#f67019',
		// '#f53794',
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
	export let isFrameChart = false;

	let chartEl: HTMLCanvasElement;
	let chart;

	$: config = {
		type: 'bar',
		data: {
			datasets: Object.entries(data).map(([label, data], i) => ({
				label,
				data,
				borderColor: COLORS[i],
				backgroundColor: `${COLORS[i]}f0`
			}))
		},
		options: {
			aspectRatio: 1,
			maintainAspectRatio: false,
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
	// TODO update вызывается несколько раз
	$: {
		if (chart && chart.data) {
			// @ts-ignore
			chart.data.datasets = Object.entries(data).map(([label, data], i) => ({
				label,
				data,
				borderColor: COLORS[i],
				backgroundColor: `${COLORS[i]}f0`
			}));
			update();
		}
	}
	$: if (title && chart && chart.options?.plugins?.title) {
		chart.options.plugins.title.text = title;
		update();
	}
	$: if (axes && chart) {
		// @ts-ignore
		chart.options.scales.x.title.text = axes.x;
		// @ts-ignore
		chart.options.scales.y.title.text = axes.y;
		update();
	}
	let udpdating = false;
	function update() {
		if (udpdating) {
			return;
		}
		udpdating = true;
		setTimeout(() => {
			tick().then(() => {
				chart.update();
				udpdating = false;
			});
		}, 400);
	}
	const render = () => {
		// @ts-ignore
		// chart = new Chart(chartEl, config);
	};
</script>

<svelte:head>
	<script
		src="https://cdn.jsdelivr.net/npm/chart.js"
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
		on:load={render}
		async
		defer
	></script>
</svelte:head>

<div class="Chart" class:Chart-frame={isFrameChart}>
	<Loading hidden={!loading} />
	<canvas bind:this={chartEl} style:display={loading ? 'none' : 'block'} />
</div>

<style scoped>
	.Chart {
		height: 400px;
		flex-grow: 2;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		cursor: pointer;
		resize: both;
	}
	@media (min-width: 500px) {
		.Chart-frame {
			height: calc(100vh - 24px);
		}
	}
</style>
