<script lang="ts">
	import { localeStore } from '$lib/store/main.store';
	import { ROUTE_NAMES } from '$lib/store/route.store';
	import { _ } from 'svelte-i18n';
	$: ({ selected } = localeStore);

	$: articles = Object.entries(ROUTE_NAMES.ARTICLE);
</script>

{#each articles as [name, path]}
	<a href={`${$selected}${path}`} target="_blank">{$_(`text.article.${name}.title`)}</a>
{/each}

<style scoped>
</style>
