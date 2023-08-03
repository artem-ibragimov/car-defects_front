<script lang="ts">
	export let title: string = '';
	export let imgSrc: string = '';
</script>

<article>
	<div class="article-wrapper">
		<figure>
			<img src={`/assets/img/${imgSrc}.png`} alt={title} width="400" height="200" />
		</figure>
		<div class="article-body">
			<h2>{title}</h2>
			<p>
				<slot />
			</p>
		</div>
	</div>
</article>

<style scoped>
	article {
		flex-basis: 400px;
		--img-scale: 1.001;
		--title-color: black;
		--link-icon-translate: -20px;
		--link-icon-opacity: 0;
		border-radius: 8px;
		cursor: pointer;
		box-shadow: none;
		background: inherit;
		border-left: 1px solid #ccc;
		border-bottom: 1px solid #ccc;
		transform-origin: center;
		transition: all 0.4s ease-in-out;
		overflow: hidden;
	}

	/* basic article elements styling */
	article h2 {
		margin: 0 0 18px 0;
		font-size: 1.9rem;
		letter-spacing: 0.06em;
		color: var(--title-color);
		transition: color 0.3s ease-out;
	}

	figure {
		margin: 0;
		padding: 0;
		aspect-ratio: 16 / 9;
		overflow: hidden;
	}

	article img {
		width: 400px;
		height: 200px;
		transform-origin: center;
		transform: scale(var(--img-scale));
		transition: transform 0.4s ease-in-out;
	}

	.article-body {
		padding: 10px;
	}

	article:has(:hover, :focus) {
		--img-scale: 1.1;
		box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
	}

	@media screen and (max-width: 960px) {
		article {
			container: card/inline-size;
		}
		.article-body p {
			display: none;
		}
	}

	@container card (min-width: 380px) {
		.article-wrapper {
			display: flex;
			flex-direction: column;
			gap: 16px;
		}
		.article-body {
			padding-left: 0;
		}
		figure {
			width: 100%;
			height: 100%;
		}
		figure img {
			height: 100%;
			aspect-ratio: 1;
			object-fit: cover;
		}
	}
</style>
