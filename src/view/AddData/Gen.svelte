<script lang="ts">
   import type { IGenData } from 'src/api/gen.api';

   import { genStore } from 'src/store/main.store';

   import { _ } from 'svelte-i18n';
   import Input from '../../components/Input.svelte';

   export let modelID: number = 0;
   export let data: IGenData = {
      name: '',
      img: '',
      start: 0,
      finish: 0,
   };

   $: modelID && genStore.load(modelID);
   $: ({ state } = genStore);
   $: ({ map } = $state);
   $: entries = Object.entries(map);
   $: genNames = entries.filter(([_, { name }]) => name.includes(data.name));

   function onSuggestionClick([id, name]: [number, string]) {
      data.name = name;
      modelID = id;
   }
</script>

<fieldset>
   <legend>{$_('label.gen')}</legend>
   <Input type="text" bind:value={data.name} placeholder={$_('label.gen')} suggestions={genNames}>
      <div slot="suggestion_item" let:item on:click={() => onSuggestionClick(item)}>
         {item[1]}
      </div>
   </Input>
   <img src={data.img} alt={data.img} />
</fieldset>
