<script lang="ts">
	import { localeStore } from '$lib/store/main.store';
	import { _ } from 'svelte-i18n';

	$: ({ selected } = localeStore);
	// $: src =
	// 	$selected === 'ru'
	// 		? 'https://www.youtube.com/embed/72VB1F1sX7s?si=05z6te_SDblAJoi1&amp;controls=0'
	// 		: 'https://www.youtube.com/embed/km0wsB0xBV4?controls=0';
</script>

<img width="755" src={`/assets/img/${$selected}/poster.webp`} alt="Poster" />
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

<!-- <style scoped>
	.Trailer {
		max-width: 100%;
		max-height: 100%;
	}
</style> -->
