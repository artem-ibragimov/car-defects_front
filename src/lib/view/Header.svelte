<script lang="ts">
	import { ROUTE_NAMES } from '$lib/store/route.store';
	import { _ } from 'svelte-i18n';
	import Logo from './Logo.svelte';
</script>

<header class="Header bg-base-200" on:click={() => window.location.assign(ROUTE_NAMES.MAIN)}>
	<Logo />
	<h1>
		{$_('label.main_header')}
	</h1>
</header>

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
			position: sticky;
			top: 0;
			padding: 0 15px;
			/* gap: 0; */
		}
		.Header img {
			/* width: 35px; */
		}
		.Header h1 {
			font-size: 22px;
			text-align: center;
			padding: 4px;
		}
	}
</style>
