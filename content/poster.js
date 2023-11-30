import { readFileSync, writeFileSync } from 'fs';
import SocialPost from 'social-post-api';

const social = new SocialPost('66H3ABB-NZ9MW1R-M6MWFSA-6VHPXRW');

try {
	const file = './content/posted.txt';
	const posted = readFileSync(file).toString().split('\n');
	const json = JSON.parse(readFileSync(`src/lib/i18n/en.json`).toString());
	const poster = Object.keys(json.text.article).filter((t) => !posted.includes(t))[0];
	const link = `https://car-defects.com/articles/en/${poster}/`;
	const read_more = `...\n\nRead more: ${link}`;
	post({
		mediaUrls: [`https://car-defects.com/assets/img/${poster}--640.webp`],
		title: json.text.article[poster].title,
		post: `${json.text.article[poster].text.slice(
			0,
			280 - read_more.length - `[Sent with Free Plan] `.length
		)}${read_more}`,
		link
	})
		.then(() => {
			writeFileSync(file, posted.concat(poster).join('\n'));
		})
		.catch(console.error);
} catch (error) {
	console.error(error);
}

function post({ title, post, link, mediaUrls }) {
	return social
		.post({
			post,
			shortenLinks: false,
			// mediaUrls,
			platforms: ['facebook', 'twitter', /* 'reddit' "pinterest"*/],
			max: 3,           // optional, range 1-5
			position: "auto",  // optional, "auto" or "end"
			pinterestOptions: { title, link },
			redditOptions: { title, link }
		})
		.then((res) => {
			if (res.status === 'error') {
				throw res;
			}
		});
}
