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
	.stretch_desktop {
		width: 100%;
	}
</style>
