<script lang="ts">
	import { defectStore, localeStore } from '$lib/store/main.store';
	import { ROUTE_NAMES } from '$lib/store/route.store';
	import { _ } from 'svelte-i18n';
	import About from './About.svelte';
	import AgeMileageRadio from './AgeMileageSelector.svelte';
	import Header from './Header.svelte';
	import Search from './Search.svelte';
	import TotalNormRadio from './TotalNormSelector.svelte';
	import DefectCategorySelector from './chart/DefectCategorySelector.svelte';
	import DefectsChart from './chart/DefectsChart.svelte';
	import EntitySelector from './chart/EntitySelector.svelte';
	import ArticleLinks from './ArticleLinks.svelte';

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
	<div class="MainContainer_column">
		<Header />
		<div class="MainContainer_row MainContainer_wrap">
			<Search on:input={onSearch} />
		</div>

		<div class="MainContainer_row MainContainer_space-between">
			<TotalNormRadio on:select={({ detail }) => setDataParams(detail)} />
			<AgeMileageRadio on:select={({ detail }) => setDataParams(detail)} />
			<!-- <LocaleSelector /> -->
		</div>
		<div class="MainContainer_row MainContainer_space-around MainContainer_mobile_column">
			<EntitySelector />
			<DefectsChart displayLegend={false} />
			<DefectCategorySelector />
		</div>
		<div class="MainContainer_row MainContainer_space-around MainContainer_mobile_column">
			<ArticleLinks />
		</div>
		<!-- <div class="MainContainer_row ">
            <DefectDetails />
        </div> -->
		<div class="MainContainer_column MainContainer_items-start MainContainer_space-between">
			<About />
			<!-- <Button variant="secondary" on:click={nav.displayAddDataForm}>{$_('label.add_data')}</Button> -->
		</div>
	</div>
</div>

<style scoped>
	.MainContainer {
	}

	.MainContainer_column {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: stretch;
		margin: auto;
		padding: 0 10px;
		gap: 10px;
	}
	@media (min-width: 500px) {
		.MainContainer_column {
			padding: 0 30px;
		}
	}
	.MainContainer_items-start {
		align-items: flex-start;
	}
	.MainContainer_row {
		display: flex;
		flex-direction: row;
		gap: 8px;
		align-items: stretch;
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
	@media (max-width: 700px) {
		.MainContainer_mobile_column {
			flex-direction: column;
		}
	}
</style>
