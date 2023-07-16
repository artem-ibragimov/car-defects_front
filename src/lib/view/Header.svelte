<script lang="ts">
	import { _ } from 'svelte-i18n';
</script>

<div class="Header" on:click={() => window.location.replace('/')}>
	<img src="/assets/logo.webp" alt="logo" width="100" />
	<h1>
		{$_('label.main_header')}
	</h1>
</div>

<style scoped>
	.Header {
		cursor: pointer;
		padding-top: 60px;
		padding-bottom: 20px;
		gap: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.Header h1 {
		font-size: 35px;
		text-align: center;
		padding: 10px 10px;
		font-weight: 300;
	}

	@media (max-width: 500px) {
		.Header {
			padding: 0 15px;
			gap: 0;
		}
		.Header img {
			width: 75px;
		}
		.Header h1 {
			font-size: 25px;
			text-align: center;
			padding: 5px;
		}
	}
</style>
