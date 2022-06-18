/// <reference types="svelte" />

import type { IAnalytics } from './utils/analytics';

/*eslint no-restricted-exports: ["off"]*/

declare module '*.svelte' {
   export { SvelteComponentDev as default } from 'svelte/internal';
}