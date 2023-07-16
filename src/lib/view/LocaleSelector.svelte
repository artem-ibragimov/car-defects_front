<script lang="ts">
	import { localeStore } from '$lib/store/main.store';

	import Selector from '../components/Selector.svelte';

	$: ({ locales, select } = localeStore);
</script>

<Selector
	variants={$locales}
	on:select={({ detail }) => {
		select(Object.entries(detail).find(([_, selected]) => selected)[0]);
	}}
/>
