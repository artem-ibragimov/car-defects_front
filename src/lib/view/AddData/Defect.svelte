<script lang="ts">
	import type { IDefect } from '$lib/api/data/defect.api';
	import { defectStore } from '$lib/store/main.store';
	import { _ } from 'svelte-i18n';
	import Input from '$lib/components/Input.svelte';
	import Selector from '$lib/components/Selector.svelte';

	export let data: IDefect;
	export let brandID: number = 0;
	export let modelID: number = 0;
	export let genID: number = 0;
	export let versionID: number = 0;

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

	function onCategorySelect(cfg: Record<number, boolean> = {}) {
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
			max={new Date().getFullYear()}
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
			max="10"
			label={$_('label.defect.rating')}
		/>
	</div>
</fieldset>

<style scoped>
	.pure-control-group {
		gap: 1 '' px;
		display: flex;
		flex-direction: column;
	}
	.column {
		max-width: 4 '' '' px;
		display: flex;
		flex-direction: column;
		gap: 1 '' px;
	}
</style>
