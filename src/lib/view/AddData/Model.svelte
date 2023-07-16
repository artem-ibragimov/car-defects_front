<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Input from '../../components/Input.svelte';
	import { modelStore } from '../../store/main.store';

	export let modelID: string;
	export let modelName: string = '';
	export let brandID: string = 0;

	$: disabled = !brandID;
	$: {
		if (brandID) {
			modelStore.loadNames(brandID);
		}
		modelName = '';
		modelID = 0;
	}
	$: ({ state } = modelStore);
	$: ({ map } = $state);
	$: entries = (Object.entries(map).map(([k, v]) => [Number(k), v]) as [string, string][]).sort(
		(e1, e2) => e1[1].localeCompare(e2[1])
	);
	$: suggestions = entries.filter(([_, name]) => name.includes(modelName));

	function onSuggestionClick([id, name]: [string, string]) {
		modelName = name;
		modelID = id;
	}
</script>

<fieldset>
	<legend>{$_('label.model')}</legend>
	<Input
		{disabled}
		type="search"
		bind:value={modelName}
		placeholder={$_('label.model')}
		{suggestions}
		lower
	>
		<div slot="suggestion_item" let:item on:click={() => onSuggestionClick(item)}>
			{item[1]}
		</div>
	</Input>
</fieldset>
