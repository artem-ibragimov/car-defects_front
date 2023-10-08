<script lang="ts">
	import type { IVersionData } from '$lib/api/data/version.api';
	import { versionStore } from '$lib/store/main.store';
	import { _ } from 'svelte-i18n';
	import Input from '$lib/components/Input.svelte';

	export let genID: number = 0;
	export let data: IVersionData = { Name: '', GenID: genID, TransID: 0, EngineID: 0 };
	export let versionID: number = 0;

	$: disabled = !genID;
	$: {
		if (genID) {
			versionStore.loadNames(genID);
		}
		clear();
	}
	$: ({ state } = versionStore);
	$: ({ map, selected } = $state);
	$: entries = Object.entries(map).sort((e1, e2) => e1[1].localeCompare(e2[1]));
	$: suggestions = entries.filter(([_, name]) => name.includes(data.Name));

	$: if (selected && data.Name !== selected.Name) {
		selected = null;
		data.TransID = 0;
		data.EngineID = 0;
	}

	function clear() {
		selected = null;
		versionID = '';
		data = { Name: '', GenID: genID, TransID: '', EngineID: '' };
	}

	function onSuggestionClick([id, name]: [string, string]) {
		data.Name = name;
		versionStore.getData(id).then(() => {
			data = { ...selected };
		});
		versionID = Number(id);
	}

	// function update() {
	// 	versionStore.patchData(genID, data).then(() => {
	// 		versionStore.loadNames(genID);
	// 	});
	// }
	// function create() {
	// 	versionStore.postData(data).then(({ data }) => {
	// 		versionID = data;
	// 		versionStore.loadNames(genID);
	// 	});
	// }
</script>

<fieldset class="column">
	<legend>{$_('label.version')}</legend>
	<Input
		{disabled}
		type="search"
		bind:value={data.Name}
		placeholder={$_('label.version')}
		{suggestions}
	>
		<div slot="suggestion_item" let:item on:click={() => onSuggestionClick(item)}>
			{item[1]}
		</div>
	</Input>
	<!-- <Actions
      on:create={create}
      on:update={update}
      displayCreate={!!data.Name}
      displayUpdate={!!versionID}
      updateText={map[versionID]}
   /> -->
</fieldset>

<style scoped>
	.column {
		display: flex;
		flex-direction: column;
	}
</style>
