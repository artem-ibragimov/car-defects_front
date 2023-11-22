<script lang="ts">
	import type { IDefect } from '$lib/api/data/defect.api';
	import type { IGenData } from '$lib/api/data/gen.api';
	import type { IVersionData } from '$lib/api/data/version.api';
	import { authorStore, countryStore, defectStore, localeStore } from '$lib/store/main.store';
	import { isDebug } from '$lib/util/debug';
	import { onMount } from 'svelte';
	import Actions from './AddData/Actions.svelte';
	import Brand from './AddData/Brand.svelte';
	import Defect from './AddData/Defect.svelte';
	import Gen from './AddData/Gen.svelte';
	import Model from './AddData/Model.svelte';
	import Version from './AddData/Version.svelte';
	import Header from './Header.svelte';
	import { ROUTE_NAMES } from '$lib/store/route.store';

	const CLIENT_ID = '191231991212-et6ncfu3oht9lal9omnvvl6dmg06op4a.apps.googleusercontent.com';

	let brandID: number = 0;
	let brandName: string = '';
	let modelID: number = 0;
	let modelName: string = '';
	let genID: number = 0;
	let genData: IGenData = { Name: '', ModelID: 0, Img: '', Start: '', Finish: '' };
	let versionID: number = 0;
	let versionData: IVersionData = { Name: '', GenID: 0, TransID: 0, EngineID: 0 };
	// let engineData: IEngineData = {
	//    Name: '',
	//    Displacement: '',
	//    Cylinders: '',
	//    Valves: '',
	//    Fuel_type: '',
	//    Power_hp: '',
	//    Torque: '',
	//    Img: '',
	// };
	// let transData: ITransData = {
	//    Name: '',
	//    Gears: '',
	//    Consumtion: '',
	//    Acceleration: '',
	// };
	const DEFAULT_DEFECT_DATA: IDefect = {
		AuthorID: 0,
		BrandID: 0,
		ModelID: 0,
		GenID: 0,
		VersionID: 0,
		CountryID: 1,
		CategoryID: 0,
		Age: 0,
		Year: 0,
		Cost: 0,
		Rating: 0,
		Mileage: 0,
		Freq: 0,
		Desc: '',
		Locale: ''
	};

	let defectData: IDefect = { ...DEFAULT_DEFECT_DATA };

	$: ({ selected } = localeStore);
	$: selected && (defectData.Locale = $selected);

	$: ({ state: authorState } = authorStore);
	$: ({ id: AuthorID } = $authorState);
	$: AuthorID && (defectData.AuthorID = AuthorID || 1);

	$: ({ state: countryState } = countryStore);
	$: ({ id: CountryID } = $countryState);
	$: CountryID && (defectData.CountryID = CountryID);

	let posted = false;

	function cancel() {
		brandID = 0;
		defectData = { ...DEFAULT_DEFECT_DATA };
	}

	function create() {
		authorStore.postAuthor(JWT).then(() => {
			defectStore
				.postDefect(defectData)
				.then(() => {
					posted = true;
					setTimeout(cancel, 5000);
				})
				.catch(cancel);
		});
	}

	let JWT = isDebug() ? 'jwt' : '';
	let signInButton: HTMLDivElement | null = null;

	defectStore.init();
	detectUserCountry();
	onMount(() => {
		initGoogleSignIn();
	});

	function detectUserCountry() {
		fetch('https://api.ipregistry.co/?key=tryout')
			.then((response) => response.json())
			.then((payload) => countryStore.postCounrty(payload.location.country.code.toLowerCase()))
			.catch(() => {
				defectData.CountryID = 1;
			});
	}

	function initGoogleSignIn() {
		if (JWT) {
			return;
		}
		// @ts-ignore
		window.google.accounts.id.initialize({
			client_id: CLIENT_ID,
			callback: (response: { credential: string }) => {
				JWT = response.credential;
			}
		});
		// @ts-ignore
		window.google.accounts.id.renderButton(signInButton, { theme: 'outline', size: 'large' });
		// @ts-ignore
		window.google.accounts.id.prompt();
	}
</script>

<svelte:head>
	<script src="https://accounts.google.com/gsi/client" defer></script>
</svelte:head>

<div class="pure-form">
	<div class="column">
		<Header />
		<Brand bind:brandID bind:brandName />
		<Model bind:modelID {brandID} bind:modelName />
		<Gen bind:data={genData} {modelID} bind:genID />
		<Version bind:data={versionData} {genID} bind:versionID />
		<!-- <Engine bind:data={engineData} bind:engineID={versionData.EngineID} /> -->
		<!-- <Trans bind:data={transData} bind:transID={versionData.TransID} {brandID} {versionID} /> -->
		{#if modelID}
			<Defect bind:data={defectData} {brandID} {modelID} {genID} {versionID} />
		{/if}
		<div bind:this={signInButton} hidden={!!JWT} />
		<Actions
			on:create={create}
			displayCreate={!!JWT && !!defectData.Desc}
			displayCancel
			on:cancel={cancel}
			{posted}
		/>
	</div>
</div>

<style scoped>
	.pure-form {
		display: flex;
		justify-content: center;
		flex-flow: row wrap;
		padding: 20px;
		gap: 20px;
	}
	.column {
		flex-basis: 600px;
		display: flex;
		flex-direction: column;
	}
</style>
