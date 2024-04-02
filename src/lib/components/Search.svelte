<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { _ } from 'svelte-i18n';
	import Button from './Button.svelte';
	import Input from './Input.svelte';

	type Item = {
		brandID?: string;
		modelID?: string;
		genID?: string;
		versionID?: string;
		title: string;
		label: string;
	};

	export let value: string = '';
	export let suggestions: Item[] = [];

	let hidden = false;
	let selectedSuggestion: Item | undefined;

	$: if (suggestions.length === 0) {
		selectedSuggestion = void 0;
	}

	$: selectedSuggestionLabel = selectedSuggestion
		? selectedSuggestion.title.replace(
				/(\w)(\w*)/g,
				(_, g1, g2) => g1.toUpperCase() + g2.toLowerCase()
			)
		: '';

	const dispatcher = createEventDispatcher();
	const onInput = () => {
		if (!selectedSuggestion) {
			const bestMatch = suggestions
				.sort((s) => s.title.length)
				.find((s) => s.title.includes(value));
			selectedSuggestion = bestMatch || suggestions[0];
			if (!selectedSuggestion) {
				return;
			}
		}
		dispatcher('input', selectedSuggestion);
		value = '';
		selectedSuggestion = void 0;
		hidden = true;
	};
	const onSuggestionClick = (item: Item) => {
		selectedSuggestion = item;
		value = `${item.title} `;
		onInput();
		return;
		// пока максиммум поиск по поколениеям
		item.genID ? onInput() : onChange();
	};
	const onChange = () => {
		dispatcher('change', value);
		hidden = false;
	};
</script>

<div class="Search">
	<Input
		type="search"
		bind:value
		placeholder={$_('label.search-placeholder')}
		on:input={onChange}
		{suggestions}
		{hidden}
		hideOnSuggestionClick={false}
		lower
	>
		<div
			class="input-lg"
			slot="suggestion_item"
			let:item
			on:click={() => {
				onSuggestionClick(item);
			}}
		>
			<span class="Search__dropdown__item__title"> {item.title}</span>
			<span class="Search__dropdown__item__label"> {item.label} </span>
		</div>
	</Input>
	<!-- {#if !!selectedSuggestionLabel}
		<Button on:click={onInput} variant="primary"
			>{$_('label.search_by')}{selectedSuggestionLabel}</Button
		>
	{/if} -->
</div>

<style scoped>
	.Search {
		flex: 1;
		display: flex;
		align-items: center;
	}
	.Search__dropdown__item__title {
		flex: 2 1;
		padding: 4px;
	}
	.Search__dropdown__item__label {
		text-align: right;
		flex: 1 2;
		color: oklch(var(--b3));
		padding: 4px;
	}
</style>
