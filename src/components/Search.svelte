<script lang="ts">
   import { createEventDispatcher, onDestroy, onMount } from 'svelte';
   import Button from './Button.svelte';
   import { _ } from 'svelte-i18n';

   export let value: string = '';
   export let suggestions: {
      brand_id?: number;
      model_id?: number;
      gen_id?: number;
      title: string;
      label: string;
   }[] = [];

   let query: string = value;

   const dispatcher = createEventDispatcher();
   const onSuggestionClick = (s) => {
      query = s.title;
      onChange();
   };
   const onChange = () => {
      hide();
      dispatcher('type', query);
   };

   let root: HTMLDivElement = null;
   let field: HTMLDivElement = null;

   $: isOpen = suggestions.length !== 0;
   const show = () => {
      isOpen = true;
   };
   const hide = () => {
      isOpen = false;
   };

   const onInput = () => {
      dispatcher('input', value);
   };

   let dropdown_style = { width: '100%', left: '', top: '' };
   $: {
      setTimeout(() => {
         if (field) {
            const rect = field.getBoundingClientRect();
            console.debug(rect);
            dropdown_style.width = `${Math.round(rect.width)}px`;
            dropdown_style.left = `${Math.round(rect.left)}px`;
            dropdown_style.top = `${Math.round(rect.top + rect.height)}px`;
         }
      }, 1111);
   }

   const onDocumentClick = (e) => {
      if (isOpen && root && !root.contains(e.target)) {
         this.hide();
      }
   };
   onMount(() => {
      document.body.addEventListener('click', onDocumentClick);
   });

   onDestroy(() => {
      document.body.removeEventListener('click', onDocumentClick);
   });
</script>

<div bind:this={root} class="Search">
   <div bind:this={field} class="Search__field">
      <input
         type="search"
         bind:value={query}
         placeholder="Toyota Camry xv70"
         on:focus={show}
         on:input={onChange}
         autocomplete="on"
      />
   </div>
   <Button variant="primary" on:click={onInput}>{$_(`label.get_data`)}</Button>
   <div
      class="Search__dropdown"
      class:Search__dropdown-opened={isOpen}
      style={`
         width: ${dropdown_style.width}; 
         left:  ${dropdown_style.left};
         top:   ${dropdown_style.top};
      `}
   >
      {#each suggestions as s}
         <div on:click={() => onSuggestionClick(s)} class="Search__dropdown__item">
            <span class="Search__dropdown__item__title"> {s.title}</span>
            <span class="Search__dropdown__item__label"> {s.label}</span>
         </div>
      {/each}
   </div>
</div>

<style scoped>
   .Search {
      display: flex;
      align-items: flex-start;
   }
   .Search__field {
      flex: 1;
      box-sizing: border-box;
      display: flex;
   }
   .Search__field input {
      flex: 1;
      text-transform: capitalize;
   }
   .Search__dropdown {
      flex-direction: column;
      position: absolute;
      border-radius: 6px;
      z-index: 9999999;
      display: none;
      cursor: pointer;
      text-transform: capitalize;
      background: #fff;
   }
   .Search__dropdown-opened {
      display: flex;
   }
   .Search__dropdown__item {
      display: flex;
      box-sizing: border-box;
      justify-content: space-between;
      padding: 0.5em 0.6em;
      border: 1px solid #ccc;
      border-radius: 4px;
      vertical-align: middle;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      -webkit-appearance: textfield;
      outline-offset: -2px;
   }
   .Search__dropdown__item:hover {
      -webkit-box-shadow: inset 0 1px 3px #ddd;
      box-shadow: inset 0 1px 3px #ddd;
   }
   .Search__dropdown__item__label {
      color: #ccc;
   }
</style>
