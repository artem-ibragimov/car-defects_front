<script lang="ts">
	import { appInit, defectStore } from '$lib/store/main.store';
	import About from '$lib/view/About.svelte';
	import AgeMileageRadio from '$lib/view/AgeMileageSelector.svelte';
	import ArticleLinks from '$lib/view/ArticleLinks.svelte';
	import Header from '$lib/view/Header.svelte';
	import Search from '$lib/view/Search.svelte';
	import TotalNormRadio from '$lib/view/TotalNormSelector.svelte';
	import DefectCategorySelector from '$lib/view/chart/DefectCategorySelector.svelte';
	import DefectsChart from '$lib/view/chart/DefectsChart.svelte';
	import EntitySelector from '$lib/view/chart/EntitySelector.svelte';
	import DefectDetails from './DefectDetails.svelte';

	$: ({ setDataParams } = defectStore.filter.dataParams);
	$: ({ noChartData } = defectStore);

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
	<div class="MainContainer_column">
		<Header />
		<div class="MainContainer_row MainContainer_wrap">
			<Search on:input={onSearch} />
		</div>
		<div class="MainContainer_row MainContainer_mobile_column-reverse">
			<div class="MainContainer_column">
				{#if !$noChartData}
					<div class="MainContainer_row MainContainer_space-between">
						<TotalNormRadio on:select={({ detail }) => setDataParams(detail)} />
						<AgeMileageRadio on:select={({ detail }) => setDataParams(detail)} />
						<!-- <LocaleSelector /> -->
					</div>
					<div class="MainContainer_grow">
						<DefectsChart displayLegend={false} />
					</div>
					<EntitySelector />
				{/if}
				{#if $noChartData}
					<div class="MainContainer_row MainContainer_space-around MainContainer_mobile_column">
						<ArticleLinks />
					</div>
				{/if}
				{#if $noChartData}
					<div class="MainContainer_row MainContainer_grow MainContainer_space-around">
						<iframe
							class="MainContainer__videoframe"
							width="560"
							height="315"
							src="https://www.youtube.com/embed/km0wsB0xBV4?controls=0"
							title="About Car-Defects Project"
							frameborder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowfullscreen
						/>
					</div>
				{/if}
				<DefectDetails />
			</div>
			{#if !$noChartData}
				<div class="MainContainer_sidebar">
					<DefectCategorySelector />
				</div>
			{/if}
		</div>

		<About />
		<!-- <Button variant="secondary" on:click={nav.displayAddDataForm}>{$_('label.add_data')}</Button> -->
	</div>
</div>

<style scoped>
	.MainContainer {
		height: 100%;
		display: flex;
		justify-content: center;
	}

	.MainContainer_column {
		max-width: 1280px;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: stretch;
		gap: 10px;
	}
	@media (min-width: 500px) {
	}
	.MainContainer_items-start {
		align-items: flex-start;
	}
	.MainContainer__videoframe {
		max-width: 100%;
		max-height: 100%;
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
	@media (max-width: 500px) {
		.MainContainer_mobile_column {
			flex-direction: column;
		}
		.MainContainer_mobile_column-reverse {
			flex-direction: column-reverse;
		}
	}
</style>
