<script lang="ts">
	import { localeStore } from '$lib/store/main.store';
	import { ROUTE_NAMES } from '$lib/store/route.store';
	import { _ } from 'svelte-i18n';

	$: ({ selected } = localeStore);
	const pagePath = typeof location !== 'undefined' ? location.pathname : '';

	$: articles = Object.entries(ROUTE_NAMES.ARTICLE);
	$: if (pagePath) {
		articles = articles.filter(([_, path]) => !pagePath.includes(path));
	}
</script>

<div class="ArticleLinks">
	{#each articles as [name, path]}
		<a href={`/${$selected}${path}`} target="_blank">{$_(`text.article.${name}.title`)}</a>
	{/each}
</div>

<style scoped>
	.ArticleLinks {
		flex:1;
		display: flex;
		flex-wrap: wrap;
		gap:8px;
		padding: 16px 0;
		justify-content: space-between;
	}
</style>
