<script lang="ts">
   import Input from '../components/Input.svelte';
   import { brandsStore } from '../store/main.store';
   import { onMount } from 'svelte';
   import { _ } from 'svelte-i18n';

   $: ({ state: brandState } = brandsStore);
   $: ({ list } = $brandState);
   $: brandNames = list.filter((name) => name.includes(value));

   export let value = '';

   onMount(() => {
      brandsStore.load();
   });
</script>

<div class="pure-form">
   <fieldset>
      <legend>{$_('label.brand')}</legend>
      <Input type="text" bind:value placeholder={$_('label.brand')} suggestions={brandNames} />
   </fieldset>
</div>

<style scoped>
   .pure-form {
      display: flex;
      flex-direction: row;
      margin: auto;
   }
</style>
