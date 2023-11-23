<script lang="ts">
	import { localeStore } from '$lib/store/main.store';
	import { _ } from 'svelte-i18n';

	$: ({ selected } = localeStore);
	// $: src =
	// 	$selected === 'ru'
	// 		? 'https://www.youtube.com/embed/72VB1F1sX7s?si=05z6te_SDblAJoi1&amp;controls=0'
	// 		: 'https://www.youtube.com/embed/km0wsB0xBV4?controls=0';
	const imgSrc = `poster`;
	const widths = [320, 480, 640, 720, 1280, 1600];
	$: srcset = imgSrc
		? widths.map((w) => `/assets/img/en/${imgSrc}--${w}.webp ${w}w`).join(', ')
		: '';
</script>

<img
	class="Trailer"
	src={`/assets/img/en/${imgSrc}.webp`}
	alt="Poster"
	{srcset}
	sizes="(max-width: 500px) 66vw, 750px"
/>

<!-- <iframe
	class="Trailer"
	width="100%"
	height="400"
	{src}
	title="About Car-Defects Project"
	frameborder="0"
	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
	allowfullscreen
/> -->

<style scoped>
	.Trailer {
		display: none;
	}
	@media screen and (min-width: 500px) {
		.Trailer {
			display: block;
			width: 100%;
			height: 380px;
		}
	}
	@media screen and (min-width: 900px) {
		.Trailer {
			display: block;
			width: 757px;
		}
	}
</style>
