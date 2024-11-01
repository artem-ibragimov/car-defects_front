<script lang="ts">
	import Notification from '$lib/components/Notification.svelte';
	import { defectStore, searchStore } from '$lib/store/main.store';
	import type { LayoutData } from './$types';
	import '../app.css';
	import { isDebug } from '$lib/util/debug';

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
		setTimeout(() => {
			gtag('js', new Date());
			gtag('config', 'G-D3Z9TXBZ2M');
		}, 300);
	</script>
	{#if !isDebug()}
		<script type="text/javascript">
			(function (m, e, t, r, i, k, a) {
				m[i] =
					m[i] ||
					function () {
						(m[i].a = m[i].a || []).push(arguments);
					};
				m[i].l = 1 * new Date();
				for (var j = 0; j < document.scripts.length; j++) {
					if (document.scripts[j].src === r) {
						return;
					}
				}
				(k = e.createElement(t)),
					(a = e.getElementsByTagName(t)[0]),
					(k.async = 1),
					(k.src = r),
					a.parentNode.insertBefore(k, a);
			})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

			ym(89843612, 'init', {
				clickmap: true,
				trackLinks: true,
				accurateTrackBounce: true,
				webvisor: true,
				trackHash: true
			});
		</script>

		<noscript
			><div>
				<img
					src="https://mc.yandex.ru/watch/89843612"
					style="position:absolute; left:-9999px;"
					alt=""
				/>
			</div></noscript
		>
	{/if}
</svelte:head>

<div class="Layout bg-base-200">
	<Notification {warn} {error} request={lastRequest} />
	<slot />
</div>
