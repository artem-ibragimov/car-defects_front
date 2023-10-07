<script lang="ts">
	import { _ } from 'svelte-i18n';

	export let warn: string = '';
	export let request: string = '';
	export let error: Error | null = null;
</script>

{#if error || warn}
	<div class="Notification" class:warn={!!warn} class:error={!!error}>
		{$_((error && error.message) || warn)}: <span>{request}</span>
	</div>
{/if}

<style scoped>
	.Notification {
		z-index: 99999;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		text-align: center;
		padding: 10px;
		font-weight: 500;
		transition: all;
	}
	.warn {
		color: #815102;
		background-color: #ffeab5;
	}
	.error {
		color: #ffefe5;
		background-color: #d3652e;
	}
</style>
