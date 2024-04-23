<script lang="ts">
	export let lazy: boolean = false;
	export let title: string = '';
	export let text: string = '';
	// export let imgSrc: string = '';
	export let href: string | undefined;
	const SIZES = [320, 640, 1280];
	// const loading: 'lazy' | 'eager' = lazy ? 'lazy' : 'eager';
	// $: srcset = imgSrc ? SIZES.map((w) => `/assets/img/${imgSrc}--${w}.webp ${w}w`).join(', ') : '';
</script>

<div class="card w-96 shadow-md bg-base-100">
	<a {href} target="_self">
		<!-- <figure>
			<img
				{loading}
				class="Card__banner"
				src={`/assets/img/${imgSrc.toLowerCase()}.webp`}
				alt={title}
				{title}
				{srcset}
				width="400"
				height="220"
				sizes="(max-width: 500px) 100vw, 30vw"
			/>
		</figure> -->
		<div class="card-body">
			<h2 class="card-title">{title}</h2>
			{#if text}
				<p>{text}</p>
			{/if}
		</div>
	</a>
</div>
