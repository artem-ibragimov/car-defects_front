import { readFile, writeFile } from 'node:fs/promises';
type Key = 'age' | 'mileage';

export class VideoPrompt {
	static log(cfg: {
		filename: string;
		url: string;
		defects: Record<string, Record<number, number>>;
		topic: string;
		dataParams: { by_mileage?: boolean };
	}) {
		const filename = './content/' + cfg.filename + '.txt';
		const key: Key = cfg.dataParams.by_mileage ? 'mileage' : 'age';

		const data = `-------------------------
      ${cfg.url}
      According to the car service calls statistics: 
      ${JSON.stringify(cfg.defects)}, 
      where the key is the ${key} of the car at the time of contacting the car service, 
      and the value is  number of service calls per 10000 cars sold. 
      Step by step analyze the data, 
      compare the each car this others in terms of reliability,
      draw conclusions, explain the results from the technical point of view, 
      describe the design features of the cars, use maximum technical details,
      - Highlight any significant differences between the models.
      - Consider the implications of the data for potential car buyers.
      Use clear, concise language suitable for a technical audience.
      - Incorporate relevant keywords naturally throughout the text.
      - Include subheadings to break up the content and improve readability.
      - Include a brief explanation of what service calls indicate about car reliability.
      - Vary sentence structure and use transitions between paragraphs to create a natural, human-like flow.
      - Maintain a professional tone while occasionally incorporating conversational elements to engage the reader.
      generate a short video about "${cfg.topic}", 
      need to use north male voice, 
      Limit video up to 59 sec, place captions at the bottom, 
      use calm and serious soundtrack.
      `;
		return readFile(filename)
			.then((val) => val.toString())
			.then((content) => writeFile(filename, `${content}\n\n${data}`))
			.then(() => `video prompt is ready`);
	}
}
