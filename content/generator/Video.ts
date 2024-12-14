import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { createCanvas } from 'canvas';
import ffmpeg from 'fluent-ffmpeg';
import {
   existsSync,
   mkdirSync,
   readdirSync,
   rmSync,
   writeFileSync
} from 'fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'path';
import { ChartTypeRegistry } from 'chart.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

ffmpeg.setFfmpegPath(ffmpegPath);


type Key = 'age' | 'mileage';

type Config = {
   name: string;
   key: Key;
   defects: Record<string, Record<string, string>>;
   topic: string;
};


export class Video {
   readonly cars: string[];
   script: string;
   scene_breakdown: [number, string[], boolean][];

   constructor(private cfg: Config, private carFootagePath: string) {
      this.cars = Object.keys(cfg.defects);
      if (!existsSync(this.folder)) {
         mkdirSync(this.folder);
      }
      if (!existsSync(this.chartFolder)) {
         mkdirSync(this.chartFolder);
      }
   }

   store = () => {
      return writeFile(this.configPath, JSON.stringify(this.cfg, null, 4));
   };

   get configPath() {
      return `${this.folder}/cfg.json`;
   }

   // log() {
   //    const filename = './content/' + this.cfg.filename + '.txt';

   //    const data = ;
   //    return readFile(filename)
   //       .then((val) => val.toString())
   //       .then((content) => writeFile(filename, `${content}\n\n${data}`))
   //       .then(() => `video prompt is ready`);
   // }


   get isScriptExists() {
      return existsSync(this.scriptPath);
   }

   get scriptPath() {
      return `${this.folder}/script.txt`;
   }

   loadScript = () => {
      return readFile(this.scriptPath, 'utf-8')
         .then((script) => { this.setScript(script); });
   };
   setScript = (script: string) => {
      this.script = script.slice(script.indexOf('<script>') + '<script>'.length, script.lastIndexOf('</script>')).trim();
      this.scene_breakdown = script
         .slice(script.indexOf('<scene_breakdown>') + '<scene_breakdown>'.length, script.lastIndexOf('</scene_breakdown>'))
         .trim()
         .split('\n')
         .map((line) => {
            const [time, name] = line.split(' - ');
            const cars = this.cars.filter((car_name) => new RegExp(car_name, 'gi').test(name));
            const isChart = new RegExp('chart', 'gi').test(name);
            return [Number(time), cars.length === 0 ? this.cars : cars, isChart];
         });
   };

   save = (data: { script: string; }) => {
      this.setScript(data.script);
      return writeFile(this.scriptPath, data.script).then(()=>`✅ ${this.cfg.topic} script`);
   };


