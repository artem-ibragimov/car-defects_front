<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { _ } from 'svelte-i18n';

	import Button from '../../components/Button.svelte';
	export let displayUpdate = false;
	export let updateText: string = '';
	export let displayCreate = false;
	export let displayCancel = false;
	export let posted = false;

	const dispatch = createEventDispatcher();
	const update = () => {
		dispatch('update');
	};
	const create = () => {
		dispatch('create');
	};
	const cancel = () => {
		dispatch('cancel');
	};
</script>

<div class="row">
	{#if displayCancel}
		<Button on:click={cancel}>{$_('label.cancel')}</Button>
	{/if}
	{#if displayUpdate}
		<Button variant="success" on:click={update}>{$_('label.update')}&nbsp;{updateText}</Button>
	{/if}
	{#if displayCreate}
		<Button variant={posted ? 'success' : 'primary'} on:click={create}
			>{posted ? $_('label.posted') : $_('label.post')}</Button
		>
	{/if}
</div>

<style scoped>
	.row {
		display: flex;
	}
	:global(.row > *) {
		flex: 1;
	}
</style>
