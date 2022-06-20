<script lang="ts">
	import { dictionary,locale } from 'svelte-i18n';
	import { dictionaries } from './i18n';
	import Container from './view/Container.svelte';
	
	dictionary.set(dictionaries);
	Promise.resolve(locale.set('en')).then(console.log, console.error);
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<link
		rel="stylesheet"
		href="https://unpkg.com/purecss@2.1.0/build/pure-min.css"
		integrity="sha384-yHIFVG6ClnONEA5yB5DJXfW2/KC173DIQrYoZMEtBvGzmf0PKiGyNEqe9N6BNDBH"
		crossorigin="anonymous"
	/>
</svelte:head>

<Container />