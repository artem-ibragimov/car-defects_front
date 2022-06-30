<script lang="ts">
   import { onMount } from 'svelte';
   import { _ } from 'svelte-i18n';
   import Input from '../../components/Input.svelte';
   import { brandsStore } from '../../store/main.store';

   export let brandID: number;
   let brandName = '';

   $: ({ state } = brandsStore);
   $: ({ map } = $state);
   $: entries = Object.entries(map);
   $: brandNames = entries.filter(([_, name]) => name.includes(brandName));

   function onSuggestionClick([id, name]: [number, string]) {
      brandName = name;
      brandID = id;
   }

   onMount(brandsStore.load);
</script>

   <fieldset>
      <legend>{$_('label.brand')}</legend>
      <Input type="text" bind:value={brandName} placeholder={$_('label.brand')} suggestions={brandNames}>
         <div slot="suggestion_item" let:item on:click={() => onSuggestionClick(item)}>
            {item[1]}
         </div>
      </Input>
   </fieldset>

