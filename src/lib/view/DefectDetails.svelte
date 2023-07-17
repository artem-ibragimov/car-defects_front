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

<div class="DefectDetails DefectDetails__column">
	<div class="DefectDetails__column-flex DefectDetails__gap" class:loadingDetails>
		{#if !!$selectedDetailEntity}
			{#each $details[$selectedDetailEntity] || [] as detail}
				<div class="DefectDetail">
					<div class="DefectDetails__space-between DefectDetails__bold">
						<span>{detail.brand} {detail.model} {detail.gen} {detail.version}</span>
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
	<div class="DefectDetails__bar DefectDetails__bottom-fixed">
		<Selector
			{variants}
			on:select={onDetailsSelect}
			needApplyButton
			appendLabel={$_('label.load_details')}
		/>
	</div>
</div>

<style scoped>
	.DefectDetails {
		display: flex;
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
		flex-direction: column;
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
	.DefectDetails__column {
		flex-direction: column;
		flex: 1;
	}

	.DefectDetail {
		padding: 10px;
		border: 2px solid #ccc;
	}
</style>
