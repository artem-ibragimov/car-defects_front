<script lang="ts">
   import { brandsStore } from 'src/store/main.store';
   import { onDestroy, onMount } from 'svelte';
   import { _ } from 'svelte-i18n';

   let brands = [];
   let error: Error = null;

   onMount(brandsStore.load);
   onDestroy(
      brandsStore.state.subscribe((state) => {
         brands = state.list;
         error = state.error;
      })
   );
</script>

<ul>
   {#if error}
      {$_(`error.LOAD_ERROR`)}
   {/if}
   {#each brands as brand}
      <li>{brand}</li>
   {/each}
</ul>
