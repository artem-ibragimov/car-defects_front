<script lang="ts">
	import { Chart } from 'chart.js/auto';
	import { onMount, tick } from 'svelte';
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
	export let data: Record<string, number> = {};

	let chartEl: HTMLCanvasElement;
	let chart: Chart;

	$: config = {
		type: 'doughnut',
		data: {
			labels: Object.keys(data),
			datasets: [
				{
					data: Object.values(data),
					backgroundColor: COLORS,
					hoverOffset: 4
				}
			]
		},
		options: {
			aspectRatio: 1,
			maintainAspectRatio: false,
			responsive: true,
			plugins: {
				title: { display: true, text: title },
				legend: {
					position: 'bottom'
				}
			}
		}
	};

	$: if (title && chart && chart.options?.plugins?.title) {
		chart.options.plugins.title.text = title;
		update();
	}
	function update() {
		tick().then(() => chart.update());
	}
	onMount(() => {
		// @ts-ignore
		chart = new Chart(chartEl, config);
	});
</script>

<div class="PieChart">
	<canvas bind:this={chartEl} />
</div>

<style scoped>
	.PieChart {
		height: 300px;
		flex-grow: 2;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		cursor: pointer;
		resize: both;
	}
</style>
