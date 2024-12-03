<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { statStore } from '$lib/store/main.store';
	import PieChart from '$lib/components/PieChart.svelte';

	$: ({ state } = statStore);
	$: ({ sources = {} } = $state);

	$: data = Object.fromEntries(
		Object.entries(sources).map(([name, amount]) => [name, Number(amount)])
	);
	$: total_defects = Object.values(data).reduce((total, amount) => total + amount, 0);
	const project_start_date = 'Sep 2022';
	const current_date = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
	const total_brand = 19;
	const total_version = 4724;
</script>

<div class="stats shadow stats-vertical">
	<div class="stat">
		<PieChart title={$_('label.data_sources')} {data} />
	</div>
	<div class="stat">
		<div class="stat-figure text-secondary">
			<img
				width="64"
				height="64"
				src="/assets/icon/car_crash.png"
				alt={$_('label.total-defects')}
			/>
		</div>
		<div class="stat-title">{$_('label.total-defects')}</div>
		<div class="stat-value">{total_defects}</div>
		<div class="stat-desc">{project_start_date} - {current_date}</div>
	</div>
	<div class="stat">
		<div class="stat-figure">
			<img
				width="64"
				height="64"
				src="/assets/icon/car_maker.png"
				alt={$_('label.analyzed-brands')}
			/>
		</div>
		<div class="stat-title">{$_('label.analyzed-brands')}</div>
		<div class="stat-value">{total_brand}</div>
		<div class="stat-desc">84{$_('label.of-total-car')}</div>
	</div>

	<div class="stat">
		<div class="stat-figure text-secondary">
			<img
				width="64"
				height="64"
				src="/assets/icon/car_versions.png"
				alt={$_('label.analyzed-versions')}
			/>
		</div>
		<div class="stat-title">{$_('label.analyzed-versions')}</div>
		<div class="stat-value">{total_version}</div>
	</div>
</div>

<!-- <iframe
	class="Trailer"
	width="100%"
	height="400"
	{src}
	title="About Car-Defects Project"
	frameborder="0"
	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
	allowfullscreen
/> -->

<style scoped>
	.stat-title {
		text-wrap: wrap;
	}
	.stat-figure img {
		max-width: 32px;
	}
</style>
