<script lang="ts">
   import { createEventDispatcher, onDestroy, onMount } from 'svelte';
   import { _ } from 'svelte-i18n';

   export let value: string = '';
   export let type: string = 'text';
   export let placeholder: string = '';
   export let suggestions: any[] = [];

   const dispatcher = createEventDispatcher();

   let root: HTMLDivElement = null;
   let field: HTMLDivElement = null;

   $: isOpen = suggestions.length !== 0;
   const show = () => {
      isOpen = suggestions.length !== 0;
   };
   const hide = () => {
      isOpen = false;
   };

   const handleInput = (e) => {
      value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value;
      show();
      dispatcher('input', value);
   };

   const onSuggestionClick = (item) => {
      value = item;
      hide();
   };

   let dropdown_style = { width: '100%', left: '', top: '' };

   const setDropDownPosition = (rect = { width: 0, left: 0, top: 0, height: 0 }) => {
      dropdown_style.width = `${Math.round(rect.width)}px`;
      dropdown_style.left = `${Math.round(rect.left)}px`;
      dropdown_style.top = `${Math.round(rect.top + rect.height)}px`;
   };

   const resize = (node) => {
      const rect = node.getBoundingClientRect();
      setDropDownPosition(rect);
      return {
         update() {
            debugger;
            setDropDownPosition(rect);
         },
      };
   };

   const onDocumentClick = (e) => {
      if (isOpen && root && !root.contains(e.target)) {
         hide();
      }
   };
   onMount(() => {
      document.body.addEventListener('click', onDocumentClick);
   });
   onDestroy(() => {
      document.body.removeEventListener('click', onDocumentClick);
   });
</script>

<div class="Input" bind:this={root}>
   <div bind:this={field} class="Input__field" use:resize>
      <input {type} {value} {placeholder} on:focus={show} on:input={handleInput} on:change />
   </div>
   <div
      class="Input__dropdown"
      class:Input__dropdown-opened={isOpen}
      on:click={hide}
      style={`
         width: ${dropdown_style.width}; 
         left:  ${dropdown_style.left};
         top:   ${dropdown_style.top};
      `}
   >
      {#each suggestions as item}
         {#if $$slots['suggestion_item']}
            <slot name="suggestion_item" {item} class="Input__dropdown__item" />
         {/if}
         {#if !$$slots['suggestion_item']}
            <div
               class="Input__dropdown__item"
               on:click={() => {
                  onSuggestionClick(item);
               }}
            >
               {item}
            </div>
         {/if}
      {/each}
   </div>
</div>

<style scoped>
   .Input__field {
      flex: 1;
      box-sizing: border-box;
      display: flex;
   }
   .Input__field input {
      flex: 1;
      text-transform: capitalize;
   }
   .Input__dropdown {
      flex-direction: column;
      position: absolute;
      border-radius: 6px;
      z-index: 9999999;
      display: none;
      cursor: pointer;
      text-transform: capitalize;
      background: #fff;
   }
   .Input__dropdown-opened {
      display: flex;
   }
   :global([slot='suggestion_item']),
   .Input__dropdown__item {
      text-align: left;
      justify-content: space-between;
      padding: 0.5em 0.6em;
      border: 1px solid #ccc;
      border-radius: 4px;
      vertical-align: middle;
      box-sizing: border-box;
      -webkit-appearance: textfield;
      outline-offset: -2px;
   }
   :global([slot='suggestion_item']) :hover,
   .Input__dropdown__item:hover {
      -webkit-box-shadow: inset 0 1px 3px #ddd;
      box-shadow: inset 0 1px 3px #ddd;
   }
</style>
