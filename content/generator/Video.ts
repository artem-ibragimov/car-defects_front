import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ffmpeg from 'fluent-ffmpeg';
import {
   existsSync,
   mkdirSync,
   rmSync,
   writeFileSync
} from 'fs';
import { exec } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'path';
import puppeteer from 'puppeteer';

ffmpeg.setFfmpegPath(ffmpegPath);
// ffmpeg.setFfmpegPath('/opt/homebrew/bin/ffmpeg');


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
   scene_breakdown: { duration: number, isChart: boolean, query: string; car: string; }[];

   private backgroundMusic: string;
   constructor(private cfg: Config, backgroundMusicsFolder: string) {
      this.cars = Object.keys(cfg.defects);
      if (!existsSync(this.folder)) {
         mkdirSync(this.folder);
      }
      const tracks = readdirSync(backgroundMusicsFolder);
      this.backgroundMusic = resolve(backgroundMusicsFolder, tracks[Math.floor(Math.random() * tracks.length)]);
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
         .filter(Boolean)
         .map((line) => {
            const [time, query] = line.split(' - ');
            // const cars = this.cars.filter((car_name) => new RegExp(car_name, 'gi').test(query));
            const isChart = new RegExp('chart', 'gi').test(query);
            const car = isChart &&
               this.cars.find((car) => new RegExp(car, 'gi').test(query)) ||
               this.cars[Math.floor(Math.random() * this.cars.length)];
            return { duration: Number(time), car, isChart, query };
         })
         .filter(({ duration }) => !isNaN(duration));
      const video_duration = this.scene_breakdown.reduce((total, { duration }) => total + duration, 0);
      if (video_duration < 60) {
         const additional_videos =
            Array
               .from({ length: (60 - video_duration) / 4 })
               .map(() => {
                  const car = this.cars[Math.floor(Math.random() * this.cars.length)];
                  return {
                     duration: 4,
                     isChart: false,
                     car,
                     query: car,
                  };
               });
         this.scene_breakdown = this.scene_breakdown.concat(additional_videos);
      }
   };

   save = (data: { script: string; }) => {
      this.setScript(data.script);
      return writeFile(this.scriptPath, data.script).then(() => `✅ script`);
   };

   generateVideo(downloadVideo: (query: string) => Promise<string>, hash: string) {
      return this.recordCharts(hash);
      const carScenes = this.scene_breakdown
         .map(({ duration, query, car, isChart }) => {
            return {
               duration,
               car,
               isChart,
               path: isChart ? resolve(this.chartFolder, car, 'chart.mp4') : '',
               query: isChart ? '' : query
            };
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
            return this.generateChart({ defects, path, car, duration });
         });
      return Promise.all(chartsRendering)
         .then(() => {
            const videosGetting: Promise<[number, string]>[] = carScenes.map((scene) => {
               if (scene.path) { return Promise.resolve([scene.duration, scene.path]); }
               return downloadVideo(scene.query).then((path) => [scene.duration, path]);
            });

            const tempFolder = resolve(this.folder, 'temp');
            if (!existsSync(tempFolder)) {
               mkdirSync(tempFolder);
            }
            return Promise.all(videosGetting)
               .then((videos) => this.preprocessVideos(videos, tempFolder))
               .then((standardizedVideos) => {
                  const fileList = resolve(tempFolder, 'fileList.txt');
                  const fileListContent = standardizedVideos.map(file => `file '${file}'`).join('\n');
                  writeFileSync(fileList, fileListContent);
                  return new Promise((res, rej) => {
                     ffmpeg()
                        .input(fileList)
                        .inputOptions(['-f concat', '-safe 0'])
                        .input(this.backgroundMusic)
                        .input(this.voicePath)
                        // Add background music and voiceover

                        // Filter complex to handle audio mixing
                        .complexFilter([
                           // Set background music volume to 20% (0.2)
                           '[1:a]volume=0.2[bgm]',
                           // Mix voiceover (as is) and background music
                           '[bgm][2:a]amix=inputs=2:duration=shortest[audioMix]',
                           // Send the video output and mixed audio to the final output
                           '[0:v]setpts=PTS-STARTPTS[v]',
                        ])

                        // Map video and the mixed audio
                        .outputOptions(['-map [v]', '-map [audioMix]', '-c:v libx264', '-c:a aac', '-b:a 192k', '-shortest'])

                        // .outputOptions([
                        //    '-c:v libx264',
                        //    '-crf 28',
                        //    '-preset medium',
                        //    '-c:a aac',
                        //    '-b:a 192k',       // Audio bitrate
                        //    '-shortest',
                        //    '-map 1:v:0',
                        //    '-map 0:a:0',
                        // ])
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
               })
               .then(() => {
                  if (existsSync(tempFolder)) {
                     rmSync(tempFolder, { recursive: true });
                  }
                  if (existsSync(this.chartFolder)) {
                     rmSync(this.chartFolder, { recursive: true });
                  }
               })
               .then(() => `✅ video`);
         });
   }

   private generateChart = ({ car, defects, path, duration }: { path: string, defects: Record<string, Record<string, string>>, car: string, duration: number; }) => {
      const folder = resolve(this.chartFolder, car);
      if (!existsSync(folder)) {
         mkdirSync(folder);
      }
      const width = 1080;
      const height = 1920;
      const fps = 60;
      const totalFrames = duration * fps;

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
               datalabels: {
                  color: 'black',
                  font: {
                     size: 54,
                     weight: 'bold'
                  },
                  // clamp: true,
                  anchor: 'end', // Расположение текста
                  align: 'top',  // Выравнивание текста
                  formatter: ({ y }: { y: string; }) => Number(y).toFixed(2) // Отображаемые данные
               },
               title: {
                  display: true,
                  text: 'Service Calls',
                  font: {
                     size: 48, // Increase title font size
                  },
               },
               tooltip: {
                  display: true,
                  text: 'Service Calls',
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
                  max: Math.max(...Object.values(this.cfg.defects).map((v) => Object.values(v).map(Number)).flat()) * 2,
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
         chartCallback(chartjs) {
            chartjs.register(ChartDataLabels);
         }
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
                  datasets: Object.entries(defects).map(([label, data], i) => {
                     return {
                        label,
                        data: Object.entries(data).map(([x, y]) => ({ x, y: Number(y) * 0.8 + Number(y) * 0.2 * step })),
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
                  .output(path)
                  .on('end', res as () => void)
                  .on('error', (e) => {
                     console.error(e);
                     res();
                  })
                  .run();
            }))
         .then(() => rmSync(tempFolder, { recursive: true, force: true }));
   };

   private preprocessVideos(videoFiles: [number, string][], folder: string): Promise<string[]> {
      const processing = videoFiles.map(([duration, file], index) => {
         return new Promise<string>((res, reject) => {
            const outputFile = resolve(folder, `standardized_${index}.mp4`);
            ffmpeg(file)
               .videoCodec('h264_videotoolbox')
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

   private async recordCharts(url: string) {
      const duration = 10;
      const position = { x: 0, y: 220 };
      const viewport = { width: 430, height: 932 };
      const outputFilePath = resolve(this.folder, 'screencast.mp4');
      console.log('Starting screen recording...');

      const browsering = puppeteer
         .launch({
            defaultViewport: viewport,
            headless: false, // Use `false` to see the browser, or `true` for headless mode
            args: [
               '--enable-usermedia-screen-capturing',
               '--disable-infobars',
               '--no-sandbox',
               '--disable-setuid-sandbox',
               `--window-size=${viewport.width},${viewport.height}`,
               `--window-position=${0},${0}` // Adjust as needed
            ]
         })
         .then((browser) =>
            browser
               .newPage()
               .then((page) => ({ page, browser })))
         .then(({ page, browser }) => {

            // page.setViewport(viewport);
            const targetURL = url; // Replace with your URL
            console.log(`Navigating to ${targetURL}...`);
            const capturing = new Promise((resolve, reject) => {
               exec(`ffmpeg -f avfoundation -framerate 30 -video_size 2560x1600 -pix_fmt nv12 -probesize 50M -analyzeduration 100M -i 2 -y -vcodec h264_videotoolbox -filter:v crop=${viewport.width * 2}:${viewport.height}:${position.x}:${position.y} -t ${duration} ${outputFilePath}`, (err, stdout, stderr) => {
                  if (err) {
                     return reject(err);
                  }
                  stderr && console.error(stderr);
                  resolve(stdout);
               });
            });
            return page
               .goto(targetURL, { waitUntil: 'networkidle2' })
               .then(async () => {
                  await installMouseHelper(page);
                  await page.evaluate(() => {
                     const chart = document.querySelector('div.Chart');
                     if (chart) {
                        chart.scrollIntoView({ behavior: 'smooth', block: 'start' });
                     }
                  });

                  // Ждем появления элемента
                  await page.waitForSelector('div.Chart');

                  // Перемещаем мышь на элемент div.Chart
                  const chart = await page.$('div.Chart');
                  if (!chart) { return; }
                  const box = await chart.boundingBox();

                  if (box) {
                     const startX = box.x;
                     const startY = 100 + box.height / 2; // Центр по вертикали
                     const endX = box.x + box.width;

                     // Двигаем мышь слева направо
                     for (let x = startX; x <= endX; x += 10) {
                        await page.mouse.down();
                        await page.mouse.move(x, startY);
                        await page.mouse.up();
                        await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 500)));
                     }
                  }

                  // Ждем окончания скринкаста
                  return capturing;
               })
            .then(() => browser.close());
         });

      return browsering;
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
      The script should be informative, engaging, and fit within the 140-word limit.
      Follow these instructions carefully:

1. First, review the car service call statistics data provided:
<data>
 ${JSON.stringify(this.cfg.defects, null, 2)}, 
</data>
This data represents the number of service calls per 10 thousands cars sold, 
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
      [Insert your scene-by-scene breakdown here, using only youtube video footage search query or "<car name> chart" for each line]
      </scene_breakdown>

      There should be only one scene with a chart for each car and only when the script refers to the number of defects.

      For the scene breakdown, use the following format for each line:
      [fragment duration time in seconds] - [youtube video footage search query] or [car name] chart

      Example:
      2 - audi a4
      4 - audi a4 chart
      5 - lexus is
      1 - audi a4
      5 - lexus is chart
      3 - audi a4
      8 - lexus is
      5 - audi a4

      Ensure that the scene breakdown covers the entire duration of the video and alternates between the cars or their charts.
      Keep in mind that the narrator will be reading the script at 2.7 words per second, so adjust the duration of the scenes accordingly.
      Do not include any additional text or descriptions in this section.
      Provide only one video script that best fits the given topic gand uidelines.
      Remember to keep the content engaging and informative while adhering to the time constraints of a YouTube Short video.
      `;
   }

   get contents() {
      return {
         script: this.scriptPrompt
      };
   }
}

async function installMouseHelper(page) {
   await page.evaluateOnNewDocument(() => {
      // Install mouse helper only for top-level frame.
      if (window !== window.parent)
         return;
      window.addEventListener('DOMContentLoaded', () => {
         const box = document.createElement('puppeteer-mouse-pointer');
         const styleElement = document.createElement('style');
         styleElement.innerHTML = `
         puppeteer-mouse-pointer {
           pointer-events: none;
           position: absolute;
           top: 0;
           z-index: 10000;
           left: 0;
           width: 20px;
           height: 20px;
           background: rgba(0,0,0,.4);
           border: 1px solid white;
           border-radius: 10px;
           margin: -10px 0 0 -10px;
           padding: 0;
           transition: background .2s, border-radius .2s, border-color .2s;
         }
         puppeteer-mouse-pointer.button-1 {
           transition: none;
           background: rgba(0,0,0,0.9);
         }
         puppeteer-mouse-pointer.button-2 {
           transition: none;
           border-color: rgba(0,0,255,0.9);
         }
         puppeteer-mouse-pointer.button-3 {
           transition: none;
           border-radius: 4px;
         }
         puppeteer-mouse-pointer.button-4 {
           transition: none;
           border-color: rgba(255,0,0,0.9);
         }
         puppeteer-mouse-pointer.button-5 {
           transition: none;
           border-color: rgba(0,255,0,0.9);
         }
       `;
         document.head.appendChild(styleElement);
         document.body.appendChild(box);
         document.addEventListener('mousemove', event => {
            box.style.left = event.pageX + 'px';
            box.style.top = event.pageY + 'px';
            updateButtons(event.buttons);
         }, true);
         document.addEventListener('mousedown', event => {
            updateButtons(event.buttons);
            box.classList.add('button-' + event.which);
         }, true);
         document.addEventListener('mouseup', event => {
            updateButtons(event.buttons);
            box.classList.remove('button-' + event.which);
         }, true);
         function updateButtons(buttons) {
            for (let i = 0; i < 5; i++)
               box.classList.toggle('button-' + i, buttons & (1 << i));
         }
      }, false);
   });
};