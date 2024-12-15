import ytdl from '@distube/ytdl-core';
import {
   createWriteStream,
   existsSync,
   mkdirSync,
} from 'fs';
import path, { resolve } from 'path';
import { chain } from '../utils';

const YOUTUBE_API = `https://www.googleapis.com/youtube/v3/search`;
const MAX_RESULTS = 5;

export class Youtube {
   constructor(private apiKey: string, private car_footage_path: string) {

   }

   getVideo = (query: string) => {
      const directory = resolve(this.car_footage_path, 'query');
      if (!existsSync(directory)) {
         mkdirSync(directory);
      }
      return this.searchVideos(query)
         // .then(videos => Promise.all(videos.map(this.downloadVideo(directory))))
         .then(videos => {
            return videos.reduce<Promise<string | null>>((gettingVideo, video) => {
               return gettingVideo.then((path) => {
                  if (path) { return path; }
                  return this.downloadVideo(directory)(video);
               });
            }, Promise.resolve(null));
         });
      // .then(() => `✅ ${query}`)
      // .catch((e) => `❌ ${query} ${e}`);
   };

   private searchVideos(query: string): Promise<{ videoId, title; }[]> {
      const params = new URLSearchParams({
         part: 'snippet',
         q: query,
         type: 'video',
         videoDuration: 'short',
         videoDefinition: 'high',
         maxResults: `${MAX_RESULTS}`,
         key: this.apiKey,
      });

      return fetch(`${YOUTUBE_API}?${params}`)
         .then(response => {
            if (!response.ok) {
               throw new Error(`Failed to fetch videos: ${response.statusText}`);
            }
            return response.json();
         })
         .then((data) => {
            return data.items.map((item) => ({
               videoId: item.id.videoId,
               title: item.snippet.title,
            }));
         });
   }

   private downloadVideo = (directory: string) => ({ videoId, title }: { videoId: string, title: string; }) => {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      return ytdl.getInfo(videoUrl)
         .then((videoInfo) => {
            // Фильтруем только вертикальные видео
            const format = videoInfo.formats.find(f => f.width && f.height && f.width < f.height && f.container === 'mp4');

            if (!format) {
               return Promise.resolve(null);
            }
            const outputPath = resolve(directory, `${title.replaceAll('/', '_')}.mp4`);
            const readable = ytdl(videoUrl, { format });
            const writable = createWriteStream(outputPath);

            return new Promise<string>((resolve, reject) => {
               readable.pipe(writable);
               writable.on('finish', () => resolve(outputPath));
               writable.on('error', (e) => { console.error(e); resolve(null); });
            });
         });
   };
}


