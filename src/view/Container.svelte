<script lang="ts">
   import { ROUTES } from 'src/routes';
   import { nav } from 'src/store/main.store';
   import Search from './search.svelte';

   let { currentRouteName } = nav;
   $: route = ROUTES[$currentRouteName];
</script>

<main>
   <Search on:add_data={nav.displayAddDataForm} />
   {#if route}
      <svelte:component this={route.component} />
   {/if}
</main>

