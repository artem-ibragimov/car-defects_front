<script>
	import Article from '$lib/article/Article.svelte';
	import Charts from '$lib/article/Charts.svelte';

	const title = 'Reliability of the Audi A4 over the last 3 generations';
</script>

<Article {title}>
	<p>
		For the last 3 generations, Audi A4 has become more stylish. But… has it become more reliable?
	</p>
	<p>
		Well, statistically, the answer is yes: within each generation, the amount of service calls has
		decreased 3-4 times!
	</p>
	<p>
		Furthermore, the number of engine crashes in the last generation was reduced by 15 times
		compared with the previous B8 generation! The new A4 has achieved great results thanks to its
		engines, which are sourced from the Volkswagen Audi Group.
	</p>
	<p>
		Almost the same positive results about transmission: In the B8 generation, A4 was equipped with
		old-school Multitronic CVT, S tronic, and Tiptronic automatics as well as manual transmissions,
		but the sharper, quicker S-tronic twin-clutch arrangement is now the sole self-shifting option.
	</p>
	<Charts
		lg
		title="Summary"
		entity_params={`{"audi a4 b7":{"genID":"8"},"audi a4 b8":{"genID":"7"},"audi a4 b9":{"genID":"6"}}`}
	/>
</Article>
