<script>
	import Article from '$lib/article/Article.svelte';
	import Cards from '$lib/article/Cards.svelte';
	import Charts from '$lib/article/Charts.svelte';

	const title = 'Most reliable Honda Models (by Statistics)';
	const cards = [
		{
			title: 'Honda Civic',
			text: 'The Honda Civic is a compact car known for its reliability, fuel efficiency, and practicality. It comes in various body styles, including sedan, coupe, and hatchback, making it a versatile choice for a wide range of customers. The Civic is often favored for its comfortable interior, smooth ride, and advanced safety features'
		},
		{
			title: 'Honda Accord',
			text: 'The Honda Accord is a mid-size sedan (and previously available as a coupe) that offers a comfortable and spacious cabin with a well-balanced combination of performance and fuel efficiency. It is renowned for its strong resale value, dependable reputation, and a range of available features, making it a popular choice among families and commuters'
		},
		{
			title: 'Honda CR-V',
			text: 'The Honda CR-V is a compact crossover SUV, known for its practicality and versatility. It offers ample cargo space, a comfortable ride, and excellent fuel efficiency. The CR-V is a favorite among those seeking a reliable and spacious vehicle for daily commuting or family outings'
		},
		{
			title: 'Honda Fit',
			text: 'The Honda Fit, also known as the Honda Jazz in some markets, is a subcompact hatchback designed to maximize interior space and versatility despite its small size. The Fit\'s "Magic Seat" allows for various configurations to accommodate different cargo and passenger needs, making it a practical choice for city driving and urban lifestyles'
		},
		{
			title: 'Honda HR-V',
			text: "The Honda HR-V is a subcompact crossover SUV that sits below the CR-V in Honda's lineup. It provides a similar blend of versatility and fuel efficiency in a more compact package. The HR-V is a suitable option for those seeking an SUV-like vehicle with better maneuverability and city-friendly dimensions"
		}
	];
</script>

<Article {title} {cards}>
	<p>
		The Honda Civic, Honda Accord, Honda CR-V, Honda Fit, and Honda HR-V are all popular models of
		cars produced by Honda, a renowned Japanese automotive manufacturer. Each of these models caters
		to different market segments and offers various features and specifications.
	</p>

	<Cards {cards} />
	<Charts
		lg
		title="Summary"
		entity_params={`{"honda civic":{"modelID":"956"},"honda accord":{"modelID":"903"},"honda cr-v":{"modelID":"944"},"honda civic":{"modelID":"956"},"honda hr-v":{"modelID":"988"}}`}
	/>

	<p>
		The Honda HR-V has the best reliability rating of all the Honda models in this CarDefects
		dataset. The studies show the severity and frequency of repairs experienced by HR-V owners are
		much less than others. The HR-V’s average costs are even more impressive than all subcompact
		SUVs, estimated at $466. And HR-V’s repairs cost less than half the average $652 that all
		vehicle owners spend annually.
	</p>
</Article>
