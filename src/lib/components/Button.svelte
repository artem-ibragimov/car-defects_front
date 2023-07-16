<script lang="ts">
	export let disabled = false;
	export let stretch_desktop = false;
	export let variant: 'primary' | 'default' | 'success' | 'error' | 'warning' | 'secondary' =
		'default';
</script>

<button {disabled} class={`pure-button pure-button-${variant}`} class:stretch_desktop on:click
	><slot /></button
>

<style scoped>
	.pure-button {
		border-radius: 2px;
		padding: 0.4em 2em;
	}

	.stretch_desktop {
		width: 100%;
	}
	@media (max-width: 500px) {
		.pure-button {
			/* width: 100%; */
		}
	}
	.pure-button-success {
		background: #d6eecb;
	}
	.pure-button-primary {
		color: #f4faff;
		background: #4dc9f6;
		font-weight: 500;
	}
</style>
