<script>
	import Article from '$lib/article/Article.svelte';
	import Charts from '$lib/article/Charts.svelte';
	import Cards from '$lib/article/Cards.svelte';

	const title = 'Топ японских компактных внедорожников';
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
		Знаете ли вы, что в японских компактных внедорожниках, занимающих первое место по продажам -
		Toyota Rav4, Honda CR-V и Mazda CX-5 CX-5 только Honda CR-V имеет CVT - вариатор?
	</p>
	<p>
		Потенциальные покупатели могут задаться вопросом: насколько надежна такая трансмиссия? Тысячи
		вопросов, ответов и полярных мнений на автомобильных форумах. Но давайте будем предельно
		объективны: статистика обращений в автосервисы не радует. По статистике, владельцы Honda
		сталкиваются с проблемами CVT в два раза чаще других, в первые три года эксплуатации.
	</p>
	<p>
		Конечно, автомобиль с CVT динамичнее и экономичнее, но если для вас важна надежность автомобиля,
		то лучше взять взять классическую автоматическую коробку передач.
	</p>

	<Charts
		lg
		title="Summary"
		entity_params={`{"mazda cx-5":{"modelID":"330"},"toyota rav4":{"modelID":"791"},"honda cr-v":{"modelID":"944"}}`}
	/>
</Article>
