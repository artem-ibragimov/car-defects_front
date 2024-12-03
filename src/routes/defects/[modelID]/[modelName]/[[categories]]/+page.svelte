<script lang="ts">
	import Main from '$lib/view/Main.svelte';
	import { _ } from 'svelte-i18n';
	import type { PageData } from './$types';
	import { appCsr, defectStore } from '$lib/store/main.store';

	export let data: PageData;
	appCsr(data.states);
	const name = data.name[0].toUpperCase() + data.name.slice(1);
	$: ({ categories } = defectStore.filter.categoryParams);
	$: selected_category = $categories.find((c) => c.label == data.categories);
	$: selected_category_label = selected_category
		? $_(`defect_category.${selected_category.label}`)
		: '';

	$: title = `${name} ${selected_category_label} Problems on Car-Defects.com`;
	$: description = `Find the most common ${selected_category_label} issues based on ${name} owner complaints`;
	$: keywords = `${name.split(' ').join(',')},defects,reliability,statistics`;

	$: schema = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Car',
		name,
		url: data.url,
		brand: {
			'@type': 'Brand',
			name: name.split(' ')[0]
		},
		model: name.split(' ').slice(1).join(' ')
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="og:title" property="og:title" content={title} />
	<meta property="og:url" content={data.url.toString()} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta name="keywords" content={keywords} />
	{@html `<script type="application/ld+json"> ${schema} </script>`}
</svelte:head>

<Main pageUrl={`${data.url}`} />
