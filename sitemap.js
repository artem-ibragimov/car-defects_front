import chalk from 'chalk';
import { readdirSync, statSync, writeFileSync } from 'fs';
import path from 'path';

const error = (e) => console.error(chalk.red(e));

try {
	createSiteMap('./build', {
		changefreq: 'always',
		lastmod: new Date().toISOString(),
		priority: 0.9,
		origin: 'https://car-defects.com'
	});
} catch (e) {
	error(e);
}

function createSiteMap(dir, options) {
	const paths = collectPaths(dir);
	const non_articles_paths = paths.filter((p) => !/article/.test(p));
	const articles_paths = Object.values(
		paths
			.filter((p) => /article/.test(p))
			.reduce((acc, p) => {
				const paths = p.split('/').filter((p) => p !== '');
				acc[paths[paths.length - 1]] = [
					...(acc[paths[paths.length - 1]] || []),
					[paths[paths.length - 2], p]
				];
				return acc;
			}, {})
	);
	writeFileSync(
		path.resolve(dir, 'sitemap.xml'),
		`<?xml version="1.0" encoding="UTF-8"?>
	<urlset
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd
		http://www.w3.org/1999/xhtml http://www.w3.org/2002/08/xhtml/xhtml1-strict.xsd"
		xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
		xmlns:xhtml="http://www.w3.org/1999/xhtml"   
	>
${non_articles_paths
			.map((p) => `	\t<url>
		\t<loc>${options.origin}${p}</loc>
		\t<lastmod>${options.lastmod}</lastmod>
		\t<changefreq>${options.changefreq}</changefreq>
		\t<priority>${options.priority}</priority>
	\t</url>`)
			.join('\n')}
	${articles_paths
			.map(
				(locales) =>
					`\t<url>
	\t<loc>${options.origin}${locales.find(([lang, _]) => lang === 'en')[1]}</loc>
	\t<lastmod>${options.lastmod}</lastmod>
	\t<changefreq>${options.changefreq}</changefreq>
	\t<priority>${options.priority}</priority>
${locales
						.map(
							([lang, path]) =>
								`	\t<xhtml:link rel="alternate" hreflang="${lang}" href="${options.origin}${path}"/>`
						)
						.join('\n')}
	</url>`
			)
			.join('\n')}
</urlset>`
	);
}

/**
 * @param {string} root
 * @returns {string[]}
 */
function collectPaths(root) {
	const paths = readdirSync(root).map((entity_name) => path.join(root, entity_name));
	const dir_paths = paths.filter((p) => !p.includes('.'));
	return paths
		.filter((p) => p.includes('index.html'))
		.map((p) => p.replace(/build|index\.html/gi, ''))
		.concat(...dir_paths.map(collectPaths));
}
