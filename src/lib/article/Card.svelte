<script lang="ts">
	export let title: string = '';
	export let imgSrc: string = '';
</script>

<div class="Card">
	<img class="Card__banner" src={`/assets/img/${imgSrc}.webp`} alt={title} />
	<div class="Card__content">
		<h2>{title}</h2>
		<p>
			<slot />
		</p>
	</div>
</div>

<style scoped>
	.Card {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		flex: 1;
		flex-basis: 400px;
		min-width: 400px;
		border-radius: 8px;
		box-shadow: none;
		border: 1px solid #ccc;
		transition: all 0.4s ease-in-out;
	}
	.Card:has(:hover, :focus) {
		box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
	}

	.Card__banner {
		width: 100%;
	}

	.Card__content {
		padding: 16px;
	}
</style>
