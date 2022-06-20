import { writable } from 'svelte/store';

export const ROUTE_NAMES = {
    ADD_DATA: "ADD_DATA",
    LOADING: "LOADING",
};

export const currentRouteName = writable(ROUTE_NAMES.LOADING);