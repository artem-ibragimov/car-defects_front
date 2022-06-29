<script lang="ts">
   import { createEventDispatcher, onDestroy, onMount } from 'svelte';
   import Button from './Button.svelte';
   import { _ } from 'svelte-i18n';
   import Input from './Input.svelte';

   export let value: string = '';
   export let suggestions: {
      brand_id?: number;
      model_id?: number;
      gen_id?: number;
      title: string;
      label: string;
   }[] = [];

   const dispatcher = createEventDispatcher();
   const onSuggestionClick = (s) => {
      value = s.title;
      onChange();
   };
   const onChange = () => {
      dispatcher('change', value);
   };

   const onInput = () => {
      dispatcher('input', value);
   };
</script>

<div class="Search">
   <Input type="search" bind:value placeholder="Toyota Camry xv70" on:input={onChange} {suggestions}>
      <div slot="suggestion_item" let:item on:click={() => onSuggestionClick(item)}>
         <span class="Search__dropdown__item__title"> {item.title}</span>
         <span class="Search__dropdown__item__label"> {item.label}</span>
      </div>
   </Input>
   <Button variant="primary" on:click={onInput}>{$_(`label.get_data`)}</Button>
</div>

<style scoped>
   .Search {
      display: flex;
      gap: 5px;
      justify-content: center;
      align-items: center;
   }
   .Search__dropdown__item__label {
      color: #ccc;
   }
</style>
