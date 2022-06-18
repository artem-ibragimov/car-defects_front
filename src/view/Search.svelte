<script>
    import { _ } from 'svelte-i18n';
</script>

<form class="pure-form">
    <fieldset>
        <legend>Search for models</legend>
        <input type="search" placeholder="Toyota Camry xv70" autocomplete="on" />
        <button type="submit" class="pure-button pure-button-primary">{$_(`label.search`)}</button>
    </fieldset>
</form>
