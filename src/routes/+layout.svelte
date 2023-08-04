<script lang="ts">
	import Notification from '$lib/components/Notification.svelte';
	import { defectStore } from '$lib/store/main.store';

	$: ({ state } = defectStore);
	$: ({ warn, error, lastRequest } = $state);

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
	<meta property="og:image" content="/assets/logo.webp" />
</svelte:head>

<Notification {warn} {error} request={lastRequest} />
<slot />
