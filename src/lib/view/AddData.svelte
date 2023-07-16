<script lang="ts">
	import type { IDefect } from '$lib/api/data/defect.api';
	import type { IGenData } from '$lib/api/data/gen.api';
	import type { IVersionData } from '$lib/api/data/version.api';
	import { authorStore, countryStore, defectStore, localeStore, nav } from '$lib/store/main.store';
	import { isDebug } from '$lib/util/debug';
	import { onMount } from 'svelte';
	import Actions from './AddData/Actions.svelte';
	import Brand from './AddData/Brand.svelte';
	import Defect from './AddData/Defect.svelte';
	import Gen from './AddData/Gen.svelte';
	import Model from './AddData/Model.svelte';
	import Version from './AddData/Version.svelte';

	const CLIENT_ID = '191231991212-et6ncfu3oht9lal9omnvvl6dmg06op4a.apps.googleusercontent.com';

	let brandID: string = '';
	let brandName: string = '';
	let modelID: string = '';
	let modelName: string = '';
	let genID: string = '';
	let genData: IGenData = { Name: '', ModelID: '', Img: '', Start: '', Finish: '' };
	let versionID: string = '';
	let versionData: IVersionData = { Name: '', GenID: '', TransID: '', EngineID: '' };
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
	//    Gears: 0,
	//    Consumtion: 0,
	//    Acceleration: 0,
	// };
	let defectData: IDefect = {
		AuthorID: 0,
		BrandID: 0,
		ModelID: 0,
		GenID: 0,
		VersionID: 0,
		CountryID: 0,
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

	$: ({ selected } = localeStore);
	$: selected && (defectData.Locale = $selected);

	$: ({ state: authorState } = authorStore);
	$: ({ id: AuthorID } = $authorState);
	$: AuthorID && (defectData.AuthorID = AuthorID);

	$: ({ state: countryState } = countryStore);
	$: ({ id: CountryID } = $countryState);
	$: CountryID && (defectData.CountryID = CountryID);

	let posted = false;
	function cancel() {
		brandID = 0;
		nav.displayMainPage();
	}
	function create() {
		authorStore.postAuthor(JWT).then(() => {
			defectStore.postDefect(defectData).then(() => {
				posted = true;
				setTimeout(cancel, 5000);
			});
		});
	}

	let JWT = isDebug() ? 'jwt' : '';
	let signInButton: HTMLDivElement | null = null;

	onMount(() => {
		detectUserCountry();
		initGoogleSignIn();
	});

	function detectUserCountry() {
		fetch('https://api.ipregistry.co/?key=tryout')
			.then((response) => response.json())
			.then((payload) => countryStore.postCounrty(payload.location.country.code.toLowerCase()));
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

<div class="pure-form">
	<div class="column">
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
		flex-basis: 500px;
		display: flex;
		flex-direction: column;
	}
</style>
