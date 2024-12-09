import { readFile, writeFile } from 'node:fs/promises';
type Key = 'age' | 'mileage';

export class VideoPrompt {
	static log(cfg: {
		filename: string;
		url: string;
		defects: Record<string, Record<number, number>>;
		topic: string;
		title: string;
		description: string;
		keywords: string;
		dataParams: { by_mileage?: boolean };
	}) {
		const filename = './content/' + cfg.filename + '.txt';

		const data = `-------------------------
      ${cfg.url}
      `;
		return readFile(filename)
			.then((val) => val.toString())
			.then((content) => writeFile(filename, `${content}\n\n${data}`))
			.then(() => `video prompt is ready`);
	}
}
