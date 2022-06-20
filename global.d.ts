/// <reference types="svelte" />


/*eslint no-restricted-exports: ["off"]*/

declare module '*.svelte' {
   export { SvelteComponentDev as default } from 'svelte/internal';
}