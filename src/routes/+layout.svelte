<script lang="ts">
	import Notification from '$lib/components/Notification.svelte';
	import { defectStore } from '$lib/store/main.store';

	$: ({ state } = defectStore);
	$: ({ warn, error, lastRequest } = $state);
</script>

<Notification {warn} {error} request={lastRequest} />
<slot />
