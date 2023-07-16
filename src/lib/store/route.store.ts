import { writable } from 'svelte/store';

export const ROUTE_NAMES = {
	MAIN: '/',
	ADD_DATA: '/add_data',
	LOADING: '/loading',
	CHART_ONLY: '/chart_only',
	ARTICLE: {
		MostReliableSmallFamilyCars: '/article/MostReliableSmallFamilyCars',
		MostReliableSUVs: '/article/MostReliableSUVs'
	}
};

export const createNav = () => {
	const currentRouteName = writable(
		(typeof window !== 'undefined' && window.location.pathname) || ROUTE_NAMES.MAIN
	);

	currentRouteName.subscribe((v) => {
		if (typeof window !== 'undefined' && window.location.pathname !== v) {
			window.location.assign(v);
		}
	});

	return {
		displayAddDataForm() {
			currentRouteName.set(ROUTE_NAMES.ADD_DATA);
		},
		displayMainPage() {
			currentRouteName.set(ROUTE_NAMES.MAIN);
		},
		currentRouteName
	};
};