   generateVideo() {
      return readdir(this.carFootagePath)
         .then((cars) => {
            if (!this.cars.every((car) => cars.includes(car))) {
               throw new Error(`Footage for ${this.cars.find((car) => !cars.includes(car))} doesn't exist! `);
            }
            let prev_timestamp = 0;
            const carScenes = this.scene_breakdown
               .map(([time, cars, isChart]) => {
                  let duration = time - prev_timestamp;
                  prev_timestamp = time;
                  const car = cars[Math.floor(Math.random() * cars.length)];
                  return {
                     duration, cars, car, isChart, path: isChart ? resolve(this.chartFolder, car) : resolve(this.carFootagePath, car)
                  };
                  // ,
                  // isChart] as [number, string, boolean];
               })
               .filter(({ duration }) => duration !== 0);

            let chartedCars: string[] = [];
            const chartsRendering = carScenes
               .filter(({ isChart }) => isChart)
               .map(({ duration, car, path }, i) => {
                  chartedCars.push(car);
                  const defects = Object.fromEntries(
                     Object
                        .entries(this.cfg.defects)
                        .filter(([car, _]) => chartedCars.includes(car))
                  );
                  return this.generateChart(defects, path, duration);
               });
            return Promise.all(chartsRendering).then(() => carScenes);
         }).then((carPaths) => {
            const videos = carPaths.reduce<[number, string][]>((acc, { duration, path }) => {
               const videos = readdirSync(path).filter((file) => file.endsWith('mp4'));
               const randomVideoPath = resolve(path, videos[Math.floor(Math.random() * videos.length)]);
               return acc.concat([[duration, randomVideoPath]]);
            }, []);

            if (videos.length === 0) {
               return Promise.reject('no enough videos');
            }

            const tempFolder = resolve(this.folder, 'temp');
            if (!existsSync(tempFolder)) {
               mkdirSync(tempFolder);
            }
            return this.preprocessVideos(videos, tempFolder)
               .then((standardizedVideos) => {
                  const fileList = resolve(tempFolder, 'fileList.txt');
                  const fileListContent = standardizedVideos.map(file => `file '${file}'`).join('\n');
                  writeFileSync(fileList, fileListContent);
                  return new Promise((res, rej) => {
                     ffmpeg()
                        .input(this.voicePath)
                        .input(fileList)
                        .inputOptions(['-f concat', '-safe 0'])
                        .outputOptions([
                           '-c:v libx264',
                           '-crf 28',
                           '-preset medium',
                           '-c:a aac',
                           '-b:a 192k',       // Audio bitrate
                           '-shortest',
                           '-map 1:v:0',
                           '-map 0:a:0',
                        ])
                        .on('start', commandLine => {
                           console.log('FFmpeg command:', commandLine);
                        })
                        .on('progress', progress => {
                           console.log('Progress:', progress.timemark);
                        })
                        .on('end', res)
                        .on('error', rej)
                        .save(this.videoPath);
                  });
               }).then(() => {
                  if (existsSync(tempFolder)) {
                     rmSync(tempFolder, { recursive: true });
                  }
                  if (existsSync(this.chartFolder)) {
                     rmSync(this.chartFolder, { recursive: true });
                  }
               });
         });
   }

   private generateChart = (data: Record<string, Record<string, string>>, folder: string, totalDuration: number) => {
      if (!existsSync(folder)) {
         mkdirSync(folder);
      }
      const chartVideoPath = resolve(folder, 'chart.mp4');
      const width = 1080;
      const height = 1920;
      const fps = 60; // Frames per second
      const totalFrames = totalDuration * fps;

      const barColors = [
         '#4dc9f6',
         '#f67019',
         // '#f53794',
         '#537bc4',
         '#acc236',
         '#166a8f',
         '#00a950',
         '#58595b',
         '#8549ba'
      ];
      const BG = '#fbf9fa';
      const axes: { y: string; x: string; } = { x: `Car ${this.cfg.key}`, y: 'Defects amount' };
      const configuration = {
         type: 'bar',
         options: {
            aspectRatio: 1,
            maintainAspectRatio: false,
            responsive: true,
            layout: {
               padding: 10,
            },
            backgroundColor: BG,

            plugins: {
               title: {
                  display: true,
                  text: 'title',
                  font: {
                     size: 48, // Increase title font size
                  },
               },
               tooltip: {
                  callbacks: {
                     title() {
                        return 'tooltip';
                     }
                  }
               },
               legend: {
                  position: 'bottom',
                  display: true,
                  labels: {
                     font: {
                        size: 48, // Increase legend font size
                        family: 'Arial', // Optionally set a font family
                     },
                  },
               }
            },
            scales: {
               x: {
                  title: {
                     display: true,
                     text: axes.x,
                     font: {
                        size: 42, // Increase X-axis title font size
                     },
                  }
               },
               y: {
                  max: Math.max(...Object.values(this.cfg.defects).map((v) => Object.values(v).map(Number)).flat()),
                  min: 0,
                  title: {
                     display: true,
                     text: axes.y,
                     font: {
                        size: 42, // Increase X-axis title font size
                     },
                  }
               }
            }
         }
      };

      const chartJSNodeCanvas = new ChartJSNodeCanvas({
         backgroundColour: BG,
         width, height,
      });
      const tempFolder = `${folder}_temp`;
      if (!existsSync(tempFolder)) {
         mkdirSync(tempFolder);
      }
      const framesRenderign = Array.from({ length: totalFrames })
         .map((_, frameIndex) => {
            const step = (frameIndex + 1) / totalFrames;
            const framePath = `${tempFolder}/frame_${String(frameIndex).padStart(4, '0')}.png`;
            return chartJSNodeCanvas.renderToBuffer({
               ...configuration,
               data: {
                  datasets: Object.entries(data).map(([label, data], i) => {
                     return {
                        label,
                        data: Object.entries(data).map(([x, y]) => ({ x, y: Number(y) * step })),
                        borderColor: barColors[i],
                        borderWidth: 1,
                        backgroundColor: `${barColors[i]}f0`
                     };
                  })
               },
            })
               .then((buffer) => writeFile(framePath, buffer));
         });
      return Promise
         .all(framesRenderign)
         .then(() =>
            new Promise<void>((res, reject) => {
               ffmpeg()
                  .input(`${tempFolder}/frame_%04d.png`)
                  .inputOptions([`-framerate ${fps}`])
                  .outputOptions(['-c:v libx264', `-r ${fps}`, '-pix_fmt yuv420p'])
                  .output(chartVideoPath)
                  .on('end', res as () => void)
                  .on('error', reject)
                  .run();
            }))
         .then(() => rmSync(tempFolder, { recursive: true, force: true }));
   };

