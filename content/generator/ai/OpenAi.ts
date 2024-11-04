import { createReadStream, createWriteStream } from 'fs';
import { get } from 'https';
import { readFile, writeFile } from 'node:fs/promises';
import { OpenAI } from 'openai';
import { safeJSON } from 'openai/core.mjs';

export class ChatGPT {
	private openai: OpenAI;
	constructor({ apiKey, organization }: { apiKey: string; organization: string }) {
		this.openai = new OpenAI({
			apiKey,
			organization,
			dangerouslyAllowBrowser: true
		});
	}

	generateChapters = ({
		system,
		contents
	}: {
		system: string;
		contents: Record<string, string>;
	}) => {
		const filename = 'batchinput.jsonl';

		const requests = Object.entries(contents)
			.map(([custom_id, content]) => ({
				custom_id,
				method: 'POST',
				url: '/v1/chat/completions',
				body: {
					model: 'gpt-4o-2024-08-06',
					max_tokens: 8192,
					messages: [
						{ role: 'system', content: system },
						{ role: 'user', content }
					]
				}
			}))
			.map((r) => JSON.stringify(r))
			.join('\n');

		return (
			writeFile(filename, requests)
				// .then(() => {
				// 	return this.openai.files.create({
				// 		file: createReadStream(filename),
				// 		purpose: 'batch'
				// 	});
				// })
				// .then((file) => {
				// return this.openai.batches
				// 	.create({
				// 		input_file_id: file.id,
				// 		endpoint: '/v1/chat/completions',
				// 		completion_window: '24h'
				// 	})
				// 	.then((batch) => this.wait(batch.id))
				// .then(() => this.openai.files.content(file.id))
				.then(() => this.openai.files.content('file-6Iu2uILAIQ3RUZ03U44MsgCE'))
				.then((fileResponse) => fileResponse.text())
				.then((fileContents) => {
					const responses = fileContents.split('\n');
					const jsons = responses.map(safeJSON).filter(Boolean);
					return jsons.reduce((acc, res) => {
						if (!res.response) {
							console.error(res);
							return acc;
						}
						acc[res.custom_id] = res.response.body.choices[0].message.content;
						return acc;
					}, {});
				})
				// })
				.catch((e) => {
					console.error(e);
					debugger;
				})
		);
	};

	getCars(topic: string) {
		return this.openai.chat.completions
			.create({
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'user',
						content: `you are writing the article "${topic}" about car reliability comparison.
									generate the list of 2 - 4 car names that will be compared in the article, 
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
	private wait(id: string): Promise<string> {
		return this.openai.batches.retrieve(id).then((res) => {
			if (res.status === 'failed') {
				throw new Error(JSON.stringify(res.errors, null, 2));
			}
			if (res.status === 'completed') {
				return id;
			}
			console.log(res.id, res.status, res.request_counts);
			return waitMin(10).then(() => this.wait(id));
		});
	}
}

function waitMin(delay = 1) {
	return new Promise((r) => {
		setTimeout(r, delay * 60 * 1000);
	});
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
