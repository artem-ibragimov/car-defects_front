import chalk from 'chalk';
import { readFileSync, writeFileSync } from 'fs';

import * as dotenv from 'dotenv';
import { Article } from './generator/Article';
import { CarDefects } from './generator/CarDefects';
import { VideoPrompt } from './generator/Video';
import { AnthropicAI } from './generator/ai/Claude';
import { ChatGPT } from './generator/ai/OpenAi';
dotenv.config();

const error = (e) => console.error(chalk.red(e.stack));
const warn = (w) => console.warn(chalk.yellow(w));
const info = (i) => console.log(chalk.green(i));

const chatGpt = new ChatGPT({
	apiKey: process.env.CHAT_GPT_API_KEY as string,
	organization: process.env.CHAT_GPT_ORG_ID as string
});
const anthropicAI = new AnthropicAI(process.env.ANTHROPIC_API_KEY as string);

try {
	const file = './content/topics.txt';
	const topics = readFileSync(file).toString().split('\n');
	generateTopics(topics);
} catch (e) {
	error(e);
}
function saveTopic(topics = []) {
	try {
		const file = './content/topics.txt';
		writeFileSync(file, topics.join('\n'));
	} catch (e) {
		error(e);
	}
}

function generateTopics(topics) {
	const unposted = topics.find((t) => !t.includes(':generated'));
	if (!unposted) {
		return Promise.resolve(topics);
	}
	return generateByTopic(unposted)
		.catch(error)
		.then(() => {
			const unpostedIndex = topics.findIndex((t) => t == unposted);
			topics[unpostedIndex] = `${topics[unpostedIndex]}:generated`;
			info(`${unposted} done`);
			saveTopic(topics);
			// return generateTopics(topics);
		});
}

function generateByTopic(topic: string) {
	return chatGpt
		.getCars(topic)
		.then((cars = []) => {
			info(`Select ${cars} for topic ${topic}`);
			return cars;
		})
		.then(CarDefects.searchForCars)
		.then(CarDefects.removeDublicates)
		.then(CarDefects.getDefects({ byMilage: topic.includes('miles') }))
		.then(({ cars, defects, dataParams, url }) => {
			const article = new Article({ topic, cars, defects, dataParams, locale: 'en', url });
			return Promise.all([
				chatGpt
					.generateImg({
						name: article.name,
						prompt: article.poster
					})
					.then(info, error),

				!article.isExists &&
					anthropicAI
						.generateChapters({
							system: article.system,
							contents: article.contents
						})
						.then(article.save)
						.then((data) =>
							VideoPrompt.log({
								url: `https://car-defects.com/articles/en/${article.name}`,
								filename: 'video',
								dataParams,
								...data,
								defects,
								topic
							})
						)
						.then(info, error)
			]);
		});
}
