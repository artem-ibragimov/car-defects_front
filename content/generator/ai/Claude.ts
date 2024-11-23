import Anthropic from '@anthropic-ai/sdk';
import { chain } from '../utils';

export class AnthropicAI {
	anthropic: Anthropic;

	constructor(apiKey: string) {
		this.anthropic = new Anthropic({ apiKey });
	}

	generate = (params: {
		system: string;
		contents: Record<string, string>;
	}): Promise<Record<string, string>> => {
		const messages = Object.entries(params.contents).map(([name, content]) => ({ name, content }));

		const generating = messages.map(
			(message) => (results: Record<string, string>) =>
				this.anthropic.messages
					.create({
						model: 'claude-3-5-sonnet-latest',
						max_tokens: 8192,
						temperature: 0.1,
						system: params.system,
						messages: [{ role: 'user', content: message.content }]
					})
					.then((res) => {
						if (res.content[0].type === 'text') {
							results[message.name] = res.content[0].text;
						}
						return results;
					})
		);

		return chain<Record<string, string>>(generating, {});
	};

	generateWithBatches = ({
		system,
		contents
	}: {
		system: string;
		contents: Record<string, string>;
	}) => {
		return this.anthropic.beta.messages.batches
			.create({
				requests: Object.entries(contents).map(([custom_id, content]) => ({
					custom_id,
					params: {
						model: 'claude-3-5-sonnet-20241022',
						max_tokens: 8192,
						system,
						messages: [{ role: 'user', content }]
					}
				}))
			})
			.then((batch) => this.wait(batch.id))
			.then(async (id) => {
				const data = {};
				for await (const result of await this.anthropic.beta.messages.batches.results(id)) {
					if (
						result.result.type === 'succeeded' &&
						result.result.message.content[0]?.type === 'text'
					) {
						data[result.custom_id] = result.result.message.content[0].text;
					}
				}
				return data;
			});
	};
	private wait(id: string): Promise<string> {
		return this.anthropic.beta.messages.batches.retrieve(id).then((res) => {
			if (res.processing_status === 'ended') {
				return id;
			}
			console.log(res.id, res.processing_status, res.request_counts);
			return waitMin().then(() => this.wait(id));
		});
	}
}

function waitMin(delay = 1) {
	return new Promise((r) => {
		setTimeout(r, delay * 60 * 1000);
	});
}
