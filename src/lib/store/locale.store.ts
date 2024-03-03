import { dictionary, locale } from 'svelte-i18n';
import { derived } from 'svelte/store';
import { AVAILABLE_LOCALES, DICTIONARIES } from '../i18n';

const DEFAUL_LOCALE =
	(typeof navigator !== 'undefined' &&
		(AVAILABLE_LOCALES.find((l) => navigator.language.startsWith(l)) ||
			AVAILABLE_LOCALES.find((l) => navigator.languages.includes(l)))) ||
	AVAILABLE_LOCALES[0];

export const creatLocaleStore = () => {
	init(DEFAUL_LOCALE);
	dictionary.set(DICTIONARIES);
	locale.subscribe((v) => {
		if (!v || !AVAILABLE_LOCALES.includes(v)) {
			return;
		}
		if (v in DICTIONARIES) {
			return dictionary.set({
				[v as keyof typeof DICTIONARIES]: DICTIONARIES[v as keyof typeof DICTIONARIES]
			});
		}
		// getDictionary(v).then((d) => {
		// 	DICTIONARIES[v] = d;
		// 	dictionary.set(DICTIONARIES);
		// });
	});
	const selected = derived(locale, (l) => l);

	function init(v: string) {
		return locale.set(v);
	}
	return {
		selected,
		init
	};
};
