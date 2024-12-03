<script lang="ts">
	import { defectStore } from '$lib/store/main.store';
	import { _ } from 'svelte-i18n';

	export let pageUrl: string;

	let { selectedDetailEntityName } = defectStore;

	$: ({ categories } = defectStore.filter.categoryParams);
	$: selected = $categories.find((c) => c.selected)?.label || '';
	$: url = pageUrl.slice(0, pageUrl.lastIndexOf(selected));

	$: variants = $categories
		.filter((c) => !c.selected)
		.map((c) => ({
			...c,
			href: `${url}${c.label}`,
			text: `${$selectedDetailEntityName} ${$_(`defect_category.${c.label}`)}`
		}));

	$: itemListElement = variants.map((v, i) => ({
		'@type': 'ListItem',
		position: i + 1,
		name: v.text,
		item: v.href
	}));

	$: schema = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement
	});
</script>

<svelte:head>
	{#if $selectedDetailEntityName && itemListElement.length !== 0}
		{@html `<script type="application/ld+json"> ${schema} </script>`}
	{/if}
</svelte:head>

{#if $selectedDetailEntityName}
	<div class="DefectCategoryLinks text-sm breadcrumbs flex-wrap">
		<ul>
			{#each variants as v}
				<li>
					<a href={v.href} target="_self">{v.text} </a>
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style scoped>
	.DefectCategoryLinks {
		text-transform: capitalize;
	}
</style>
