<script>
	import Article from '$lib/article/Article.svelte';
	import Charts from '$lib/article/Charts.svelte';
	import Cards from '$lib/article/Cards.svelte';

	const title =
		'Objective comparison of Toyota Camry vs Honda Accord in terms of reliability (according to statistics)';
	const cards = [
		{
			title: 'Toyota Camry Engine',
			text: `The Toyota Camry also offers a variety of engine choices.
A base engine is often a 2.5-liter inline-4 engine.
There's also a more powerful 3.5-liter V6 engine available in some trims.
The Camry Hybrid uses a 2.5-liter 4-cylinder engine combined with an electric motor.`
		},
		{
			title: 'Honda Accord Engine',
			text: `The Honda Accord typically offers a range of engine options, with variations depending on the trim level and model year.
A common engine found in the Accord is the 1.5-liter turbocharged inline-4 engine.
The more powerful option is usually a 2.0-liter turbocharged inline-4 engine.
The Accord Hybrid features a 2.0-liter Atkinson-cycle inline-4 engine combined with an electric motor.`
		},
		{
			title: 'Toyota Camry Transmission',
			text: `The Camry often offers an 8-speed automatic transmission with the 2.5-liter engine.
The 3.5-liter V6 engine is typically paired with an 8-speed automatic transmission as well.
The Camry Hybrid utilizes an electronically-controlled continuously variable transmission (ECVT).`
		},
		{
			title: 'Honda Accord Transmission',
			text: `
The Accord typically comes with a continuously variable transmission (CVT) paired with its 1.5-liter engine.
The 2.0-liter engine is often mated to a 10-speed automatic transmission.
The Accord Hybrid features an e-CVT (electronic Continuously Variable Transmission).`
		},
		{
			title: 'Toyota Camry Suspension',
			text: `The Camry also uses a front MacPherson strut suspension and a multi-link rear suspension for similar ride comfort and handling characteristics.`
		},
		{
			title: 'Honda Accord Suspension',
			text: `
			The Accord usually has a front MacPherson strut suspension and a multi-link rear suspension, which provides a good balance between ride comfort and handling.`
		}
	];
</script>

<Article {title} {cards}>
	<Cards {cards} />

	<Charts
		lg
		title="Summary"
		entity_params={`{"toyota camry":{"modelID":"722"},"honda accord":{"modelID":"903"}}`}
	/>
</Article>
