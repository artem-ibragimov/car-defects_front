<script>
	import Article from '$lib/article/Article.svelte';
	import Charts from '$lib/article/Charts.svelte';
	import Cards from '$lib/article/Cards.svelte';

	const title = 'Most reliable Small Family Cars (by Statistics)';
	const cards = [
		{
			title: 'Honda Fit',
			text: `According to recent statistics, the Honda Fit is one of the most reliable small family cars
		available. The Honda Fit has consistently received high marks for its practicality, fuel
		efficiency, and reliability. It has a spacious interior with room for five passengers, a
		comfortable ride, and a low starting price of around $16,190. It’s also one of the most
		fuel-efficient vehicles in its class, making it an excellent choice for families who want to
		save money on gas.`
		},
		{
			title: 'Toyota Corolla',
			text: `Another small family car that’s been rated highly for its reliability is the Toyota Corolla. The
		Toyota Corolla is one of the best-selling vehicles in the world, and for good reason. It’s an
		affordable, practical, and reliable car that provides an excellent driving experience. It has a
		spacious interior, great fuel efficiency, and a low starting price of around $20,050.`
		},
		{
			title: 'Mazda 3',
			text: `The Mazda 3 is another small family car that’s been rated highly for its reliability. This
		vehicle offers a stylish exterior, a comfortable and spacious interior, and excellent driving
		dynamics. The Mazda3 also features advanced safety features, such as a rearview camera,
		blind-spot monitoring, and forward collision warning. It’s starting price is around $20,500.`
		},
		{
			title: 'Subaru Impreza',
			text: `The Subaru Impreza is a small family car that’s been rated highly for its reliability and
		practicality. It’s an all-wheel drive vehicle, making it ideal for families who need a vehicle
		that’s great in all weather conditions. It also features a spacious interior and excellent fuel
		efficiency. It has a starting price of around $18,695.`
		}
	];
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={title} />
	<meta name="og:title" property="og:title" content={title} />
</svelte:head>

<Article>
	<h1>{title}</h1>
	<p>
		Small family cars are the most popular vehicles in the market today. They offer a perfect blend
		of practicality, affordability, and safety. With the rise of the SUV and crossover vehicles,
		small family cars have had to up their game to remain relevant. To do this, manufacturers have
		focused on delivering reliable and practical vehicles that meet the needs of families.
	</p>

	<Cards {cards} />

	<Charts
		lg
		title="Summary"
		entity_params={`%7B"honda+fit"%3A%7B"modelID"%3A983%7D%2C"toyota+corolla"%3A%7B"modelID"%3A731%7D%2C"mazda+3"%3A%7B"modelID"%3A347%7D%2C"subaru+impreza"%3A%7B"modelID"%3A645%7D%7D`}
	/>
	<p>
		In conclusion, there are several small family cars that are considered the most reliable by
		statistics. Whether you’re looking for a practical, affordable, and reliable car, or one that’s
		packed with advanced safety features, there’s a small family car that’s right for you. Whether
		it’s the Honda Fit, Toyota Corolla, Mazda3, or the Subaru Impreza, these vehicles are sure to
		provide you and your family with years of reliable and enjoyable driving.
	</p>
</Article>
