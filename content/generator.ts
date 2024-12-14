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

const error = (e) => console.error(chalk.red(e.stack));
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
	userId: process.env.PLAYHT_USER_ID as string,
});
const car_footage_path = resolve('/Users/artem/project/car_defects/cars_footage');

try {
	const file = './content/topics.txt';
	const topics = readFileSync(file).toString().split('\n');
	// !FIXME
	const video = new Video({
		name: 'audi-a4-vs-lexus-is-durability',
		key: 'age',
		defects: {
			"lexus is": {
				"0": "0.55344086484359146225",
				"1": "0.55344086484359146225",
				"2": "0.66105436634095646880",
				"3": "0.76866786783832147535",
				"4": "0.69180108105448932782",
				"5": "0.69180108105448932782",
				"6": "0.76866786783832147535",
				"7": "0.76866786783832147535",
				"8": "0.90702808404921934091"
			},
			"audi a4": {
				"0": "0.63826000503243465506",
				"1": "0.68735692849646809007",
				"2": "0.83464769888856839508",
				"3": "0.99421270014667705885",
				"4": "1.0433096236107105",
				"5": "1.1046807779407523",
				"6": "1.0433096236107105",
				"7": "0.95739000754865198260",
				"8": "1.0801323162087356"
			}
		},
		topic: 'audi a4 vs lexus is durability'
	}, car_footage_path);
	video.loadScript().then(() => video.generateVideo());
	// generateTopics(topics);
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
			info(`✅ "${unposted}"`);
			saveTopic(topics);
			// return generateTopics(topics);
		});
}

function generateByTopic(topic: string) {
	return Promise.resolve(['lexus is', 'audi a4'])
		// TODO
		// chatGpt
		// .getCars(topic)
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

							!article.isExists &&
							anthropicAI
								.generate({
									system: article.system,
									contents: article.contents
								})
								// chatGpt
								// 	.generate({
								// 		locale: article.locale,
								// 		system: article.system,
								// 		contents: article.contents
								// 	})
								.then(article.save),

							article.needVideo && (() => {
								const youtube = new Youtube(process.env.YOUTUBE_API_KEY as string, car_footage_path);

								const video = new Video({
									name: article.name,
									key: article.key,
									defects,
									topic
								}, car_footage_path);
								return video.store()
									.then(() => {
										if (video.isScriptExists) {
											return video.loadScript();
										}
										return anthropicAI
											.generate({ contents: video.contents })
											.then(video.save);
									}).then(() => {
										if (!video.isVoiceExists) {
											return playht.generateVoice(video.voicePath, video.script);
										}
									}).then(() => {
										if (video.isVideoExists) { return; }
										// TODO
										// return chain(video.cars.map((car) => () => youtube.getVideos(car)))
										// 	.then(() => video.generateVideo());
										return video.generateVideo();
									});
							})().then(info, (e) => { debugger; })
						]) as unknown as Promise<void>
				);
			// return Promise.all(articlesGenerating);
			return chain<void>(articlesGenerating);
		});
}
