<script lang="ts">
	import Notification from '$lib/components/Notification.svelte';
	import { defectStore, searchStore } from '$lib/store/main.store';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	$: ({ state: defectState } = defectStore);
	$: ({ warn: defectWarn, error: defectError, lastRequest: defectLastRequest } = $defectState);

	$: ({ state: searchState } = searchStore);
	$: ({ warn: searchWarn, error: searchError, lastRequest: searchLastRequest } = $searchState);
	// TODO вынести в notification store
	let warn: string, error: Error | null, lastRequest: string;
	$: {
		warn = '';
		error = null;
		lastRequest = '';
		if (searchWarn || searchError) {
			warn = searchWarn;
			error = searchError;
			lastRequest = searchLastRequest;
		}
		if (defectError || defectWarn) {
			warn = defectWarn;
			error = defectError;
			lastRequest = defectLastRequest;
		}
	}
</script>

<svelte:head>
	<link rel="canonical" href={data.url.toString()} />
	<meta property="twitter:url" content={data.url.toString()} />

	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());

		gtag('config', 'G-D3Z9TXBZ2M');
	</script>
</svelte:head>

<Notification {warn} {error} request={lastRequest} />
<slot />
