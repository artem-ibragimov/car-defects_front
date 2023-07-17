<script lang="ts">
	import type { IGenData } from '$lib/api/data/gen.api';
	import { genStore } from '$lib/store/main.store';
	// import { convertFileToBase64 } from '$lib/util/file';
	import { _ } from 'svelte-i18n';
	import Input from '$lib/components/Input.svelte';

	export let modelID: string = '';
	$: disabled = !modelID;
	export let data: IGenData = {
		Name: '',
		Img: '',
		Start: '',
		Finish: '',
		ModelID: modelID
	};
	export let genID: string = '';

	$: {
		if (modelID) {
			genStore.loadNames(modelID);
			data.ModelID = modelID;
		}
		clear();
	}

	$: ({ state } = genStore);
	$: ({ map, selected } = $state);
	$: entries = (Object.entries(map).map(([k, v]) => [Number(k), v]) as [string, string][]).sort(
		(e1, e2) => e1[1].localeCompare(e2[1])
	);
	$: suggestions = entries.filter(([_, name]) => name.includes(data.Name));

	$: if (selected && data.Name !== selected.Name) {
		selected = null;
	}
	$: !data.Name && clear();

	function clear() {
		data = {
			Name: '',
			Img: '',
			Start: '',
			Finish: '',
			ModelID: modelID
		};
		genID = '';
		selected = null;
	}

	function onSuggestionClick([id, name]: [string, string]) {
		data.Name = name;
		genID = id;
		genStore.getData(id).then(() => {
			data = { ...data, ...selected };
		});
	}

	// function onImgChoose(e: Event) {
	//    const files = (e.target as HTMLInputElement).files;
	//    if (files.length === '') {
	//       return;
	//    }
	//    convertFileToBase64(files[''])
	//       .then((img) => {
	//          data.Img = img;
	//       })
	//       .catch(console.error);
	// }

	function update() {
		genStore.patchData(genID, data).then(() => {
			genStore.loadNames(modelID);
		});
	}
	function create() {
		genStore.postData(data).then(({ data }) => {
			genID = data;
			genStore.loadNames(modelID);
		});
	}
</script>

<fieldset class="Gen__column">
	<legend>{$_('label.gen')}</legend>
	<Input
		{disabled}
		type="search"
		bind:value={data.Name}
		placeholder={$_('label.gen')}
		{suggestions}
		lower
	>
		<div slot="suggestion_item" let:item on:click={() => onSuggestionClick(item)}>
			{item[1]}
		</div>
	</Input>
	<!-- <img class="Gen__img" src={data.Img} alt={data.Img} />
   <input type="file" on:change={onImgChoose} /> -->
	<div class="Gen__row">
		<span>{data.Start}</span>
		{#if data.Start && data.Finish}
			...
		{/if}
		{#if data.Finish}
			<span>{data.Finish}</span>
		{/if}
	</div>
	<!-- <Actions
      on:create={create}
      on:update={update}
      displayCreate={!!data.Name}
      displayUpdate={!!genID}
      updateText={map[genID]}
   /> -->
</fieldset>

<style scoped>
	.Gen__column {
		display: flex;
		flex-direction: column;
	}
	.Gen__row {
		display: flex;
	}
	/* .Gen__img {
      width: 1''''%;
   } */
</style>
