import { readFileSync, writeFileSync } from 'fs';
import SocialPost from 'social-post-api';

const social = new SocialPost('66H3ABB-NZ9MW1R-M6MWFSA-6VHPXRW');

try {
	const file = './content/posted.txt';
	const posted = readFileSync(file).toString().split('\n');
	const json = JSON.parse(readFileSync(`src/lib/i18n/article_en.json`).toString());
	const poster = Object.keys(json.text.article)
		.filter((t) => !posted.includes(t))
		.pop();
	const link = `https://car-defects.com/articles/en/${poster}/`;
	const read_more = `...\n\nRead more: ${link}`;
	post({
		mediaUrls: [`https://car-defects.com/assets/img/${poster}.png`],
		keywords: json.text.article[poster].tikeywordstle,
		title: json.text.article[poster].title.slice(0, 280),
		post: `${json.text.article[poster].description
			.replaceAll('\n', '')
			.slice(0, 280 - read_more.length - `[Sent with Free Plan] `.length)}${read_more}`,
		link
	})
		.then(console.log, console.error)
		.then(() => {
			writeFileSync(file, posted.concat(poster).join('\n'));
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
