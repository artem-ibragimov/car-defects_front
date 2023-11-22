<script lang="ts">
	export let title: string = '';
	export let text: string = '';
	export let imgSrc: string = '';
	export let href: string | undefined;
</script>

<div class="Card" class:Card__text={!!text} class:Card-href={href}>
	<a class="Card__a" {href}>
		<amp-img class="Card__banner" src={`/assets/img/${imgSrc}.webp`} width="400" height="220" layout="fixed" alt={title} {title}  />
		<div class="Card__content">
			<h4 class="Card__title">{title}</h4>
			{#if text}
				<span> {text}</span>
			{/if}
		</div>
	</a>
</div>

<style scoped>
	.Card {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		min-width: 200px;
		max-width: 400px;
		border-radius: 8px;
		box-shadow: rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
		/* border: 1px solid black; */
		transition: all 0.4s ease-in-out;
	}
	@media screen and (min-width: 500px) {
		.Card {
			flex: 1 400px;
		}
	}
	.Card-href {
		cursor: pointer;
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
		display: flex;
		flex-direction: column;
	}
	.Card__banner {
		object-fit: cover;
		max-height: 220px;
		aspect-ratio: 1;
		min-width: 100%;
	}

	.Card__content {
		padding: 16px;
	}
	.Card__title {
		text-transform: capitalize;
	}
</style>
