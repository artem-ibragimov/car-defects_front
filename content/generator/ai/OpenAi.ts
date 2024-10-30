import { createWriteStream } from 'fs';
import { get } from 'https';
import { readFile } from 'node:fs/promises';
import { OpenAI } from 'openai';

export class ChatGPT {
	private openai: OpenAI;
	constructor({ apiKey, organization }: { apiKey: string; organization: string }) {
		this.openai = new OpenAI({
			apiKey,
			organization,
			dangerouslyAllowBrowser: true
		});
	}
	getCars(topic: string) {
		return this.openai.chat.completions
			.create({
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'user',
						content: `you are writing the article "${topic}" about car reliability comparison.
									generate the list of 4 car names that will be compared in the article, 
									and obligatorily add the car names from the title on top, 
									select only cars of the same class and sort by sales in the USA`
					}
				],
				temperature: 0.1
			})
			.then(
				(v) =>
					v.choices[0].message.content
						?.split('\n')
						.filter((line) => /\d+\.\s*/.test(line))
						.map((c) => c.replace(/\d+\.\s*/, '').trim())
						.filter(Boolean) || []
			);
	}

	generateImg({ prompt, name }) {
		return readFile(`./static/assets/img/${name}.png`)
			.catch(() =>
				this.openai.images
					.generate({
						model: 'dall-e-3',
						prompt,
						size: '1792x1024',
						quality: 'standard',
						n: 1
					})
					.then((res) => downloadImage(res.data[0].url, `./static/assets/img/${name}.png`))
			)
			.then(() => `ChatGPT has generated the ${name} image`);
	}
}

function downloadImage(url, filename) {
	return new Promise((resolve, reject) => {
		get(url, (res) => {
			res
				.pipe(createWriteStream(filename))
				.on('error', reject)
				.once('close', () => resolve(filename));
		});
	});
}
