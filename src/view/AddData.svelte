<script lang="ts">
   import type { IGenData } from 'src/api/gen.api';
   import BrandName from './AddData/BrandName.svelte';
   import Gen from './AddData/Gen.svelte';
   import ModelName from './AddData/ModelName.svelte';

   let brandID: number;
   let modelID: number;
   let genData: IGenData;

   $: console.debug('brand', brandID, 'model', modelID);
</script>

<div class="pure-form">
   <BrandName bind:brandID />
   <ModelName bind:modelID {brandID} />
   <Gen bind:data={genData} {modelID} />
</div>

<style scoped>
   .pure-form {
      display: flex;
      flex-direction: row;
   }
</style>
