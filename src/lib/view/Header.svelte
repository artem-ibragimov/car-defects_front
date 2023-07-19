<script lang="ts">
	import { ROUTE_NAMES } from '$lib/store/route.store';
	import { _ } from 'svelte-i18n';
	import Main from './Main.svelte';
</script>

<div class="Header" on:click={() => window.location.assign(ROUTE_NAMES.MAIN)}>
	<img src="/assets/logo.webp" alt="logo" width="50" height="50"/>
	<h1>
		{$_('label.main_header')}
	</h1>
</div>

<style scoped>
	.Header {
		cursor: pointer;
		/* padding-top: 30px;
		padding-bottom: 20px; */
		gap: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.Header h1 {
		font-size: 35px;
		text-align: center;
		padding: 10px 10px;
		font-weight: 550;
	}

	@media (max-width: 500px) {
		.Header {
			padding: 0 15px;
			/* gap: 0; */
		}
		.Header img {
			/* width: 35px; */
		}
		.Header h1 {
			font-size: 25px;
			text-align: center;
			padding: 5px;
		}
	}
</style>
