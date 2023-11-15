<script lang="ts">
	import Article from '$lib/article/Article.svelte';
	import { _ } from 'svelte-i18n';

	import { ARTICLES, AVAILABLE_LOCALES } from '$lib/i18n';
	import { localeStore } from '$lib/store/main.store';
	import { ROUTE_NAMES } from '$lib/store/route.store';
	import type { EntryGenerator, PageData } from './$types';

	export let data: PageData;
	localeStore.select(data.locale);

	export const entries: EntryGenerator = () =>
		AVAILABLE_LOCALES.map((locale) =>
			ARTICLES.map((article_name) => ({ locale, article_name }))
		).reduce((acc, cur) => acc.concat(cur));

	const i18nPath = `text.article.${data.article_name}`;
	const name = <keyof typeof ROUTE_NAMES.ARTICLE>data.article_name;
	$: title = $_(`${i18nPath}.title`);
</script>

<Article {title} {name} content={$_(`${i18nPath}.text`)} {i18nPath} />
