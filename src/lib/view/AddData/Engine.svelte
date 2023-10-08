<script lang="ts">
	import type { IEngineData } from '$lib/api/data/engine.api';
	import { engineStore } from '$lib/store/main.store';
	// import { convertFileToBase64 } from '$lib/util/file';
	import { onMount } from 'svelte';

	import { _ } from 'svelte-i18n';
	import Input from '$lib/components/Input.svelte';
	import Actions from './Actions.svelte';

	export let data: IEngineData = {
		Name: '',
		Displacement: '',
		Cylinders: '',
		Valves: '',
		Fuel_type: '',
		Power_hp: '',
		Torque: '',
		Img: ''
	};
	export let engineID: string = 0;
	$: disabled = !engineID;
	let prevId = 0;

	onMount(engineStore.loadNames);
	$: {
		if (engineID != prevId) {
			clear();
			engineID &&
				engineStore.getData(engineID).then(() => {
					prevId = engineID;
					data = { ...selected };
				});
		}
	}
	$: ({ state } = engineStore);
	$: ({ map, selected } = $state);
	$: entries = Object.entries(map).sort((e1, e2) => e1[1].localeCompare(e2[1]));
	$: suggestions = entries.filter(([_, name]) => name.includes(data.Name));
	$: !data.Name && clear();

	function clear() {
		data = {
			Name: '',
			Displacement: '',
			Cylinders: '',
			Valves: '',
			Fuel_type: '',
			Power_hp: '',
			Torque: '',
			Img: ''
		};
	}

	function onSuggestionClick([id, _]: [string, string]) {
		engineID = id;
	}

	// function onImgChoose(e: Event) {
	//    const files = (e.target as HTMLInputElement).files;
	//    if (files.length === 0) {
	//       return;
	//    }
	//    convertFileToBase64(files[0])
	//       .then((img) => {
	//          data.Img = img;
	//       })
	//       .catch(console.error);
	// }
	function update() {
		engineStore.patchData(engineID, data).then(() => {
			engineStore.loadNames();
		});
	}
	function create() {
		engineStore.postData(data).then((res) => {
			if (!res) {
				return;
			}
			engineID = res.data;
			engineStore.loadNames();
		});
	}
</script>

<fieldset class="column pure-form-aligned">
	<legend>{$_('label.engine.name')}</legend>
	<Input type="search" bind:value={data.Name} placeholder={$_('label.engine.name')} {suggestions}>
		<div slot="suggestion_item" let:item on:click={() => onSuggestionClick(item)}>
			{item[1]}
		</div>
	</Input>
	<!-- <img src={data.Img} alt={data.Img} />
   <input type="file" on:change={onImgChoose} /> -->
	<div class="pure-control-group">
		<Input
			{disabled}
			type="number"
			bind:value={data.Displacement}
			label={$_('label.engine.displacement')}
		/>
		<Input
			{disabled}
			type="number"
			bind:value={data.Cylinders}
			label={$_('label.engine.cylinders')}
		/>
		<Input {disabled} type="number" bind:value={data.Valves} label={$_('label.engine.valves')} />
		<Input
			{disabled}
			type="string"
			bind:value={data.Fuel_type}
			label={$_('label.engine.fuel_type')}
			lower
		/>
		<Input
			{disabled}
			type="number"
			bind:value={data.Power_hp}
			label={$_('label.engine.power_hp')}
		/>
		<Input {disabled} type="number" bind:value={data.Torque} label={$_('label.engine.torque')} />
	</div>
	<Actions
		on:create={create}
		on:update={update}
		displayCreate={!!data.Name}
		displayUpdate={!!engineID}
		updateText={map[engineID]}
	/>
</fieldset>

<style scoped>
	.column {
		display: flex;
		flex-direction: column;
	}
</style>
