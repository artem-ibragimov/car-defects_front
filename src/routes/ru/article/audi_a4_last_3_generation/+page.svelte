<script>
	import Article from '$lib/article/Article.svelte';
	import Charts from '$lib/article/Charts.svelte';
	import Cards from '$lib/article/Cards.svelte';

	const title = 'Надежность Audi A4 за последние 3 поколения';
</script>

<Article {title}>
	<p>За последние 3 поколения Audi A4 стала более стильной. Но.... стала ли она надежнее?</p>
	<p>Статистически, в каждом поколении количество обращений в сервис сокращалось в 3-4 раза!</p>
	<p>
		Более того, количество поломок двигателя в последнем поколении сократилось в 15 раз по сравнению
		с предыдущим поколением B8! Впечатляющий результат был достигнут благодаря линейке обкатанных
		двигателей от концерна Volkswagen Audi Group.
	</p>
	<p>
		Почти такие же положительные результаты и по трансмиссии: Если в поколении B8 машины оснащались
		устаревшими автоматическими системами Multitronic CVT, S tronic, Tiptronic, а также механикой,
		то теперь единственным вариантом является более четкая и быстрая система S-tronic с двумя
		сцеплениями.
	</p>
	<Charts
		lg
		title="Summary"
		entity_params={`{"audi a4 b7":{"genID":"8"},"audi a4 b8":{"genID":"7"},"audi a4 b9":{"genID":"6"}}`}
	/>
</Article>
