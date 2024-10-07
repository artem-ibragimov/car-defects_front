<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { defectStore } from '$lib/store/main.store';
	import { ROUTE_NAMES } from '$lib/store/route.store';
	import About from '$lib/view/About.svelte';
	import AgeMileageRadio from '$lib/view/AgeMileageSelector.svelte';
	import Header from '$lib/view/Header.svelte';
	import Search from '$lib/view/Search.svelte';
	import TotalNormRadio from '$lib/view/TotalNormSelector.svelte';
	import DefectCategorySelector from '$lib/view/chart/DefectCategorySelector.svelte';
	import DefectsChart from '$lib/view/chart/DefectsChart.svelte';
	import EntitySelector from '$lib/view/chart/EntitySelector.svelte';
	import { _ } from 'svelte-i18n';
	import DefectCategoryLinks from './DefectCategoryLinks.svelte';
	import DefectDetails from './DefectDetails.svelte';
	import TopReliableModels from './TopReliableModels.svelte';
	import Trailer from './Trailer.svelte';
	import ArticleLinks from './ArticleLinks.svelte';

	export let noChartData = false;
	export let pageUrl: string;

	$: ({ setDataParams } = defectStore.filter.dataParams);

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
				<DefectCategoryLinks {pageUrl} />
				{#if !noChartData}
					<div
						class="MainContainer_row MainContainer_space-between"
						class:MainContainer_mobile_invisible={noChartData}
					>
						<TotalNormRadio on:select={({ detail }) => setDataParams(detail)} />
						<AgeMileageRadio on:select={({ detail }) => setDataParams(detail)} />
						<!-- <LocaleSelector /> -->
					</div>
				{/if}
				<div class="MainContainer_grow">
					{#if !noChartData}
						<DefectsChart displayLegend={false} />
					{/if}
					{#if noChartData}
						<div class="MainContainer_row MainContainer_grow MainContainer_space-between">
							<TopReliableModels />
							<div class="divider divider-horizontal"></div>
							<Trailer />
						</div>
					{/if}
				</div>
				{#if !noChartData}
					<EntitySelector />
					<Button outline href={ROUTE_NAMES.ADD_DATA}>{$_('label.add_data')}</Button>
					<div
						class="MainContainer_row MainContainer_mobile_column"
						class:MainContainer_mobile_invisible={noChartData}
					>
						<DefectDetails {pageUrl} />
					</div>
				{/if}
			</div>
			{#if !noChartData}
				<div>
					<div
						class="MainContainer_sidebar MainContainer_mobile_column-reverse"
						class:MainContainer_mobile_invisible={noChartData}
					>
						<DefectCategorySelector />
					</div>
				</div>
			{/if}
		</div>
		<ArticleLinks random />
		{#if noChartData}
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
	@media (min-width: 700px) {
		.MainContainer_column {
			padding-bottom: 16px;
			max-width: 900px;
			justify-content: space-between;
		}
	}
	.MainContainer_row {
		display: flex;
		flex-direction: column-reverse;
		gap: 8px;
		align-items: stretch;
	}
	@media (min-width: 700px) {
		.MainContainer_row {
			flex-direction: row;
		}
	}

	.MainContainer_grow {
		flex-grow: 2;
	}
	.MainContainer_wrap {
		flex-wrap: wrap;
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
	@media (max-width: 700px) {
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
