<script lang="ts">
	import Selector from '$lib/components/Selector.svelte';
	import { defectStore } from '$lib/store/main.store';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { get_random_male_name } from '$lib/util/data';

	export let pageUrl: string;

	let { entities } = defectStore.filter.entityParams;
	let { selectedDetails, selectedDetailEntityName, state } = defectStore;
	$: ({ loadingDetails } = $state);
	$: variants = Object.keys($entities).map((value) => ({
		value,
		selected: $selectedDetails[value]
	}));

	let { selectDetails, details } = defectStore;

	onMount(() => {
		if (variants.length >= 1 && !$selectedDetailEntityName) {
			selectDetails({ [variants[0].value]: true });
		}
	});

	function onDetailsSelect({ detail }: CustomEvent<Record<string, boolean>>) {
		selectDetails(detail);
	}

	const today = new Date();
	$: comment = ($details[$selectedDetailEntityName as string] || [])
		.filter(Boolean)
		.map((detail, i) => ({
			'@type': 'Comment',
			url: pageUrl,
			author: {
				'@type': 'Person',
				givenName: get_random_male_name(),
				url: pageUrl
			},
			datePublished: new Date(
				Date.UTC(today.getFullYear(), today.getMonth(), Math.round(Math.random() * 29) + 1)
			).toISOString(),
			text: `${detail.country} ${detail.brand} ${detail.model} ${detail.gen} ${detail.year} [${$_(
				`defect_category.${detail.category}`
			)}]\n
		${detail.description}`
		}));

	$: schema =
		$selectedDetailEntityName &&
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'DiscussionForumPosting',
			headline: `${$selectedDetailEntityName} Problems on Car-Defects.com`,
			author: {
				'@type': 'Person',
				name: 'Car-Defects.com'
			},
			text: `Find the most common issues based on ${$selectedDetailEntityName} owner complaints`,
			datePublished: new Date().toISOString(),
			comment
		});
</script>

<svelte:head>
	{#if $selectedDetailEntityName}
		{@html `<script type="application/ld+json"> ${schema} </script>`}
	{/if}
</svelte:head>

<div class="DefectDetails">
	<div class="DefectDetails__content" class:loadingDetails>
		{#if !!$selectedDetailEntityName}
			{#each $details[$selectedDetailEntityName] || [] as detail}
				{#if detail}
					<div class=" w-full shadow-md">
						<div class="card-body">
							<h2 class="card-title">
								{detail.country}
								{detail.brand}
								{detail.model}
								{detail.gen}
								{detail.version}
								{detail.year}
								[{$_(`defect_category.${detail.category}`)}]
								{#if detail.age !== '0'}
									{$_('label.detail.age')}: {detail.age}
								{/if}
								{#if detail.mileage !== '0'}
									{$_('label.detail.mileage')}: {detail.mileage}
								{/if}
							</h2>
							<p>{detail.description}</p>
						</div>
					</div>
				{/if}
			{/each}
		{/if}
	</div>
	<div
		class="DefectDetails__bar bg-base-200"
		class:DefectDetails__bar-sticky={!!$selectedDetailEntityName}
	>
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
		flex-direction: column-reverse;
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
		min-width: 0;
		row-gap: 24px;
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
		top: 74px;
	}
	@media (min-width: 500px) {
		.DefectDetails__bar-sticky {
			top: 50px;
		}
	}
</style>
