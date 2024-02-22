<script lang="ts">
	import { PUBLIC_ORIGIN } from '$env/static/public';
</script>

<div class="Logo" on:click>
	<a href={PUBLIC_ORIGIN}>
		<img src="/assets/img/logo.png" alt="logo" width="50" height="50" />
	</a>
</div>

<style scoped>
	.Logo {
		display: flex;
		justify-content: center;
		cursor: pointer;
	}
</style>
