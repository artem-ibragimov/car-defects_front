<script>
	import Article from '$lib/article/Article.svelte';
	import Charts from '$lib/article/Charts.svelte';
	import Cards from '$lib/article/Cards.svelte';

	const title = 'Japanese top-selling compact SUVs';
	const cards = [
		{
			title: 'Toyota RAV4'
		},
		{
			title: 'Honda CR-V'
		},
		{
			title: 'Mazda CX-5'
		}
	];
</script>

<Article {title} {cards}>
	<Cards {cards} />

	<p>
		Were you aware, that in Japanese top-selling compact SUVs - Toyota Rav4, Honda CR-V, and Mazda
		CX-5 the only Honda CR-V has CVT - continuously variable transmission?
	</p>
	<p>
		The potential buyers might be wondering: how reliable is this kind of transmission? There are
		thousands of questions, answers, and polar opinions in car forums. But let’s be absolutely
		objective here the statistics of car service calls aren't pretty: Compared with concurrents,
		Honda owners have problems with CVT two times more often than others in the first three years of
		use.
	</p>
	<p>
		Of course, a CVT car is more dynamic and fuel-efficient, but if car reliability is important to
		you, You'd be better off taking a classic automatic transmission.
	</p>

	<Charts
		lg
		title="Summary"
		entity_params={`{"mazda cx-5":{"modelID":"330"},"toyota rav4":{"modelID":"791"},"honda cr-v":{"modelID":"944"}}`}
	/>
</Article>
