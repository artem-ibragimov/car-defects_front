<script lang="ts">
	import type { ITransData } from '$lib/api/data/trans.api';
	import { transStore } from '$lib/store/main.store';

	import { _ } from 'svelte-i18n';
	import Input from '../../components/Input.svelte';
	import Actions from './Actions.svelte';

	export let data: ITransData = {
		Name: '',
		Acceleration: 0,
		Consumtion: 0,
		Gears: 0
	};
	export let brandID: string = 0;
	export let transID: string = 0;
	export let versionID: string = 0;

	$: disabled = !versionID;
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
	$: entries = (Object.entries(map).map(([k, v]) => [Number(k), v]) as [string, string][]).sort(
		(e1, e2) => e1[1].localeCompare(e2[1])
	);
	$: names = entries.filter(([_, name]) => name.includes(data.Name));
	$: !data.Name && clear();

	function clear() {
		data = {
			Name: '',
			Acceleration: 0,
			Consumtion: 0,
			Gears: 0
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

<fieldset class="column pure-form-aligned">
	<legend>{$_('label.trans.name')}</legend>
	<Input
		{disabled}
		type="search"
		bind:value={data.Name}
		placeholder={$_('label.trans.name')}
		suggestions={names}
	>
		<div slot="suggestion_item" let:item on:click={() => onSuggestionClick(item)}>
			{item[1]}
		</div>
	</Input>
	<div class="pure-control-group">
		<Input
			{disabled}
			type="number"
			bind:value={data.Acceleration}
			label={$_('label.trans.acceleration')}
		/>
		<Input
			{disabled}
			type="number"
			bind:value={data.Consumtion}
			label={$_('label.trans.consumtion')}
		/>
		<Input {disabled} type="number" bind:value={data.Gears} label={$_('label.trans.gears')} />
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
