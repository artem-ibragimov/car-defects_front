<script>
	import Article from '$lib/article/Article.svelte';
	import Charts from '$lib/article/Charts.svelte';
	import Cards from '$lib/article/Cards.svelte';

	const title = 'Most reliable SUVs (by Statistics)';
	const cards = [
		{
			title: 'Lexus GX',
			text: `The Lexus GX is the most reliable SUV. This luxury SUV received the highest score in the study,
		which measures problems experienced by original owners of three-year-old vehicles. The Lexus GX
		had the fewest issues of any SUV, making it a top choice for those looking for a reliable
		vehicle.`
		},
		{
			title: 'Toyota Highlander',
			text: `Another highly reliable SUV, is the Toyota Highlander. This popular mid-size
		SUV has a reputation for being reliable, and it received high marks in the study for its low
		number of problems. The Toyota Highlander is a great choice for those who want a spacious and
		reliable SUV that is also budget-friendly.`
		},
		{
			title: 'Honda CR-V',
			text: `The Honda CR-V is another SUV that consistently ranks highly in reliability studies.
		This compact SUV has a reputation for being dependable and long-lasting, and it received high
		marks in the J.D. Power study for its low number of problems. The Honda CR-V is a great choice
		for those who want a reliable SUV that is also fuel-efficient and easy to maneuver.`
		},
		{
			title: 'Mazda CX-5',
			text: `The Mazda CX-5 received high marks for its low number of problems, making it one of the more
		reliable SUVs on the market. Additionally, the Mazda CX-5 has received praise for its well-built
		interior, smooth and responsive handling, and fuel-efficient engine. While no vehicle is
		perfect, the Mazda CX-5 is generally considered to be a dependable and long-lasting SUV.`
		}
	];
</script>

<Article {title} {cards}>
	<p>
		SUVs have become increasingly popular due to their versatility, spaciousness, and durability.
		With so many options on the market, it can be difficult to determine which one is the most
		reliable. To help make the decision-making process easier, we've compiled a list of the top 5
		most reliable SUVs based on statistical studies.
	</p>

	<Cards {cards} />

	<Charts
		lg
		title="Summary"
		entity_params={`{"lexus gx":{"modelID":927},"toyota highlander":{"modelID":754},"honda cr-v":{"modelID":944},"mazda cx-5":{"modelID":330}}`}
	/>

	<p>
		In conclusion, the Lexus GX, Toyota Highlander, Honda CR-V, and Mazda CX-5 are the most reliable
		SUVs. When choosing an SUV, it is important to consider reliability as one of the top factors,
		as a reliable vehicle will provide years of worry-free driving.
	</p>
</Article>
