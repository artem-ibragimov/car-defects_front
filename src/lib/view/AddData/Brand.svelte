<script lang="ts">
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import Input from '$lib/components/Input.svelte';
	import { brandsStore } from '../../store/main.store';

	export let brandID: number;
	export let brandName = '';

	$: ({ state } = brandsStore);
	$: ({ map } = $state);
	$: entries = Object.entries(map).sort((e1, e2) => e1[1].localeCompare(e2[1]));
	$: suggestions = entries.filter(([_, name]) => name.includes(brandName));

	function onSuggestionClick([id, name]: [number, string]) {
		brandName = name;
		brandID = Number(id);
	}

	onMount(brandsStore.loadNames);
</script>

<fieldset>
	<legend>{$_('label.brand')}</legend>
	<Input type="search" bind:value={brandName} placeholder={$_('label.brand')} {suggestions} lower>
		<div slot="suggestion_item" let:item on:click={() => onSuggestionClick(item)}>
			{item[1]}
		</div>
	</Input>
</fieldset>