   private preprocessVideos(videoFiles: [number, string][], folder: string): Promise<string[]> {
      const processing = videoFiles.map(([duration, file], index) => {
         return new Promise<string>((res, reject) => {
            const outputFile = resolve(folder, `standardized_${index}.mp4`);
            ffmpeg(file)
               .videoCodec('libx264')
               .outputOptions([
                  '-vf scale=1080:1920',
                  '-r 30',  // Set frame rate to 30fps,
                  `-t ${duration}`
               ])
               .noAudio() // Explicitly state there is no audio
               .on('end', () => {
                  res(outputFile);
               })
               .on('error', reject)
               .save(outputFile);
         });
      });

      return Promise.all(processing);
   }

   get isVideoExists() {
      return existsSync(this.videoPath);
   }
   get isVoiceExists() {
      return existsSync(this.voicePath);
   }

   get voicePath() {
      return resolve(`${this.folder}/voice.mp3`);
   }
   get videoPath() {
      return resolve(`${this.folder}/video.mp4`);
   }

   get isFolderExists() {
      return existsSync(this.folder);
   }
   get folder() {
      return resolve(`./content/video/${this.cfg.name}`);
   }

   get chartFolder() {
      return resolve(this.folder, './chart');
   }

   get scriptPrompt() {
      return `You are an experienced scriptwriter specializing in creating engaging 
      automotive content for short-form videos. 
      Your task is to write a script for a YouTube Short video "${this.cfg.topic}" for potential car buyers,
      comparing the reliability of specific car models. 
      emulating the style of top automotive journalists. 
      The script should be informative, engaging, and fit within the 59 seconds time limit.
      Follow these instructions carefully:

1. First, review the car service call statistics data provided:
<data>
 ${JSON.stringify(this.cfg.defects, null, 2)}, 
</data>
This data represents the number of service calls per 10,000 cars sold, 
with the key being the ${this.cfg.key} of the car at the time of contacting the car service.

2. You will be comparing the following cars in terms of reliability:
<cars>
${this.cars}
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
      
      <script>
      [Insert your script here]
      </script>

      <scene_breakdown>
      [Insert your scene-by-scene breakdown here, using only car names or "<car name> chart" for each line]
      </scene_breakdown>

      For the scene breakdown, use the following format for each line:
      [start time in seconds] - [car name] or [car name] chart

      Example:
      0 - audi a4
      4 - lexus is
      9 - audi a4
      12 - audi a4 chart
      16 - lexus is chart

      Ensure that the scene breakdown covers the entire duration of the video and alternates between the cars or their charts.
      Do not include any additional text or descriptions in this section.
      Provide only one video script that best fits the given topic gand uidelines.
      Remember that each scene should be between 3 and 5 seconds long.
      Remember to keep the content engaging and informative while adhering to the time constraints of a YouTube Short video.
      `;
   }

   get contents() {
      return {
         script: this.scriptPrompt
      };
   }
}


