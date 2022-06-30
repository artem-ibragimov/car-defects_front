<script lang="ts">
    import Search from '../components/Search.svelte';
    import { searchStore } from 'src/store/main.store';

    import { createEventDispatcher } from 'svelte';
    import { _ } from 'svelte-i18n';
    import Button from '../components/Button.svelte';

    let suggestions: { brand_id?: number; model_id?: number; gen_id?: number; title: string; label: string }[] = [];
    $: {
        let { brands, models, gens, error } = $state;
        if (error) {
            suggestions = [];
        }
        suggestions = [].concat(
            Object.entries(brands).map(([brand_id, title]) => ({
                title,
                brand_id: Number(brand_id),
                label: $_('label.brand'),
            })),
            Object.entries(models).map(([model_id, title]) => ({
                title,
                model_id: Number(model_id),
                label: $_('label.model'),
            })),
            Object.entries(gens).map(([gen_id, title]) => ({
                title,
                gen_id: Number(gen_id),
                label: $_('label.gen'),
            }))
        );
    }

    const dispatch = createEventDispatcher();

    $: ({ state } = searchStore);

    const onSearch = ({ detail }) => {
        searchStore.search(detail);
    };
    const onAddData = () => {
        dispatch('add_data');
    };
</script>

<div class="pure-form">
        <Search {suggestions} on:change={onSearch} />
        <Button variant="secondary" on:click={onAddData}>{$_('label.add_data')}</Button>
</div>

<style scoped>
    .pure-form{
        display: flex;
        justify-content: center;
    }
</style>
