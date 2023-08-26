<script lang="ts">
	import { defectStore, localeStore } from '$lib/store/main.store';
	import { _ } from 'svelte-i18n';
	import Selector from '$lib/components/Selector.svelte';

	let { entities } = defectStore.filter.entityParams;
	let { selectedDetails, selectedDetailEntity, state } = defectStore;
	$: ({ loadingDetails } = $state);
	$: variants = Object.keys($entities).map((value) => ({
		value,
		selected: $selectedDetails[value]
	}));

	let { loadDetails, details } = defectStore;

	$: ({ selected } = localeStore);

	function onDetailsSelect({ detail }) {
		loadDetails(detail, $selected);
	}
</script>

<div class="DefectDetails">
	<div class="DefectDetails__bar DefectDetails__bottom-fixed">
		<Selector
			column
			{variants}
			on:select={onDetailsSelect}
			needApplyButton
			appendLabel={$_('label.load_details')}
		/>
	</div>
	<div class="DefectDetails__content" class:loadingDetails>
		{#if !!$selectedDetailEntity}
			{#each $details[$selectedDetailEntity] || [] as detail}
				<div class="DefectDetail">
					<div class="DefectDetails__space-between DefectDetails__bold">
						<span
							>{detail.country}
							{detail.brand}
							{detail.model}
							{detail.gen}
							{detail.version}
							{detail.year}</span
						>
						{#if detail.age !== '0'}
							<span>{$_('label.detail.age')}: {detail.age}</span>
						{/if}
						{#if detail.mileage !== '0'}
							<span>{$_('label.detail.mileage')}: {detail.mileage}</span>
						{/if}
					</div>
					<p>{detail.description}</p>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style scoped>
	.DefectDetails {
		display: flex;
		flex-direction: row;
		gap: 16px;
	}
	.DefectDetails__content {
		flex-grow: 5;
		justify-content: space-around;
		display: flex;
		flex-wrap: wrap;
		align-items: stretch;
		gap: 16px;
		row-gap: 16px;
		flex: 1;
		opacity: 1;
		transition: all;
	}
	.loadingDetails {
		opacity: 0.3;
	}

	.DefectDetails__bar {
		display: flex;
		justify-content: flex-end;
		background: #f4faff;
		position: sticky;
	}
	.DefectDetails__bottom-fixed {
		bottom: 0;
	}
	.DefectDetails__column-flex {
		display: flex;
	}
	.DefectDetails__gap {
		gap: 30px;
	}
	.DefectDetails__space-between {
		display: flex;
		justify-content: space-between;
	}
	.DefectDetails__bold {
		text-transform: capitalize;
		font-weight: 500;
	}

	.DefectDetail {
		padding: 16px;
		border: 1px solid #ccc;
		border-radius: 8px;
	}
</style>
