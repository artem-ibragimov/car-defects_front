<script lang="ts">
   import { ROUTES } from 'src/routes';
   import { brandsStore } from 'src/store/main.store';
   import { currentRouteName } from 'src/store/route.store';
   import { onDestroy, onMount } from 'svelte';
   import Search from './search.svelte';

   let brands = [];
   onMount(brandsStore.load);
   onDestroy(
      brandsStore.state.subscribe((state) => {
         brands = state.list;
      })
   );
</script>

<main>
   <Search suggestions={brands} />
   {#if ROUTES[$currentRouteName]}
      <svelte:component this={ROUTES[$currentRouteName].component} />
   {/if}
</main>

<style>
   main {
      text-align: center;
      padding: 1em;
      max-width: 240px;
      margin: 0 auto;
   }

   @media (min-width: 640px) {
      main {
         max-width: none;
      }
   }
</style>
