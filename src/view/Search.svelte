<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { _ } from 'svelte-i18n';
    import Button from '../components/Button.svelte';
    
    export let suggestions: string[] = [];

    const dispatch = createEventDispatcher();

    let query = '';
    const onSearch = () => {
        dispatch('search', query)
    };
    const onAddData = () => {
        dispatch('add_data');
    };
</script>

<form class="pure-form">
    <fieldset>
        <legend>Search for models</legend>
        <input type="search" bind:value="{query}" list="suggestions" placeholder="Toyota Camry xv70" autocomplete="on" />
        <datalist id="suggestions">
            {#each suggestions as s}
                <option value={s} />
            {/each}
        </datalist>
        <Button variant="primary" on:click={onSearch}>{$_(`label.search`)}</Button>
        <Button variant="secondary" on:click={onAddData}>{$_('label.add_data')}</Button>
    </fieldset>
</form>
