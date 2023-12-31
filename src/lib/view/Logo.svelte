<script lang="ts">
	import { PUBLIC_ORIGIN } from '$env/static/public';

	const widths = [320, 640, 1280];
	$: srcset = widths.map((w) => `/assets/img/logo--${w}.webp ${w}w`).join(', ');
</script>

<div class="Logo" on:click>
	<a href={PUBLIC_ORIGIN}>
		<img src="/assets/img/logo.webp" alt="logo" width="50" height="50" {srcset} sizes="50px" />
	</a>
</div>

<style scoped>
	.Logo {
		display: flex;
		justify-content: center;
		cursor: pointer;
	}
</style>
