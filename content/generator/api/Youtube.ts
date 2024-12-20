import ytdl from '@distube/ytdl-core';
import {
   createWriteStream,
   existsSync,
   mkdirSync,
   readdirSync,
} from 'fs';
import { mkdir, readdir } from 'fs/promises';
import { resolve } from 'path';

const YOUTUBE_API = `https://www.googleapis.com/youtube/v3/search`;
const MAX_RESULTS = 7;

export class Youtube {
   constructor(private apiKey: string, private car_footage_path: string) {

   }

   getVideo = (query: string) => {
      const directory = resolve(this.car_footage_path, query);
      if (!existsSync(directory)) {
         mkdirSync(directory);
      }
      return this.searchVideos(query)
         // .then(videos => Promise.all(videos.map(this.downloadVideo(directory))))
         .then((videos) => videos.sort(() => Math.random() - 0.5))
         .then((videos) => {
            return videos.reduce<Promise<string | null>>((gettingVideo, video) => {
               return gettingVideo.then((path) => {
                  if (path) { return path; }
                  return this.downloadVideo(directory)(video);
               });
            }, Promise.resolve(null));
         })
         .then((path) => {
            if (path === null) {
               throw new Error('no video path!');
            }
            return path;
         }).catch(() => {
            const downloadedVideos = readdirSync(directory);
            if (downloadedVideos.length > 0) {
               const videos = downloadedVideos.filter((name) => !name.includes('.DS_Store'));
               const randomVideo = videos[Math.floor(Math.random() * videos.length)];
               return Promise.resolve(resolve(directory, randomVideo));
            }
         });
   };

   private searchVideos(query: string): Promise<{ videoId, title; }[]> {
      const params = new URLSearchParams({
         part: 'snippet',
         q: query,
         type: 'video',
         /**
          * date — последние загруженные видео.
          * relevance — максимально релевантные видео.
          * viewCount — популярные видео.
          */
         order: 'relevance',
         regionCode: 'US',
         videoDuration: 'short',
         videoDefinition: 'high',
         maxResults: `${MAX_RESULTS}`,
         key: this.apiKey,
      });

      return fetch(`${YOUTUBE_API}?${params}`)
         .then(response => {
            if (!response.ok) {
               return response.json().then((e) => { throw new Error(`Failed to fetch videos: ${JSON.stringify(e, null, 2)}`); });
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
            let format = videoInfo.formats.find(f => f.width && f.height && f.width < f.height && f.container === 'mp4');

            if (!format) {
               format = videoInfo.formats.find(f => f.container === 'mp4');
            }

            const outputPath = resolve(directory, `${title.replaceAll('/', '_')}.mp4`);
            const readable = ytdl(videoUrl, { format });
            const writable = createWriteStream(outputPath);

            return new Promise<string | null>((resolve) => {
               readable.pipe(writable);
               writable.on('finish', () => resolve(outputPath));
               writable.on('error', (e) => { console.error(e); resolve(null); });
            });
         });
   };
}


