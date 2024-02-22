<script lang="ts">
	import { searchStore } from '$lib/store/main.store';
	import { _ } from 'svelte-i18n';
	import Search from '$lib/components/Search.svelte';

	type Item = {
		brandID?: string;
		modelID?: string;
		genID?: string;
		title: string;
		label: string;
	};
	let suggestions: Item[] = [];
	$: ({ state } = searchStore);
	$: {
		let { brands, models, gens, error } = $state;
		if (error) {
			suggestions = [];
		}
		suggestions = ([] as Item[]).concat(
			Object.entries(brands).map(([brandID, title]) => ({
				title,
				brandID,
				label: $_('label.brand')
			})),
			Object.entries(models).map(([modelID, title]) => ({
				title,
				modelID,
				label: $_('label.model')
			})),
			Object.entries(gens).map(([genID, title]) => ({
				title,
				genID,
				label: $_('label.gen')
			}))
		);
		console.warn('suggestions', suggestions);
	}

	function onSearch({ detail }: CustomEvent<string>) {
		searchStore.search({ query: detail });
	}
</script>

<Search {suggestions} on:change={onSearch} on:input />
