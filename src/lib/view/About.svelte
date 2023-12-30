<script lang="ts">
	import Content from '$lib/article/Content.svelte';
	import { _ } from 'svelte-i18n';
</script>

<div class="About">
	<h2>{$_('text.about.header')}</h2>
	<Content data={$_('text.about.text')} />
</div>

<style scoped>
	.About {
		padding: 15px;
	}
</style>
