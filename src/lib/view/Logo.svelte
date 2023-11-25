<script lang="ts">
	const widths = [320, 480, 640, 720, 1280, 1600];
	$: srcset = widths.map((w) => `/assets/img/logo--${w}.webp ${w}w`).join(', ');
</script>

<div class="Logo" on:click>
	<img src="/assets/img/logo.webp" alt="logo" width="50" height="50" {srcset} sizes="50px" />
</div>

<style scoped>
	.Logo {
		display: flex;
		justify-content: center;
		cursor: pointer;
	}
</style>
