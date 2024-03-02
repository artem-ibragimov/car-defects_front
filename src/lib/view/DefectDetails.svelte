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

	let { loadSelectedEntityDetails: loadDetails, details } = defectStore;

	$: variants.length >= 1 && !$selectedDetailEntity && loadDetails({ [variants[0].value]: true });

	function onDetailsSelect({ detail }: Record<string, boolean>) {
		loadDetails(detail);
	}
</script>

<div class="DefectDetails">
	<div class="DefectDetails__content" class:loadingDetails>
		{#if !!$selectedDetailEntity}
			{#each $details[$selectedDetailEntity] || [] as detail}
				{#if detail}
					<div class="card w-full bg-base-100 shadow-xl">
						<div class="card-body">
							<h2 class="card-title">
								{detail.country}
								{detail.brand}
								{detail.model}
								{detail.gen}
								{detail.version}
								{detail.year}
								{#if detail.age !== '0'}
									{$_('label.detail.age')}: {detail.age}
								{/if}
								{#if detail.mileage !== '0'}
									{$_('label.detail.mileage')}: {detail.mileage}
								{/if}

								{$_(`defect_category.${detail.category}`)}
							</h2>
							<p>{detail.description}</p>
						</div>
					</div>
				{/if}
			{/each}
		{/if}
	</div>
	<div class="DefectDetails__bar" class:DefectDetails__bar-sticky={!!$selectedDetailEntity}>
		<Selector
			column
			{variants}
			on:select={onDetailsSelect}
			needApplyButton
			applyButtonLabel={$_('label.load_details')}
		/>
	</div>
</div>

<style scoped>
	.DefectDetails {
		width: 100%;
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
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
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
</style>
