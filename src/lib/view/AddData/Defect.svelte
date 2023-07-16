<script lang="ts">
	import type { IDefect } from '$lib/api/data/defect.api';
	import Selector from '../../components/Selector.svelte';
	import { defectStore } from '$lib/store/main.store';
	import { _ } from 'svelte-i18n';
	import Input from '../../components/Input.svelte';

	export let data: IDefect;
	export let brandID: string = 0;
	export let modelID: string = 0;
	export let genID: string = 0;
	export let versionID: string = 0;

	$: brandID && (data.BrandID = brandID);
	$: modelID && (data.ModelID = modelID);
	$: genID && (data.GenID = genID);
	$: versionID && (data.VersionID = versionID);
	$: disabled = !modelID;
	$: ({ categories } = defectStore.filter.categoryParams);
	$: variants = $categories.map((c) => ({
		...c,
		label: `defect_category.${c.label}`,
		selected: false
	}));

	function onCategorySelect(cfg: Record<string, boolean> = {}) {
		data.CategoryID = Number(Object.entries(cfg).find(([_, selected]) => selected)[0]);
	}
</script>

<fieldset class="column pure-form-aligned">
	<legend>{$_('label.defect.header')}</legend>
	<Selector
		{disabled}
		{variants}
		on:select={({ detail }) => {
			onCategorySelect(detail);
		}}
	/>
	<textarea
		disabled={disabled || !data.CategoryID}
		bind:value={data.Desc}
		placeholder={$_('label.defect.description')}
	/>
	<div class="pure-control-group">
		<Input
			disabled={disabled || !data.Desc}
			type="number"
			bind:value={data.Age}
			label={$_('label.defect.age')}
		/>
		<Input
			disabled={disabled || !data.Desc}
			type="number"
			bind:value={data.Year}
			label={$_('label.defect.year')}
		/>
		<Input
			disabled={disabled || !data.Desc}
			type="number"
			bind:value={data.Mileage}
			label={$_('label.defect.mileage')}
		/>
		<Input
			disabled={disabled || !data.Desc}
			type="number"
			bind:value={data.Cost}
			label={$_('label.defect.cost')}
		/>
		<Input
			disabled={disabled || !data.Desc}
			type="number"
			bind:value={data.Rating}
			label={$_('label.defect.rating')}
		/>
	</div>
</fieldset>

<style scoped>
	.pure-control-group {
		gap: 10px;
		display: flex;
		flex-direction: column;
	}
	.column {
		max-width: 400px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
