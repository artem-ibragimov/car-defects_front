<script lang="ts">
   import { _ } from 'svelte-i18n';
   import Input from '../../components/Input.svelte';
   import { modelStore } from '../../store/main.store';

   export let modelID: number;
   export let brandID: number = 0;
   let modelName = '';

   $: brandID && modelStore.load(brandID);
   $: ({ state } = modelStore);
   $: ({ map } = $state);
   $: entries = Object.entries(map);
   $: modelNames = entries.filter(([_, name]) => name.includes(modelName));

   function onSuggestionClick([id, name]: [number, string]) {
      modelName = name;
      modelID = id;
   }
</script>

<fieldset>
   <legend>{$_('label.model')}</legend>
   <Input type="text" bind:value={modelName} placeholder={$_('label.model')} suggestions={modelNames}>
      <div slot="suggestion_item" let:item on:click={() => onSuggestionClick(item)}>
         {item[1]}
      </div>
   </Input>
</fieldset>
