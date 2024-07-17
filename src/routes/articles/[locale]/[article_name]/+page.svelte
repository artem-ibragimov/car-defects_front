<script lang="ts">
	import Article from '$lib/article/Article.svelte';

	import { appCsr } from '$lib/store/main.store';
	import type { PageData } from './$types';

	export let data: PageData;

	// export const entries: EntryGenerator = () =>
	// 	AVAILABLE_LOCALES.map((locale) =>
	// 		ARTICLES.map((article_name) => ({ locale, article_name }))
	// 	).reduce((acc, cur) => acc.concat(cur));

	appCsr(data.states);
</script>

<Article article_name={data.article_name} locale={data.locale} />
