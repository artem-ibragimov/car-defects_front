<div class="description-block">
	<ul class="breadcrumbs">
		<li class="breadcrumbs__item">
			<a class="breadcrumbs__link" href="#">Бренд</a>
		</li>
		<li class="breadcrumbs__item">
			<a class="breadcrumbs__link" href="#">Модель</a>
		</li>
		<li class="breadcrumbs__item">
			<a class="breadcrumbs__link" href="#">Поколение</a>
		</li>
		<li class="breadcrumbs__item">
			<a class="breadcrumbs__link" href="#">Версия</a>
		</li>
	</ul>
</div>

<style>
	.description-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgb(255, 255, 255);
		width: 670px;
		border-radius: 30px;
		box-shadow: 15px 12px 40px -2px #094e9439;
		margin-bottom: 50px;
	}
	.breadcrumbs {
		margin: 0;
		padding: 0;
	}
	.breadcrumbs__link {
		font-size: 14px;
		color: #33a02c;
	}
	.breadcrumbs__item {
		display: inline-block;
	}
	.breadcrumbs__item::before {
		content: '>>';
		margin-left: 5px;
		margin-right: 5px;
		color: #33a02c;
	}
	.breadcrumbs__item:first-child::before {
		content: '';
	}
</style>
