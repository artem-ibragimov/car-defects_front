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
   scene_breakdown: [number, string][];

   constructor(private cfg: Config, private car_footage_path: string) {
      this.cars = Object.keys(cfg.defects);
   }

   store = () => {
      return new Promise<void>((resolve, reject) => {
         if (this.isFolderExists) {
            return resolve();
         }
         return mkdir(this.folder).then(resolve, reject);
      })
         .then(() =>
            writeFile(this.configPath, JSON.stringify(this.cfg, null, 4))
         );
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

            const car_name = this.cars.find((car_name) => new RegExp(car_name, 'gi').test(name));

            return [Number(time), car_name || this.cars[Math.floor(Math.random() * this.cars.length)]];
         });
   };

   save = (data: { script: string; }) => {
      this.setScript(data.script);
      return writeFile(this.scriptPath, data.script);
   };

   generateVideo() {
      return readdir(this.car_footage_path)
         .then((cars): [number, string][] => {
            if (!this.cars.every((car) => cars.includes(car))) {
               throw new Error(`Footage for ${this.cars.find((car) => !cars.includes(car))} doesn't exist! `);
            }
            let prev_timestamp = 0;
            return this.scene_breakdown
               .map(([time, car]) => {
                  let duration = time - prev_timestamp;
                  prev_timestamp = time;
                  return [duration, resolve(this.car_footage_path, car)] as [number, string];
               })
               .filter(([duration, _]) => duration !== 0);
         }).then((car_paths) => {

            if (!existsSync(this.tempFolder)) {
               mkdirSync(this.tempFolder);
            }


            const videos = car_paths.reduce<[number, string][]>((acc, [duration, path]) => {
               const videos = readdirSync(path).filter((file) => file.endsWith('mp4'));
               const randomVideoPath = resolve(path, videos[Math.floor(Math.random() * videos.length)]);
               return acc.concat([[duration, randomVideoPath]]);
            }, []);


            if (videos.length === 0) {
               return Promise.reject('no enough videos');
            }
            const width = 1080;
            const height = 1920;
            const totalDuration = 4; // Total duration in seconds
            const fps = 60; // Frames per second
            const totalFrames = totalDuration * fps;

            const COLORS = [
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

            const axes: { y: string; x: string; } = { x: 'x axis', y: 'y axis' };
            const configuration = {
               type: 'bar' as keyof ChartTypeRegistry,
               options: {
                  aspectRatio: 1,
                  maintainAspectRatio: false,
                  responsive: true,
                  layout: {
                     padding: 10,
                  },
                  backgroundColor: '#ffffff', // Set background color here

                  plugins: {
                     title: { display: true, text: 'title' },
                     tooltip: {
                        callbacks: {
                           title() {
                              return 'tooltip';
                           }
                        }
                     },
                     legend: {
                        position: 'bottom',
                        display: true
                     }
                  },
                  scales: {
                     x: {
                        title: {
                           display: true,
                           text: axes.x
                        }
                     },
                     y: {
                        max: Math.max(...Object.values(this.cfg.defects).map((v) => Object.values(v).map(Number)).flat()),
                        min: 0,
                        title: {
                           display: true,
                           text: axes.y
                        }
                     }
                  }
               }
            };

            const chartJSNodeCanvas = new ChartJSNodeCanvas({
               backgroundColour: '#ffffff', // Set background color to white
               width, height, chartCallback: (ChartJS) => {
                  ChartJS.defaults.backgroundColor = '#ffffff';
               }
            });

            const generateFrames = (data: Record<string, Record<number, number>>) => {
               return Promise.all(
                  Array.from({ length: totalFrames })
                     .map((_, frameIndex) => {
                        const step = (frameIndex + 1) / totalFrames;
                        console.log('step', step);
                        const framePath = `${this.tempFolder}/frame_${String(frameIndex).padStart(4, '0')}.png`;
                        return chartJSNodeCanvas
                           .renderToBuffer({
                              ...configuration,
                              data: {
                                 datasets: Object.entries(data).map(([label, data], i) => {
                                    console.log('label', label);
                                    return {
                                       label,
                                       data: Object.entries(data).map(([x, y]) => ({ x, y: Number(y) * step })),
                                       borderColor: COLORS[i],
                                       borderWidth: 1,
                                       backgroundColor: `${COLORS[i]}f0`
                                    };
                                 })
                              },
                           })
                           .then((buffer) => writeFile(framePath, buffer));
                     }));
            };

            const createVideo = () => {
               const out = resolve(this.folder, 'chart.mp4');
               return new Promise<void>((resolve, reject) => {
                  ffmpeg()
                     .input(`${this.tempFolder}/frame_%04d.png`)
                     .inputOptions([`-framerate ${fps}`])
                     .outputOptions(['-c:v libx264', `-r ${fps}`, '-pix_fmt yuv420p'])
                     .output(out)
                     .on('end', () => {
                        console.log(`Video created: ${out}`);
                        resolve();
                     })
                     .on('error', reject)
                     .run();
               });
            };

            // Main execution
            return generateFrames(this.cfg.defects)
               .then(() => createVideo())
               .then(() => {
                  // Clean up frames (optional)
                  rmSync(this.tempFolder, { recursive: true, force: true });
               })
               .catch((e) => { debugger; });

            return this.preprocessVideos(videos)
               .then((standardizedVideos) => {
                  const fileList = resolve(this.tempFolder, 'fileList.txt');
                  const fileListContent = standardizedVideos.map(file => `file '${file}'`).join('\n');
                  writeFileSync(fileList, fileListContent);

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
                     .on('end', () => {
                        console.log('Merge completed!');
                        rmSync(this.tempFolder, { recursive: true });
                     })
                     .on('error', err => {
                        console.error('Error during merging:', err.message);
                        if (existsSync(this.tempFolder)) {
                           rmSync(this.tempFolder, { recursive: true });
                        }
                     })
                     .save(this.videoPath);
               });
         });
   }

   private preprocessVideos(videoFiles: [number, string][]): Promise<string[]> {
      return new Promise((res, reject) => {

         const standardizedVideos: string[] = [];
         let completed = 0;

         videoFiles.forEach(([duration, file], index) => {
            const outputFile = resolve(this.tempFolder, `standardized_${index}.mp4`);
            ffmpeg(file)
               .videoCodec('libx264')
               .outputOptions([
                  '-vf scale=1080:1920',
                  '-r 30',  // Set frame rate to 30fps,
                  `-t ${duration}`
               ])
               .noAudio() // Explicitly state there is no audio
               .on('end', () => {
                  standardizedVideos.push(outputFile);
                  completed++;
                  if (completed === videoFiles.length) {
                     res(standardizedVideos);
                  }
               })
               .on('error', reject)
               .save(outputFile);
         });
      });
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

   get tempFolder() {
      return resolve(this.folder, './temp');
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


