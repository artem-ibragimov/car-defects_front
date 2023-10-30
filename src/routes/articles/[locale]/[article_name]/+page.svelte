<script lang="ts">
	import Article from '$lib/article/Article.svelte';
	import Charts from '$lib/article/Charts.svelte';
	import { _ } from 'svelte-i18n';

	import type { PageData, EntryGenerator } from './$types';
	import Cards from '$lib/article/Cards.svelte';
	import { localeStore } from '$lib/store/main.store';
	import { ARTICLES, AVAILABLE_LOCALES } from '$lib/i18n';

	export let data: PageData;
	localeStore.select(data.locale);

	export const entries: EntryGenerator = () =>
		AVAILABLE_LOCALES.map((locale) =>
			ARTICLES.map((article_name) => ({ locale, article_name }))
		).reduce((acc, cur) => acc.concat(cur));

	const i18nPath = `text.article.${data.article_name}`;
	$: title = $_(`${i18nPath}.title`);
	$: cards = JSON.parse($_(`${i18nPath}.cards`));
	$: entity_params = $_(`${i18nPath}.entity_params`);
</script>

<Article {title}>
	<Cards {cards} />
	<Charts lg {title} {entity_params} />
</Article>
