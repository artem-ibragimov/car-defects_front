import chalk from 'chalk';
import { readFileSync, writeFileSync } from 'fs';

import * as dotenv from 'dotenv';
import { Article, Locale } from './generator/Article';
import { Video } from './generator/Video';
import { CarDefects } from './generator/api/CarDefects';
import { AnthropicAI } from './generator/api/Claude';
import { ChatGPT } from './generator/api/OpenAi';
import { Playht } from './generator/api/Playht';
import { Youtube } from './generator/api/Youtube';
import { chain } from './generator/utils';
import { resolve } from 'path';
dotenv.config();

const error = (e) => {
	console.error(chalk.red(e.stack));
};
const info = (i) => {
	console.log(chalk.green(i));
};

const chatGpt = new ChatGPT({
	apiKey: process.env.CHAT_GPT_API_KEY as string,
	organization: process.env.CHAT_GPT_ORG_ID as string
});
const anthropicAI = new AnthropicAI(process.env.ANTHROPIC_API_KEY as string);
const playht = new Playht({
	apiKey: process.env.PLAYHT_API_KEY as string,
	userId: process.env.PLAYHT_USER_ID as string
});
const car_footage_path = resolve('/Users/artem/project/car_defects/cars_footage');
const bg_music_folder = resolve('/Users/artem/project/car_defects/soundtrack');

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
		.then(() => {
			const unpostedIndex = topics.findIndex((t) => t == unposted);
			topics[unpostedIndex] = `${topics[unpostedIndex]}:generated`;
			info(`✅ ${unposted}`);
			saveTopic(topics);
			// return generateTopics(topics);
		})
		.catch(error);
}

function generateByTopic(topic: string) {
	return chatGpt
		.getCars(topic)
		.then((cars = []) => {
			if (topic.includes(' vs ')) {
				return cars.slice(0, topic.split(' vs ').length);
			}
			return cars;
		})
		.then((cars = []) => {
			info(`Select ${cars} for topic ${topic}`);
			return cars;
		})
		.then(CarDefects.searchForCars)
		.then(CarDefects.removeDublicates)
		.then(CarDefects.getDefects({ byMilage: topic.includes('miles') }))
		.then(({ cars, defects, dataParams, hash }) => {
			const articlesGenerating = (['en', 'ru', 'es', 'de'] as Locale[])
				.map((locale) => new Article({ topic, cars, defects, dataParams, locale, hash }))
				.map(
					(article) => () =>
						Promise.all([
							// Promise.all([
							article.needPoster &&
								chatGpt
									.generateImg({ name: article.name, prompt: article.poster })
									.then(info, error),
							Promise.resolve(
								!article.isExists &&
									// anthropicAI
									// 	.generate({
									// 		system: article.system,
									// 		contents: article.contents
									// 	})
									chatGpt
										.generate({
											system: article.system,
											contents: article.contents
										})
										.then(article.save)
							).then(() => {
								article.needVideo &&
									(() => {
										const youtube = new Youtube(
											process.env.YOUTUBE_API_KEY as string,
											car_footage_path
										);
										const video = new Video(
											{
												norm: !!dataParams.norm,
												title: article.title,
												keywords: article.keywords,
												description: article.description,
												name: article.name,
												key: article.key,
												defects,
												topic
											},
											bg_music_folder
										);
										return video
											.store()
											.then(() => {
												if (video.isScriptExists) {
													return video.loadScript();
												}
												return chatGpt //anthropicAI
													.generate({ contents: video.contents })
													.then(video.save)
													.then(info);
											})
											.then(() => {
												if (!video.isVoiceExists) {
													return playht.generateVoice(video.voicePath, video.script).then(info);
												}
											})
											.then(() => {
												if (video.isVideoExists) {
													return;
												}
												return video
													.setDuration()
													.then(() => video.generateVideo(youtube.getVideo, hash));
											});
									})();
							})
						]) as unknown as Promise<void>
				);
			// return Promise.all(articlesGenerating);
			return chain<void>(articlesGenerating);
		});
}
