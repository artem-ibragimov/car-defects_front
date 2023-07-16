<script>
	import { _ } from 'svelte-i18n';

	export let title;
	export let src;
	export let lg;
</script>

<iframe
	{title}
	{src}
	class="ChartFrame"
	class:lg
	on:click={() => {
		debugger;
	}}
/>

<style scoped>
	.ChartFrame {
		flex: 1;
		flex-basis: none;
		max-width: none;
		display: block;
		min-height: 270px;
		border: none;
	}

	@media (min-width: 500px) {
		.ChartFrame {
			flex-basis: 470px;
			max-width: 450px;
		}
	}
	.lg {
		flex-basis: none;
		max-width: 900px;
	}
</style>
