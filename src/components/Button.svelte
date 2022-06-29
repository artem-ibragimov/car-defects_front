<script lang="ts">
   export let variant: 'primary' | 'default' | 'success' | 'error' | 'warning' | 'secondary' = 'default';
</script>

<button class={`pure-button pure-button-${variant}`} on:click><slot /></button>

<style scoped>
   .pure-button {
      border-radius: 4px;
   }
</style>
