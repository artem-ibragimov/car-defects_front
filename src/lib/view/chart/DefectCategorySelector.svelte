<script lang="ts">
	import { defectStore } from '$lib/store/main.store';
	import Selector from '$lib/components/Selector.svelte';

	$: ({ categories, setCategories } = defectStore.filter.categoryParams);
	$: variants = $categories.map((c) => ({ ...c, label: `defect_category.${c.label}` }));
</script>

<div class="DefectCategorySelector">
	<Selector
		column
		multiselect
		{variants}
		on:select={({ detail }) => setCategories(detail)}
		needApplyButton
	/>
</div>

<style scoped>
	.DefectCategorySelector {
		position: sticky;
		top: 50px;
	}
</style>
