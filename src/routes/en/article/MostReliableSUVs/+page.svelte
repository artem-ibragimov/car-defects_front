<script>
	import Article from '$lib/article/Article.svelte';
	import Charts from '$lib/article/Charts.svelte';

	const title = 'Most reliable SUVs (by Statistics)';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={title} />
	<meta name="og:title" property="og:title" content={title} />
</svelte:head>

<Article>
	<h1>{title}</h1>
	<p>
		SUVs have become increasingly popular due to their versatility, spaciousness, and durability.
		With so many options on the market, it can be difficult to determine which one is the most
		reliable. To help make the decision-making process easier, we've compiled a list of the top 5
		most reliable SUVs based on statistical studies.
	</p>

	<Charts title="Honda Fit" entity_params={`{"lexus gx":{"modelID":927}}`} />
	<p>
		The Lexus GX is the most reliable SUV. This luxury SUV received the highest score in the study,
		which measures problems experienced by original owners of three-year-old vehicles. The Lexus GX
		had the fewest issues of any SUV, making it a top choice for those looking for a reliable
		vehicle.
	</p>

	<Charts title="Toyota Highlander" entity_params={`{"toyota highlander":{"modelID":754}}`} />
	<p>
		Toyota Highlander: Another highly reliable SUV, is the Toyota Highlander. This popular mid-size
		SUV has a reputation for being reliable, and it received high marks in the study for its low
		number of problems. The Toyota Highlander is a great choice for those who want a spacious and
		reliable SUV that is also budget-friendly.
	</p>

	<Charts title="Honda CR-V" entity_params={`{"honda cr-v":{"modelID":944}}`} />
	<p>
		Honda CR-V: The Honda CR-V is another SUV that consistently ranks highly in reliability studies.
		This compact SUV has a reputation for being dependable and long-lasting, and it received high
		marks in the J.D. Power study for its low number of problems. The Honda CR-V is a great choice
		for those who want a reliable SUV that is also fuel-efficient and easy to maneuver.
	</p>
	<Charts title="Mazda CX-5" entity_params={`{"mazda cx-5":{"modelID":330}}`} />
	<p>
		The Mazda CX-5 received high marks for its low number of problems, making it one of the more
		reliable SUVs on the market. Additionally, the Mazda CX-5 has received praise for its well-built
		interior, smooth and responsive handling, and fuel-efficient engine. While no vehicle is
		perfect, the Mazda CX-5 is generally considered to be a dependable and long-lasting SUV.
	</p>
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
