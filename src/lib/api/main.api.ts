import { PUBLIC_ORIGIN } from '$env/static/public';
import { createAuthorAPI } from '$lib/api/data/author.api';
import { createBrandAPI } from '$lib/api/data/brand.api';
import { createCountryAPI } from '$lib/api/data/country.api';
import { createDefectAPI } from '$lib/api/data/defect.api';
import { createEngineAPI } from '$lib/api/data/engine.api';
import { createGenAPI } from '$lib/api/data/gen.api';
import { createModelAPI } from '$lib/api/data/model.api';
import { createSearchAPI } from '$lib/api/data/search.api';
import { createTransAPI } from '$lib/api/data/trans.api';
import { createVersionAPI } from '$lib/api/data/version.api';

const http = {
	get: <T = void>(path: string, params: Record<string, string> = {}): Promise<T> => {
		const query = `${new URLSearchParams(params)}`;
		return fetch(`${PUBLIC_ORIGIN}${path}${query ? `?${query}` : ''}`).then((res) => res.json());
	},

	post: <T = void>(
		path: string,
		params: Record<string, string> | string | string = {}
	): Promise<T> =>
		fetch(`${PUBLIC_ORIGIN}${path}`, {
			method: 'POST',
			body: JSON.stringify(params),
			headers: { 'content-type': 'application/json' }
		}).then((res) => res.json()),

	patch: <T = void>(path: string, params: Record<string, string> = {}): Promise<T> =>
		fetch(`${PUBLIC_ORIGIN}${path}`, {
			method: 'PATCH',
			body: JSON.stringify(params),
			redirect: 'follow'
		}).then((res) => res.json()),

	delete: <T = void>(path: string, params: Record<string, string> = {}): Promise<T> =>
		fetch(`${PUBLIC_ORIGIN}${path}`, {
			method: 'DELETE',
			body: JSON.stringify(params),
			redirect: 'follow'
		}).then((res) => res.json())
};

export const API = {
	brand: createBrandAPI(http),
	model: createModelAPI(http),
	gen: createGenAPI(http),
	version: createVersionAPI(http),
	engine: createEngineAPI(http),
	trans: createTransAPI(http),
	defect: createDefectAPI(http),
	search: createSearchAPI(http),
	author: createAuthorAPI(http),
	country: createCountryAPI(http)
};
