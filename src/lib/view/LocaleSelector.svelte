<script lang="ts">
	import { localeStore } from '$lib/store/main.store';
	import Selector from '$lib/components/Selector.svelte';

	$: ({ locales, ssr: select } = localeStore);
</script>

<Selector
	variants={$locales}
	on:select={({ detail }) => {
		select(Object.entries(detail).find(([_, selected]) => selected)[0]);
	}}
/>
