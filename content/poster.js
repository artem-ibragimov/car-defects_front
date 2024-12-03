import { readdirSync, readFileSync, writeFileSync } from 'fs';
import SocialPost from 'social-post-api';

const social = new SocialPost('66H3ABB-NZ9MW1R-M6MWFSA-6VHPXRW');

try {
	const file = './content/posted.txt';
	const posted = readFileSync(file).toString().split('\n');
	const articles = Array.from(
		new Set(
			readdirSync('./src/lib/i18n/article').map((file_name) =>
				file_name.slice(0, file_name.indexOf('.'))
			)
		)
	);
	const article_name = articles.filter((t) => !posted.includes(t)).pop();

	if (!article_name) {
		process.exit();
	}

	const content = JSON.parse(
		readFileSync(`./src/lib/i18n/article/${article_name}.en.json`, 'utf-8')
	).text.article[article_name];
	const link = `https://car-defects.com/articles/en/${article_name}/`;
	const read_more = `...\n\nRead more: ${link}`;
	content &&
		post({
			mediaUrls: [`https://car-defects.com/assets/img/${article_name}.png`],
			keywords: content.keywords,
			title: content.title.slice(0, 150),
			post: `${content.description
				.replaceAll('\n', '')
				.slice(0, 280 - read_more.length - `[Sent with Free Plan] `.length)}${read_more}`,
			link
		})
			.then(console.log, console.error)
			.then(() => {
				writeFileSync(file, posted.concat(article_name).join('\n'));
			});
} catch (error) {
	console.error(error);
}

function post({ title, post, keywords, link, mediaUrls }) {
	const cfg = {
		post,
		keywords,
		shortenLinks: false,
		max: 3, // optional, range 1-5
		position: 'auto' // optional, "auto" or "end"
	};
	return Promise.all([
		social
			.post({
				...cfg,
				platforms: ['facebook', 'twitter']
			})
			.then((res) => {
				if (res.status === 'error') {
					throw res;
				}
			})
			.then(console.log, console.error),

		social
			.post({
				...cfg,
				mediaUrls,
				platforms: ['pinterest'],
				pinterestOptions: { title, link, mediaUrls }
			})
			.then((res) => {
				if (res.status === 'error') {
					throw res;
				}
			})
			.then(console.log, console.error)
	]);
}
