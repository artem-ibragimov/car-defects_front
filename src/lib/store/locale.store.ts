// import { restore, store } from '$lib/util/hashStore';
import { dictionary, locale } from 'svelte-i18n';
import { derived, type Writable, writable } from 'svelte/store';
import { AVAILABLE_LOCALES, DICTIONARIES } from '../i18n';

const DEFAUL_LOCALE =
	(typeof navigator !== 'undefined' &&
		(AVAILABLE_LOCALES.find((l) => navigator.language.startsWith(l)) ||
			AVAILABLE_LOCALES.find((l) => navigator.languages.includes(l)))) ||
	AVAILABLE_LOCALES[0];

// const LOCALE_HASH_KEY = 'locale';

export const creatLocaleStore = () => {
	const locales: Writable<{ icon: string; selected?: boolean; value: string }[]> = writable([
		{
			icon: '/public/assets/icon/en.webp',
			selected: false,
			value: 'en'
		},
		{
			icon: '/public/assets/icon/ru.webp',
			selected: false,
			value: 'ru'
		}
	]);

	dictionary.set(DICTIONARIES);
	// locale.set(restore(LOCALE_HASH_KEY) || DEFAUL_LOCALE);
	locale.set(DEFAUL_LOCALE);
	locale.subscribe((v) => {
		locales.update((ls) => ls.map((l) => ({ ...l, selected: l.value === v })));
		// store(LOCALE_HASH_KEY, v || DEFAUL_LOCALE);
	});

	const selected = derived(locales, (ls) => ls.find((l) => !!l.selected)?.value);

	return {
		locales,
		selected,
		select(v: string) {
			locale.set(v);
		}
	};
};
