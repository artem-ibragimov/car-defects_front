<script lang="ts">
	export let disabled = false;
	export let outline = false;
	export let stretch_desktop = false;
	export let href: string = '';
	export let variant: 'primary' | 'neutral' | 'link' | 'accent' | 'ghost' | 'secondary' = 'neutral';
</script>

<button
	{disabled}
	class={`btn btn-${variant} `}
	class:btn-outline={outline}
	class:stretch_desktop
	on:click
>
	{#if href}
		<a {href} target="_blank"><slot /> </a>
	{/if}
	{#if !href}
		<slot />
	{/if}
</button>

<style scoped>
	a:hover {
		text-decoration: none;
	}
	a:visited {
		color: inherit;
	}
	.pure-button {
		border-radius: 2px;
		padding: 0.4em 2em;
		white-space: break-spaces;
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
