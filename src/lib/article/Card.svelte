<script lang="ts">
	export let title: string = '';
	export let text: string = '';
	export let imgSrc: string = '';
	export let href: string | undefined;
</script>

<div class="Card" class:Card__text={!!text}>
	<a class="Card__a" {href} target="_blank">
		<img class="Card__banner" src={`/assets/img/${imgSrc}.webp`} alt={title} />
		<div class="Card__content">
			<h4>{title}</h4>
			{#if text}
				<p>{text}</p>
			{/if}
		</div>
	</a>
</div>

<style scoped>
	.Card {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		flex: 1 1 30%;
		min-width: 200px;
		max-width: 450px;
		border-radius: 8px;
		box-shadow: none;
		border: 1px solid #ccc;
		transition: all 0.4s ease-in-out;
	}
	.Card__text {
		flex: 1 1 45%;
	}
	.Card:has(:hover, :focus) {
		box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
	}

	.Card__a {
		text-decoration: none;
		color: inherit;
	}
	.Card__banner {
		width: 100%;
	}

	.Card__content {
		padding: 16px;
	}
</style>
