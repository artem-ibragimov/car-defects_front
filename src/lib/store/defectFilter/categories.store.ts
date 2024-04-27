import type { IDefectData } from '$lib/api/data/defect.api';
import { store } from '$lib/util/hashStore';
import { get, writable } from 'svelte/store';

export function createCategoriesParams(
	api: { getDefectsCategories(): Promise<IDefectData> },
	onerror: (e: Error) => void
) {
	const CATEGORIES_HASH_KEY = 'defect_categories';
	const SEPARATOR = ',';
	const categories = writable<ICategory[]>([]);

	function init(selected_categories_labels: string[] = []) {
		return api
			.getDefectsCategories()
			.then((res) => {
				categories.set(
					Object.entries(res).map(([value, label]) => ({
						value,
						label,
						selected: selected_categories_labels.includes(label)
					}))
				);
			})
			.catch(onerror)
			.then(serialize);
	}
	function getCategoriesSerialized(): string {
		const cats = get(categories);
		const selected = cats.filter((c) => c.selected).map((c) => c.value);
		return (selected.length ? selected : cats.map((c) => c.value)).join(SEPARATOR);
	}

	function serialize() {
		return JSON.stringify({ categories: get(categories) });
	}
	function deserialize(s: string) {
		try {
			const deserialized = JSON.parse(s) as { categories: ICategory[] };
			categories.set(deserialized.categories);
		} catch (e) {
			onerror(e as Error);
		}
	}

	return {
		init,
		csr(s?: string) {
			return s ? deserialize(s) : init();
		},
		categories,
		setCategories(v: Record<string, boolean>) {
			if (Object.keys(v).length === 0) {
				return;
			}
			categories.update((cats) => cats.map((c) => ({ ...c, selected: v[c.value] })));
			const cats = getCategoriesSerialized();
			if (cats) {
				store(CATEGORIES_HASH_KEY, cats);
			}
		},
		getCategories: getCategoriesSerialized
	};
}

type ICategory = {
	value: string;
	selected: boolean;
	label: string;
};
