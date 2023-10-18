import type { IEntity } from '$lib/api/data/defect.api';
import { restore, store } from '$lib/util/hashStore';
import { filterNullable } from '$lib/util/tools';
import { derived, get, writable } from 'svelte/store';

const ENTITY_HASH_KEY = 'entity_params';
const COLORS = [
	'#4dc9f6',
	'#f67019',
	'#f53794',
	'#537bc4',
	'#acc236',
	'#166a8f',
	'#00a950',
	'#58595b',
	'#8549ba'
];

export function createEntityParams() {
	const entities = writable<Record<string, IEntity>>(JSON.parse(restore(ENTITY_HASH_KEY) || '{}'));
	const selectedEntities = writable<Record<string, boolean>>({});

	const noChartData = derived([entities], ([data]) => Object.keys(data).length === 0);

	entities.subscribe((v) => {
		selectedEntities.update((prev) =>
			Object.fromEntries(Object.keys(v).map((k) => [k, prev[k] !== false]))
		);
		const entities = JSON.stringify(v);
		console.info(entities);
		if (Object.keys(v).length !== 0) {
			store(ENTITY_HASH_KEY, entities);
		}
	});

	const colors = derived(selectedEntities, (s) => {
		return Object.fromEntries(
			Object.entries(s)
				.filter(([_, selected]) => selected)
				.map(([k, _], i) => [k, COLORS[i]])
		);
	});

	function selectEntities(state: Record<string, boolean>) {
		selectedEntities.update((prev) => Object.assign(prev, state));
	}

	function getEntities(): [string, IEntity][] {
		return Object.entries(get(entities));
	}

	return {
		noChartData,
		selectedEntities,
		entities,
		colors,
		getEntity(name: string) {
			return get(entities)[name];
		},
		getEntities,
		deleteEntity(name): void {
			entities.update((prev) => {
				delete prev[name];
				return prev;
			});
		},
		selectEntities,
		resetEntities() {
			entities.set({});
		},
		addEntity(name: string, params: IEntity) {
			entities.update((prev) => Object.assign(prev, { [name]: filterNullable(params) }));
		}
	};
}
