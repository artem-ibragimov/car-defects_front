<script lang="ts">
   import { brandsStore } from 'src/store/main.store';
   import { onDestroy, onMount } from 'svelte';
   import { _ } from 'svelte-i18n';

   let brands = [];
   let error: Error = null;

   onMount(brandsStore.loadList);
   onDestroy(
      brandsStore.state.subscribe((state) => {
         brands = Object.values(state.list);
         error = state.error;
      })
   );
</script>

<ul>
   {#if error}
      {$_(`error.${error}`)}
   {/if}
   {#each brands as brand}
      <li>{brand}</li>
   {/each}
</ul>
