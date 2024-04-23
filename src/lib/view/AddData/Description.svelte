<script lang="ts">
	import type { ITransData } from '$lib/api/data/trans.api';
	import { transStore } from '$lib/store/main.store';
	import { onMount } from 'svelte';

	import { _ } from 'svelte-i18n';
	import Input from '$lib/components/Input.svelte';
	import Actions from './Actions.svelte';

	export let data: ITransData = {
		Name: '',
		Acceleration: '',
		Consumtion: '',
		Gears: ''
	};
	export let brandID: string = '0';
	export let transID: string = '0';

	$: {
		if (brandID) {
			transStore.loadNames(brandID);
		}
		clear();
	}
	let prevId = 0;
	$: {
		if (prevId != transID) {
			clear();
			transID &&
				transStore.getData(transID).then(() => {
					prevId = transID;
					data = { ...selected };
				});
		}
	}

	$: !transID && clear();
	$: ({ state } = transStore);
	$: ({ map, selected } = $state);
	$: entries = Object.entries(map).sort((e1, e2) => e1[1].localeCompare(e2[1]));
	$: names = entries.filter(([_, name]) => name.includes(data.Name));
	$: !data.Name && clear();

	function clear() {
		data = {
			Name: '',
			Acceleration: '',
			Consumtion: '',
			Gears: ''
		};
	}

	function create() {
		transStore.postData(data).then((res) => {
			if (!res) {
				return;
			}
			transID = res.data;
			transStore.loadNames(brandID);
		});
	}

	function update() {
		transStore.patchData(transID, data).then(() => {
			transStore.loadNames(brandID);
		});
	}

	function onSuggestionClick([id, name]: [string, string]) {
		data.Name = name;
		transID = id;
		transStore.getData(transID).then(() => {
			data = { ...selected };
		});
	}
</script>

<fieldset class="column">
	<legend>{$_('label.trans.name')}</legend>
	<Input
		type="search"
		bind:value={data.Name}
		placeholder={$_('label.trans.name')}
		suggestions={names}
	>
		<div slot="suggestion_item" let:item on:click={() => onSuggestionClick(item)}>
			{item[1]}
		</div>
	</Input>
	<div class="">
		<Input type="number" bind:value={data.Acceleration} label={$_('label.trans.acceleration')} />
		<Input type="number" bind:value={data.Consumtion} label={$_('label.trans.consumtion')} />
		<Input type="number" bind:value={data.Gears} label={$_('label.trans.gears')} />
	</div>
	<Actions
		on:create={create}
		on:update={update}
		displayCreate={!!data.Name}
		displayUpdate={!!transID}
		updateText={map[transID]}
	/>
</fieldset>

<style scoped>
	.column {
		display: flex;
		flex-direction: column;
	}
</style>
