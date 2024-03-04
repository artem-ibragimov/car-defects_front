<script lang="ts">
	import Content from '$lib/article/Content.svelte';
	import { _ } from 'svelte-i18n';
</script>

<aside class="card w-full">
	<div class="card-body">
		<h2 class="card-title">{$_('text.about.header')}</h2>
		<Content data={$_('text.about.text')} />
	</div>
</aside>
