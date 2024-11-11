<script lang="ts">
	// import { type Chart } from 'chart.js/auto';
	import { tick } from 'svelte';

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
	let chart;

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
	const render = () => {
		// @ts-ignore
		chart = new Chart(chartEl, config);
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
