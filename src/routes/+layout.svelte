<script lang="ts">
	import Notification from '$lib/components/Notification.svelte';
	import { defectStore, searchStore } from '$lib/store/main.store';

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
	const title = 'Car-Defects - A Car Service Calls Statistics';
	const description =
		'Car-Defects.com - A Car Service Calls Statistics: Statistics of Defects by Age and Car Mileage';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="og:title" property="og:title" content={title} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="/assets/img/car.png" />
</svelte:head>

<Notification {warn} {error} request={lastRequest} />
<slot />
