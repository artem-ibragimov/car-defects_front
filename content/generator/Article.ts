import { readFile, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';

type Key = 'age' | 'mileage';
type DefectData = Record<string, Record<number, number>>;
type Locale = 'en' | 'ru' | 'es' | 'de';

const LOCALED_QUERY: Record<Locale, string> = {
	en: `Write in English`,
	ru: `Write in Russian`,
	de: `Write in German`,
	es: `Write in Spanish`
};

export class Article {
	public readonly name: string;
	public readonly isExists: boolean = false;
	private locale: Locale = 'en';
	private topic: string;
	private url: string;
	private defects: DefectData;
	private cars: string[];
	private key: Key;

	constructor(cfg: {
		topic: string;
		url: string;
		defects: DefectData;
		cars: string[];
		locale?: Locale;
		dataParams: Partial<{ by_mileage: boolean; by_age: boolean }>;
	}) {
		this.name = `${cfg.topic}`.replace(/\?|\.|\!|\s/gi, '-').toLowerCase();
		this.topic = cfg.topic;
		this.defects = cfg.defects;
		this.cars = cfg.cars;
		this.url = cfg.url;
		this.locale = cfg.locale || 'en';
		this.key = cfg.dataParams.by_mileage ? 'mileage' : 'age';
		try {
			const data = readFileSync(this.filename, 'utf8');
			const json = JSON.parse(data);
			this.isExists = !!json.text.article[this.name];
		} catch {}
	}

	static readonly LOCALE: Record<Locale, string> = {
		en: `Write in English`,
		ru: `Write in Russian`,
		de: `Write in German`,
		es: `Write in Spanish`
	};

	get system() {
		return `
      You are an experienced automotive writer tasked with creating 
      an SEO-optimized chapter for an article on car reliability. 
      Your writing should be informative, objective, and engaging, 
      emulating the style of top automotive journalists.
      Aim for a professional, authoritative tone that combines 
      technical accuracy with accessibility for a general audience interested in car reliability.

      Here is the car service call statistics data you'll be analyzing:
      <service_call_data>
      ${JSON.stringify(this.defects)}
      </service_call_data>

      This data represents the number of service calls per 10,000 cars sold, 
      with the key being the ${this.key} of the car at the time of contacting the car service.

      You will be comparing the following cars in terms of reliability:

      <cars_to_compare>
      ${this.cars}
      </cars_to_compare>

      Your task is to create an in-depth analysis focusing on the following topic:

      <article_topic>
      ${this.topic}
      </article_topic>

      Include headers, subheaders, bullet points, and tables as appropriate. 
      Ensure that your writing is engaging and appeals to the reader, 
      using a mix of short and long sentences and occasional rhetorical questions. 
      Incorporate top auto journalist's writing style by using provocative and clickbait tone.

      Remember to:
      - Cite sources for your information when applicable
      - Provide clear arguments backed by data
      - Use charts or tables to make comparisons more objective
      - Avoid repetitive sentences
      - Include technical details while keeping the content accessible
      - Use mid-frequency words throughout the analysis

      Your output should be comprehensive, informative, and optimized for SEO purposes.
      Remember to focus on creating an informative, engaging, 
      and user-friendly content that will be valuable to potential 
      car buyers comparing the reliability of different models.
      ${LOCALED_QUERY[this.locale]}
      `;
	}

	get contents(): Contents {
		return {
			description: this.description,
			title: this.title,
			keywords: this.keywords,
			...this.chapters
		};
	}

	get poster() {
		return `${this.cars.join(' vs ')}, comic style, without text, fullscreen –ar 2:1 `;
	}

	private get title() {
		return `You are tasked with generating an SEO-optimized title for a technical article about about car reliability comparison. 
      The specific topic of the article is provided below:
         <topic>
         ${this.topic}
         </topic>

         Follow these guidelines to create an effective SEO title:

         1. Incorporate the main keyword(s) related to the topic and car reliability
         2. Make the title compelling and click-worthy
         3. Ensure the title accurately reflects the content of the article
         4. Use power words or numbers when appropriate
         5. Keep the title concise and to the point

         Your title should be no longer than 60 characters to ensure it displays properly in search engine results.
         Do not include any other options or variations. 
         Provide only one title option.`;
	}
	private get description() {
		return `
      You are tasked with generating an SEO description for a technical article on car reliability, focusing on the specific topic provided. This description should be optimized for search engines while accurately representing the content of the article.

      Here are the guidelines for creating an effective SEO description:
      - Keep the description between 150-160 characters long
      - Use natural language that flows well when read
      - Include the main keyword(s) related to the topic
      - Provide a clear and concise summary of what the article is about
      - Use action-oriented language to encourage clicks

      The specific topic for this technical article is:
      <topic>
      ${this.topic}
      </topic>

      Your task is to create a compelling SEO description that:
      1. Incorporates the provided topic
      2. Highlights the technical nature of the article
      3. Emphasizes the focus on car reliability
      4. Uses language that appeals to both search engines and potential readers

      Do not include any other options or variations. 
      Provide only one SEO description that best fits the given topic and guidelines.`;
	}
	private get keywords() {
		return `You are tasked with generating a short list of SEO keywords for a technical article. Your goal is to create a concise, relevant set of keywords that will help improve the article's search engine visibility.

         Guidelines for generating SEO keywords:
         - Focus on the main topic and key concepts of the article
         - Use specific, technical terms related to the subject
         - Consider both short-tail and long-tail keyword options
         - Aim for a mix of broad and specific keywords
         - Avoid overly generic terms

         Your output should be a list of less than 5 keywords, separated by commas.

         The topic of the technical article is:
         <topic>
         ${this.topic}
         </topic>

         Based on this topic, generate a list of SEO keywords that meet the above guidelines. 
         Remember to keep the list to fewer than 5 keywords and separate them with commas.
         Do not include any other options or variations. `;
	}
	private get chapters(): Chapters {
		return {
			service_call_analysis: `Your task is to write a chapter titled "Service Call Analysis" that thoroughly examines this data. 
            In your analysis, consider the following:

            - Highlight any significant differences between the models.
            - Consider the implications of the data for potential car buyers.

            Additionally, in your analysis:
            - Write down key statistics for each car model at different ages.
            - Calculate and compare percentage increases in service calls over time.
            - Identify and note the most reliable and least reliable models based on the data.

            write the chapter using the following structure:

            - Introduction
            - Overview of the car models being compared
            - Analysis of service call data
            - Insights

            Guidelines for your writing:

            - Use clear, concise language suitable for a technical audience.
            - Incorporate relevant keywords naturally throughout the text.
            - Include subheadings to break up the content and improve readability.
            - Include a brief explanation of what service calls indicate about car reliability.
            - Vary sentence structure and use transitions between paragraphs to create a natural, human-like flow.
            - Maintain a professional tone while occasionally incorporating conversational elements to engage the reader.

            SEO Optimization:
            - Use variations of key terms throughout the text.
            - Ensure the content provides valuable information to readers.

            Formatting Requirements:
            - Begin with the title "Service Call Analysis" as an H2 heading.
            - Format your output using markdown.
            - Use tables and charts when comparing values.
            - Aim for a length of 500-700 words.

            After completing your draft, 
            review it to ensure it meets all requirements and is engaging, 
            informative, and optimized for search engines.`,

			maintenance_cost_comparison: `You are an expert automotive content writer tasked with creating an SEO-optimized chapter titled 
            "Maintenance Cost Comparison" for a technical article about car reliability comparison. 
            Your goal is to produce informative, well-structured content that engages readers and ranks well in search engines.

            - Examine the given topic and identify key points to address.
            - Categorize maintenance costs (e.g., routine maintenance, unexpected repairs, age-related issues).
            - Estimate potential maintenance costs based on service call frequency.
            ${
							this.key === 'mileage'
								? `- Calculate and compare maintenance costs per mile or kilometer for each car model.
            - Compare maintenance costs at different mileage points (e.g., 30,000, 60,000, 90,000 miles).
            `
								: ``
						}
            
            - Identify factors that influence maintenance costs for each car model (e.g., build quality, availability of parts).
            - Identify trends in maintenance costs over time for each car model.
            - Design tables or charts to effectively compare maintenance costs across car models.

            Now, write the chapter following these guidelines:

            1. Structure:
            - 3-4 subsections, each focusing on a specific aspect of maintenance costs
            - Conclusions summarizing key points and takeaways

            2. Content:
            - Use factual information and data from your analysis to support comparisons
            - Include specific examples of maintenance costs for the car models or brands
            - Address common questions or concerns about maintenance costs
            - Incorporate insights from the defects data to strengthen arguments
            - Use tables or charts to compare maintenance costs across car models

            3. SEO Optimization:
            - Naturally incorporate the main keyword "maintenance cost comparison" throughout the text
            - Use related keywords and phrases such as "car reliability," "long-term ownership costs," and "vehicle upkeep expenses"

            4. Writing Style:
            - Clear, informative tone suitable for a technical article
            - Explain complex concepts using simple language
            - Engage the reader with rhetorical questions or thought-provoking statements where appropriate

            5. Formatting:
            Use Markdown formatting as follows:
            - Use ## for main section headings and ### for subsection headings
            - Use bullet points (-) for unordered lists and numbered lists (1., 2., 3.) for ordered lists
            - Use **bold** to emphasize important terms or phrases

            Your output should follow this structure:

            - Maintenance Cost Comparison
            [Introduction paragraph]

            - [Subsection Title 1]
            [Content for subsection 1, including relevant table ]

            - [Subsection Title 2]
            [Content for subsection 2, including relevant table ]

            - [Subsection Title 3]
            [Content for subsection 3, including relevant table ]

            - Conclusion
            [Summary of key points and takeaways]

            Remember to focus on the specific car models or brands mentioned in the <car_models> variable 
            and incorporate insights from the defects data throughout your content to provide concrete 
            examples and support your arguments. 
            Use tables or charts to effectively compare maintenance costs across different car models.
            Format your output using markdown`,
			common_issues_solutions: `You are tasked with generating an engaging and SEO-friendly "Common Issues and Solutions" chapter 
            for a technical article comparing the reliability of different car models. 
            Follow these instructions carefully to create high-quality content:

            1. Structure your "Common Issues and Solutions" chapter as follows:
               - Model-specific maintenance Issues and Solutions
            (for each car in the <cars> list)by


            2. When generating content:
               - Use the <topic> to guide your focus and ensure relevance.
               - Use transition words and phrases to improve readability and flow.

            3. Format your output using markdown:
               a. Use appropriate headings (H2 for main sections, H3 for subsections).
               c. Emphasize key points using bold or italic text.


            5. Employ human-written patterns throughout the content:
               a. Use varied sentence structures and lengths.
               b. Include rhetorical questions to engage the reader.
               c. Incorporate analogies or metaphors to explain complex concepts.
               d. Add personal touches, such as addressing the reader directly or sharing anecdotes.

            6. Ensure your final output is formatted in markdown.

            Remember to focus on providing valuable, actionable information for car owners 
            while maintaining an engaging and easy-to-read style. 
            Your goal is to create a comprehensive yet accessible guide 
            to common car issues and their solutions, 
            tailored to the specific models mentioned in the input data.`,
			buyers_guide: `You are tasked with generating a useful and engaging SEO chapter titled "Buyer's Guide" 
            for a technical article about car reliability comparison. 
            This guide is intended for potential car buyers and should be based on the provided information and data.

Provide recommendations for potential buyers based on your analysis. Consider factors such as:
   - Which models seem most reliable overall
   - Which models might be better for long-term ownership
   - Any notable strengths or weaknesses of specific models

Conclude with a summary of key takeaways and final thoughts for potential buyers.

Formatting and presentation guidelines:
- Use markdown formatting throughout the guide
- Break the content into clear, logical sections with appropriate headings
- Incorporate relevant keywords naturally throughout the text for SEO purposes

Remember to write in a style that mimics human-written patterns.
Avoid overly technical language and explain concepts in a way that's accessible to the average car buyer.

Ensure that the content is engaging, 
informative, and provides clear value to potential 
car buyers based on the reliability comparison and defects data provided.`,
			recall_campaigns: `You are tasked with writing an SEO-friendly and engaging chapter 
            titled "Recall campaigns" for an article comparing the reliability of different car models. 
            This chapter will focus on describing recall campaigns for the car models provided. 
            Follow these instructions to create the content:

2. The car models list is [${this.cars}]. For each car model in this list:
   a. Research recent recall campaigns (within the last 5 years) for that specific model.
   b. Identify the most significant or frequent issues that led to recalls.
   c. Note the number of vehicles affected and the severity of the problems.
   d. Mention how the manufacturer handled the recall (e.g., promptly, delayed response, etc.).

3. Present the information for each car model in the following structure:
   <car_model>
   <recall_info>
   - Brief description of the recall issue
   - Number of vehicles affected
   - Year of the recall
   - Severity of the problem (use terms like "minor," "moderate," or "severe")
   - Manufacturer's response
   </recall_info>
   </car_model>

4. To make the content SEO-friendly and engaging:
   b. Include relevant keywords naturally throughout the text (e.g., "car reliability," "vehicle recalls," "automotive safety").
   e. Include a brief comparison or summary after discussing all models, highlighting which models had the least and most concerning recall histories.

5. Conclude the chapter by:
   a. Summarizing the importance of considering recall history when assessing car reliability.
   b. Encouraging readers to stay informed about recalls for their specific vehicles.
   c. Providing a brief call-to-action, such as suggesting readers check for open recalls on their current vehicles.

Remember to maintain an objective tone throughout the chapter, 
presenting facts without bias towards any particular 
car model or manufacturer.
 Your goal is to provide valuable, accurate information to help readers make informed decisions about car reliability.

Format "Comparative Analysis" and "Recall Campaigns"
in the markdown table, but Summary and Recommendations write as markdown text
`,
			faq: `You are tasked with generating an engaging and SEO-friendly FAQ section 
            for a technical article comparing the reliability of different car models. T
            his FAQ will be aimed at potential car buyers. 
            Follow these instructions carefully to create a comprehensive and informative FAQ:

1. Generate a list of 8-10 frequently asked questions that potential car buyers might have regarding the reliability comparison of the cars mentioned. Ensure that the questions cover various aspects such as:
   - Overall reliability rankings
   - Common issues for specific car models
   - Factors affecting reliability
   - Interpretation of the service call statistics
   - Recommendations for buyers based on the data

2. For each question, provide a detailed and informative answer that:
   - Addresses the specific concern raised in the question
   - Incorporates relevant data from the provided statistics
   - Offers insights and explanations in a clear, concise manner
   - Provides value to potential car buyers

3. Format your FAQ section using markdown:
   - Use ## for the main "FAQ" heading
   - Use ### for each question
   - Use regular text for answers
   - Utilize **bold** and *italic* formatting where appropriate to emphasize key points
   - Include bullet points or numbered lists if necessary to break down information

4. Incorporate human-written patterns by:
   - Using a conversational tone that's easy for the average car buyer to understand
   - Varying sentence structures and lengths to maintain reader engagement
   - Including transitional phrases between ideas for smooth readability
   - Adding occasional rhetorical questions to maintain a dialogue-like feel

5. Ensure that your FAQ section is SEO-friendly by:
   - Naturally incorporating relevant keywords related to car reliability, the specific car models, and car buying
   - Using descriptive and informative headings for each question
   - Providing substantial, valuable content in each answer (aim for at least 50-100 words per answer)

6. Begin your response with the markdown-formatted FAQ section, 
starting with the ## FAQ heading. 
Do not include any additional commentary or explanations outside of the FAQ content itself.

Remember to focus on creating an informative, engaging, 
and user-friendly FAQ that will be valuable to potential 
car buyers comparing the reliability of different models.`
		};
	}
	private get filename() {
		return `src/lib/i18n/article_${this.locale}.json`;
	}

	save = (contents: Record<string, string>) => {
		return readFile(this.filename, 'utf8').then((data) => {
			const { title, keywords, description, ...chapters } = contents as unknown as Contents;
			const json = JSON.parse(data);
			if (!json.text.article[this.name]) {
				json.text.article[this.name] = {
					title,
					text: Object.values(chapters).join(''),
					url: new URL(this.url).hash,
					keywords,
					date: new Date().toISOString(),
					description
				};
			}
			return writeFile(this.filename, JSON.stringify(json, null, 2)).then(() => ({
				title,
				keywords,
				description
			}));
		});
	};
}
type Contents = Chapters & Meta;
type Meta = {
	title: string;
	keywords: string;
	description: string;
};
type Chapters = {
	service_call_analysis: string;
	maintenance_cost_comparison: string;
	common_issues_solutions: string;
	buyers_guide: string;
	recall_campaigns: string;
	faq: string;
};

/*
generate a useful engaging seo chapter "Common Issues and Solutions" 
for the technical article "${this.topic}" 
about cars {{CARS}} reliability comparison for potential car buyers.
There are service call statistics {{DEFECTS}}.
This data represents the number of service calls per 10,000 cars sold, 
with the key being the age of the vehicle at the time of contacting the car service.
Format your output using markdown.
Use tables and charts when comparing values.
Use human written patterns;
*/
