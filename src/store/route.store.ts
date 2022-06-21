import { writable } from 'svelte/store';

export const ROUTE_NAMES = {
    MAIN: "",
    ADD_DATA: "add_new_data",
    LOADING: "loading",
};

export const createNav = () => {
    const currentRouteName = writable(location.hash.replace("#", ""));

    currentRouteName.subscribe((v) => {
        location.hash = v;
    });

    const displayAddDataForm = () => {
        currentRouteName.set(ROUTE_NAMES.ADD_DATA);
    };
    return {
        displayAddDataForm,
        currentRouteName
    };
};