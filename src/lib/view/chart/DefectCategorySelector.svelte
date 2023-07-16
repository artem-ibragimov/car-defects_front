<script lang="ts">
	import { defectStore } from '$lib/store/main.store';
	import Selector from '../../components/Selector.svelte';

	$: ({ categories, setCategories } = defectStore.filter.categoryParams);
	$: variants = $categories.map((c) => ({ ...c, label: `defect_category.${c.label}` }));
</script>

<Selector
	column
	multiselect
	{variants}
	on:select={({ detail }) => setCategories(detail)}
	needApplyButton
/>
