<script lang="ts">
	import { _ } from 'svelte-i18n';

	export let title: string;
	export let src: string;
	export let lg: boolean;
</script>

<iframe {title} {src} class="ChartFrame" class:lg />

<style scoped>
	.ChartFrame {
		display: block;
		height: 400px;
		border: none;
	}

	@media (min-width: 500px) {
		.ChartFrame {
			min-height: 400px;
		}
	}
</style>
