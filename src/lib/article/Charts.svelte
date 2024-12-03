<script lang="ts">
	import { ROUTE_NAMES } from '$lib/store/route.store';
	import { _ } from 'svelte-i18n';
	import ChartFrame from './ChartFrame.svelte';

	export let title: string;
	export let url: string;
	export let lg = false;

	const src = `${ROUTE_NAMES.CHART_ONLY}${url}`;
</script>

{#if url}
	<ChartFrame {title} {lg} {src} />
	<a href={`/${url}`} target="_blank">{'More'}</a>
{/if}
