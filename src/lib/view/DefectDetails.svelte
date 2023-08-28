<script lang="ts">
	import Selector from '$lib/components/Selector.svelte';
	import { defectStore } from '$lib/store/main.store';
	import { _ } from 'svelte-i18n';

	let { entities } = defectStore.filter.entityParams;
	let { selectedDetails, selectedDetailEntity, state } = defectStore;
	$: ({ loadingDetails } = $state);
	$: variants = Object.keys($entities).map((value) => ({
		value,
		selected: $selectedDetails[value]
	}));

	let { loadDetails, details } = defectStore;

	function onDetailsSelect({ detail }) {
		loadDetails(detail);
	}
</script>

<div class="DefectDetails">
	<div class="DefectDetails__content" class:loadingDetails>
		{#if !!$selectedDetailEntity}
			{#each $details[$selectedDetailEntity] || [] as detail}
				<div class="DefectDetail">
					<div class="DefectDetails__space-between DefectDetails__bold">
						<span>
							{detail.country}
							{detail.brand}
							{detail.model}
							{detail.gen}
							{detail.version}
							{detail.year}
						</span>

						<span>
							{#if detail.age !== '0'}
								{$_('label.detail.age')}: {detail.age}
							{/if}
							{#if detail.mileage !== '0'}
								{$_('label.detail.mileage')}: {detail.mileage}
							{/if}
						</span>

						<span>{$_(`defect_category.${detail.category}`)}</span>
					</div>
					<p>{detail.description}</p>
				</div>
			{/each}
		{/if}
	</div>
	<div class="DefectDetails__bar" class:DefectDetails__bar-sticky={!!$selectedDetailEntity}>
		<Selector
			column={!!$selectedDetailEntity}
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
		flex-direction: column;
		gap: 16px;
	}
	@media (min-width: 500px) {
		.DefectDetails {
			align-items: flex-start;
			flex-direction: row;
		}
	}
	.DefectDetails__content {
		flex-grow: 5;
		justify-content: space-around;
		display: flex;
		flex-wrap: wrap;
		align-items: stretch;
		gap: 16px;
		row-gap: 16px;
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
	}
	.DefectDetails__bar-sticky {
		position: sticky;
		top: 0;
	}
	@media (min-width: 500px) {
		.DefectDetails__bar-sticky {
			top: 50px;
		}
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
