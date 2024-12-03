// const articles = Object.fromEntries(
// 	Object.keys(en.text.article).map((article) => [article, `/${article}`])
// 	// Object.keys({}).map((article) => [article, `/${article}`])
// );
import articles from '$lib/i18n/articles.json';

export const ROUTE_NAMES = {
	MAIN: '/',
	ADD_DATA: '/add_data',
	LOADING: '/loading',
	CHART_ONLY: '/chart_only',
	ARTICLE: articles
};
