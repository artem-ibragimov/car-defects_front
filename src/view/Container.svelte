<script lang="ts">
   import { ROUTES } from 'src/routes';
   import { brandsStore,init,nav } from 'src/store/main.store';
   import { onMount } from 'svelte';
   import Search from './search.svelte';

   onMount(init);

   let { currentRouteName } = nav;
   $: route = ROUTES[$currentRouteName];

   let { state } = brandsStore;
   let { list } = $state;
</script>

<main>
   <Search on:add_data={nav.displayAddDataForm} />
   {#if route}
      <svelte:component this={route.component} />
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
