<script lang="ts">
	import { _ } from 'svelte-i18n';

	export let title: string;
	export let src: string;
	export let lg: boolean;
</script>

<iframe {title} {src} class="ChartFrame" class:lg />

<style scoped>
	.ChartFrame {
		flex: 1;
		flex-basis: none;
		max-width: none;
		display: block;
		min-height: 500px;
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
