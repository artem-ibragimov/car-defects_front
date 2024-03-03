import * as en from '$lib/i18n/en.json';

const articles = Object.fromEntries(
	// Object.keys(en.text.article).map((article) => [article, `/${article}`])
	Object.keys({}).map((article) => [article, `/${article}`])
);

export const ROUTE_NAMES = {
	MAIN: '/',
	ADD_DATA: '/add_data',
	LOADING: '/loading',
	CHART_ONLY: '/chart_only',
	ARTICLE: articles
};
