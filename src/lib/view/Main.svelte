<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { appInit, defectStore } from '$lib/store/main.store';
	import { ROUTE_NAMES } from '$lib/store/route.store';
	import About from '$lib/view/About.svelte';
	import AgeMileageRadio from '$lib/view/AgeMileageSelector.svelte';
	import ArticleLinks from '$lib/view/ArticleLinks.svelte';
	import Header from '$lib/view/Header.svelte';
	import Search from '$lib/view/Search.svelte';
	import TotalNormRadio from '$lib/view/TotalNormSelector.svelte';
	import DefectCategorySelector from '$lib/view/chart/DefectCategorySelector.svelte';
	import DefectsChart from '$lib/view/chart/DefectsChart.svelte';
	import EntitySelector from '$lib/view/chart/EntitySelector.svelte';
	import { _ } from 'svelte-i18n';
	import DefectDetails from './DefectDetails.svelte';
	import Trailer from './Trailer.svelte';

	$: ({ setDataParams } = defectStore.filter.dataParams);
	$: ({ noChartData } = defectStore.filter.entityParams);
	appInit();

	function onSearch(
		e: CustomEvent<
			{ title: string } & Partial<{
				brandID: string;
				modelID: string;
				genID: string;
				versionID: string;
			}>
		>
	) {
		defectStore.addEntity(e.detail.title, {
			brandID: e.detail.brandID,
			modelID: e.detail.modelID,
			genID: e.detail.genID,
			versionID: e.detail.versionID
		});
	}
</script>

<div class="MainContainer">
	<div class="MainContainer_column MainContainer_content">
		<Header />
		<div class="MainContainer_row MainContainer_wrap">
			<Search on:input={onSearch} />
		</div>
		<div class="MainContainer_row MainContainer_mobile_column-reverse">
			<div class="MainContainer_column">
				<div
					class="MainContainer_row MainContainer_space-between"
					class:MainContainer_mobile_invisible={$noChartData}
					hidden={$noChartData}
				>
					<TotalNormRadio on:select={({ detail }) => setDataParams(detail)} />
					<AgeMileageRadio on:select={({ detail }) => setDataParams(detail)} />
					<!-- <LocaleSelector /> -->
				</div>
				<div class="MainContainer_grow">
					<DefectsChart displayLegend={false} />
					{#if $noChartData}
						<div class="MainContainer_row MainContainer_grow MainContainer_space-around">
							<Trailer />
						</div>
					{/if}
				</div>
				{#if !$noChartData}
					<EntitySelector />
					<Button outline href={ROUTE_NAMES.ADD_DATA}>{$_('label.add_data')}</Button>
				{/if}
				<div
					class="MainContainer_row MainContainer_mobile_column"
					class:MainContainer_mobile_invisible={$noChartData}
				>
					<DefectDetails />
				</div>
			</div>
			<div>
				<div
					class="MainContainer_sidebar MainContainer_mobile_column-reverse"
					class:MainContainer_mobile_invisible={$noChartData}
					hidden={$noChartData}
				>
					<DefectCategorySelector />
				</div>
			</div>
		</div>
		{#if $noChartData}
			<About />
		{/if}
	</div>
</div>

<style scoped>
	.MainContainer {
		padding: 0 8px;
		min-height: 100vh;
		display: flex;
		justify-content: center;
	}

	.MainContainer_content {
		max-width: 100%;
	}

	.MainContainer_column {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: stretch;
		gap: 10px;
	}
	@media (min-width: 500px) {
		.MainContainer_column {
			padding-bottom: 16px;
			max-width: 900px;
			justify-content: space-between;
		}
	}
	.MainContainer_row {
		display: flex;
		flex-direction: row;
		gap: 8px;
		align-items: stretch;
	}
	.MainContainer_grow {
		flex-grow: 2;
	}
	.MainContainer_wrap {
		flex-wrap: wrap;
	}
	.MainContainer_space-around {
		justify-content: space-around;
	}
	.MainContainer_space-between {
		justify-content: space-between;
	}
	.MainContainer_sidebar {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		position: sticky;
		gap: 16px;
		top: 50px;
	}
	@media (max-width: 500px) {
		.MainContainer_mobile_invisible {
			display: none;
		}
		.MainContainer_mobile_column {
			flex-direction: column;
		}
		.MainContainer_mobile_column-reverse {
			flex-direction: column-reverse;
		}
	}
</style>
