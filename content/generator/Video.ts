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
		const key: Key = cfg.dataParams.by_mileage ? 'mileage' : 'age';

		const data = `-------------------------
      ${cfg.url}
      ${cfg.title}
      ${cfg.description}
      ${cfg.keywords}
      --
      You are tasked with creating an engaging viral YouTube short video script for potential car buyers, 
      comparing the reliability of specific car models. 
      Your script should be informative, objective, and engaging, 
      emulating the style of top automotive journalists. 
      Follow these instructions carefully:

1. First, review the car service call statistics data provided:
<data>
 ${JSON.stringify(cfg.defects)}, 
</data>
This data represents the number of service calls per 10,000 cars sold, 
with the key being the ${key} of the car at the time of contacting the car service.

2. You will be comparing the following cars in terms of reliability:
<cars>
${Object.keys(cfg.defects)}
</cars>

3. Analyze the data and create a script that:
   - Cites sources for your information when applicable
   - Provides clear arguments backed by data
   - Uses charts or tables to make comparisons more objective
   - Avoids repetitive sentences
   - Includes technical details while keeping the content accessible
   - Uses mid-frequency words throughout the analysis

4. Your script should have the following elements:
   - An attention-grabbing introduction
   - A brief explanation of the data and its significance
   - A comparison of the reliability of the specified car models
   - Key findings and insights
   - A conclusion with recommendations for potential car buyers

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
      don't use absolute values, compare car reliability relatively of each car
      use north male voice, 
      Limit video up to 59 sec, place captions at the bottom, 
      scenes should be  at least 5 sec long,
      use calm and serious soundtrack.
      `;
		return readFile(filename)
			.then((val) => val.toString())
			.then((content) => writeFile(filename, `${content}\n\n${data}`))
			.then(() => `video prompt is ready`);
	}
}
